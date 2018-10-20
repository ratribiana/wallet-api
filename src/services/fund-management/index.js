'use strict'
import feathers from '@feathersjs/feathers'
import express from '@feathersjs/express'
import Transaction from 'mongoose-transactions'
import {user} from 'model/user'
import sanitize from 'mongo-sanitize'
import {logger} from 'utils/logger'
import {insufficientFund} from 'utils/computations'
import {userTransaction} from 'utils/transactions'
const LIMIT = 100000
const app = express( feathers() )

const response = ( status, data, res ) => {
	res.status( status )
	res.send( JSON.stringify( data ) )
}

const setFromToUser = async ( action, sessionID, userID ) => {
	let from = sessionID
	let to = userID
	const result = []

	if ( action == 'debit' ) {
		from = userID
		to = sessionID
	}
	const users = await user.find({
		'_id': {$in: [from, to]}
	})
	users.map( ( user ) => {
		if ( from == user._id ) {
			result[ 'fromUser' ] = user
		} else {
			result[ 'toUser' ] = user
		}
	})
	return result
}

const userToUser = ( from, to, amount, remarks ) => [
	{
		_id            : from._id,
		isCredit       : false,
		amount,
		transactionNote: remarks,
		transactionType: 'adjusted-by-admin',
		status    				 : 'complete'
	},
	{
		_id            : to._id,
		isCredit       : true,
		amount,
		transactionNote: remarks,
		transactionType: 'adjusted-by-admin',
		status    				 : 'complete'
	}
]

app.put( '/', async ( req, res ) => {
	const {accountType, remarks, amount, transactionPassword, user: {id}, action} = sanitize( req.body )
	if ( amount > LIMIT ) {
		return response( 400, {error: 'error_amount_too_large'}, res )
	}
	const transaction = new Transaction()
	try {
		const users = await setFromToUser( action, req.session._id, id )
		if ( users[ 'toUser' ] &&  users[ 'fromUser' ] ) {
			if ( !users[ 'toUser' ].isAdmin && action == 'debit' ){
				if ( await insufficientFund( users[ 'toUser' ].account.cashBalance, amount, 'deduct' ) ) {
					return response( 400, {error: 'error_insufficient_funds'}, res )
				}
			}
			await userToUser( users[ 'fromUser' ], users[ 'toUser' ], amount, remarks ).map( async ( transactionData )=>{
				await userTransaction( transaction, transactionData, accountType )
			})
			const result = await transaction.run()
			response( 200, {success: 'transfer_successful', result}, res )
		} else {
			response( 404, {error: 'error_user_not_found'}, res )
		}
	} catch ( e ) {
		transaction.rollback()
		logger( e )
		response( 400, {error: 'error_updating_data'}, res )
	}
})

export default app
