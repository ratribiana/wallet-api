'use strict'

const createTransaction = async ( transaction, type, account, data ) => {
	await transaction.update( 'Users', data._id, {$inc: {[ account ]: data.amount * ( data.isCredit?1:-1 )}}, {new: true})
	await transaction.insert( type, {
		userID            : data._id,
		amount            : data.amount,
		isCredit          : data.isCredit,
		paymentMode   	   : data.paymentMode,
		transactionType   : data.transactionType,
		invoiceID         : data.invoiceID,
		miningCredits     : data.miningCredits || 0,
		quantity          : data.quantity || 1,
		discount          : data.discount || 0,
		initialAmount     : data.initialAmount,
		transactionNote   : data.transactionNote,
		status       				 : data.status || 'pending',
		payoutID      			 : data.payoutID || null,
		backoffice_version: data.backoffice_version || '2.0',
		date              : data.date
	})
}

export const userTransaction = async ( transaction, data, type ) => {
	await createTransaction( transaction, `${type.replace( /^\w/, c => c.toUpperCase() )}Transactions`, `account.${type}Balance`, data )
}

export const createTransactions = async ( transaction, queries=[] ) => {
	for ( let i = 0; i < queries.length; i++ ){
		const query = queries[ i ]
		const queryMethod = Object.keys( query )[ 0 ]
		transaction[ queryMethod ]( ...query[ queryMethod ] )
	}
}
