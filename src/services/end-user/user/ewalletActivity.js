'use strict'
import feathers from '@feathersjs/feathers'
import express from '@feathersjs/express'
import {castUserId} from 'model/user'
import {logger} from 'utils/logger'
import {cashTransactions} from 'model/accountTransaction'
const SORT_DECENDING = -1
const app = express( feathers() )

const response = ( status, data, res ) => {
	res.status( status )
	res.send( JSON.stringify( data ) )
}

app.get( '/:transactionType/:limit/:offset', async ( req, res ) => {
	const types = {
		funding: ['add-funding'],
		payout : ['user-payout']
	}
	try {
		const {transactionType,limit,offset} = req.params
		const {_id} = req.session
		const transaction = transactionType == 'all'?types.funding.concat( types.payout ):types[ transactionType ]
		const status = ['complete','pending','cancel']
		let walletActivities, coinActivities
		if ( ! +limit ){
			walletActivities = await cashTransactions.find({
				userID         : castUserId( _id ),
				transactionType: {$in: transaction},
				status        	: {$in: status},
			}).sort({'date': SORT_DECENDING})

		} else {
			walletActivities = await cashTransactions.find({
				userID         : castUserId( _id ),
				transactionType: {$in: transaction}
			}).sort({'date': SORT_DECENDING}).limit( +limit ).offset( +offset )
		}
		walletActivities = [...walletActivities, ...coinActivities]
		let result = []
		if ( walletActivities.length ){
			result = walletActivities.map( transaction => {
				let {transactionType}  = transaction
				return {
					isCredit     : transaction.isCredit,
					amount       : transaction.amount||transaction.coinValue,
					initialAmount: transaction.initialAmount,
					pendingAmount: transaction.pendingAmount,
					status       : transaction.status,
					paymentMode  : transaction.paymentMode||'',
					date         : transaction.date,
					type         : transactionType.substring( transactionType.indexOf( '-' )+1 ),
					note         : transaction.transactionNote,
					dateTransact : transaction.dateUpdated
				}
			})
		}
		response( 200, result, res )
	} catch ( e ) {
		response( 400, {error: 'error_retrieving_data'}, res )
		logger( e )
	}
})

export default app
