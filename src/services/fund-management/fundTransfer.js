'use strict'
import feathers from '@feathersjs/feathers'
import express from '@feathersjs/express'
import Transaction from 'mongoose-transactions'
import {user} from 'model/user'
import sanitize from 'mongo-sanitize'
import {logger} from 'utils/logger'
import {accountBalanceSummation,insufficientFund} from 'utils/computations'
import {userTransaction} from 'utils/transactions'

const app = express( feathers() )

const response = ( status, data, res ) => {
	res.status( status )
	res.send( JSON.stringify( data ) )
}

app.post( '/', async ( req, res ) => {
	const transferInfo = sanitize( req.body )
	const transaction = new Transaction()
	try {
		const fromUser = await user.findOne({_id: transferInfo.fromUserID})
		const toUser = await user.findOne({_id: transferInfo.toUserID})
		if ( fromUser && toUser ){
			if ( !fromUser.isAdmin && await insufficientFund( fromUser.account.cashBalance, transferInfo.amount , 'deduct' )  ){
				return response( 400, {error: 'error_insufficient_funds'}, res )
			}
			const userToUser = [
				{
					_id            : fromUser._id,
				  isCredit       : false,
				  amount         : transferInfo.amount,
					transactionNote: transferInfo.remarks,
					status    				 : 'complete'
				},
				{
					_id            : toUser._id,
		        isCredit       : true,
					amount         : transferInfo.amount,
					transactionNote: transferInfo.remarks,
					status    				 : 'complete'
				}
			]
			await userToUser.map( async ( transactionData )=>{
				await userTransaction( transaction, transactionData, 'cash' )
			})
			const result = await transaction.run()
			response( 200, {success: 'transfer_successful', result}, res )
		} else {
			response( 404, {error: 'error_user_not_found'}, res )
		}
	} catch ( e ) {
		transaction.rollback()
		response( 400, {error: 'transfer_failed'}, res )
		logger( e )
	}
})

export default app
