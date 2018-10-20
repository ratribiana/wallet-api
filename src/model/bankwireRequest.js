'use sctrict'

import mongoose from 'mongoose'
import config from '../../config'
import user from 'model/user'
const {Schema} = mongoose

const schema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref : 'Users'
	},
	amount: {
		type    : Number,
		required: true
	},
	createdAt: {
		type   : Date,
		default: Date.now
	},
	releasedAt: {
		type: Date
	},
	released: {
		type   : Boolean,
		default: false
	},
	isDeleted: {
		type   : Boolean,
		default: false
	}
})

export class BankwireRequestClass{
}

schema.loadClass( BankwireRequestClass )

export const bankwireRequest = mongoose.model( 'BankwireRequests', schema )
