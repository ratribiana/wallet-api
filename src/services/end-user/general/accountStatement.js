'use strict'
import feathers from '@feathersjs/feathers'
import express from '@feathersjs/express'
import {cashTransactions, shoppingTransactions, charityTransactions, tradingTransactions} from 'model/accountTransaction'
import {castUserId} from 'model/user'
import {logger} from 'utils/logger'
import moment from 'moment'

const app = express( feathers() )

const response = ( status, data, res ) => {
	res.status( status )
	res.send( JSON.stringify( data ) )
}

app.get( '/:account/:fromDate/:toDate', async ( req, res ) => {
	const {account, fromDate, toDate} = req.params
	const formatedToDate = new Date( toDate ).getTime() + 1000 * 86400 * 1
	const searchVariables = {userID: castUserId( req.session._id ), status: {$in: ['complete','Complete']}, isRollbacked: false, date: {$gte: new Date( fromDate ), $lt: new Date( formatedToDate )}}
	let statement
	try {
		switch ( account ) {
		case 'cash':
			statement = await cashTransactions.find( searchVariables )
			break
		case 'trading':
				 	statement = await tradingTransactions.find( searchVariables )
			break
		case 'charity':
			statement = await charityTransactions.find( searchVariables )
			break
		case 'shopping':
			statement = await shoppingTransactions.find( searchVariables )
			break
		default:
			statement = {error: 'invalid_account_category'}
		}
		return response( 200, statement, res )
	} catch ( e ) {
		response( 400, {error: 'error_retrieving_data'}, res )
		logger( e )
	}
})

export default app
