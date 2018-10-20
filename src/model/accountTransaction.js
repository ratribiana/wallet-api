'use sctrict'
import mongoose from 'mongoose'
import config from '../../config'

const {Schema} = mongoose

const schemaContent = {
	userID: {
		type: Schema.Types.ObjectId,
		ref : 'Users'
	},
	isCredit: {
		type    : Boolean,
		required: true
	},
	amount: {
		type   : Number,
		default: 0
	},
	transactionType: {
		type   : String,
		default: null
	},
	status: {
		type   : String,
		default: 'pending'
	},
	date: {
		type    : Date,
		required: true,
		default : Date.now
	},
	isRollbacked: {
		type   : Boolean,
		default: false
	},
	isDeleted: {
		type   : Boolean,
		default: false
	}
}

const accountsOptions = {
	discriminatorKey: '__type',
	collection      : 'accounttransaction'
}

const cashTransactionsSchema = new Schema( schemaContent )

export const accounts = mongoose.model( 'AccountTransactions', new Schema({}, accountsOptions ) )
export const cashTransactions = accounts.discriminator( 'CashTransactions', cashTransactionsSchema )
