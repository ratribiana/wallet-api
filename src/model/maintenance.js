'use strict'
import mongoose from 'mongoose'
const {Schema} = mongoose

const schema = new Schema({
	isMaintenance: {
		type    : Boolean,
		default : false,
		required: true
	},
	isLoginBlocked: {
		type    : Boolean,
		default : false,
		required: true
	},
	isRegistrationBlocked: {
		type    : Boolean,
		default : false,
		required: true
	},
})

export class MaintenanceClass {}

schema.loadClass( MaintenanceClass )

export const maintenance = mongoose.model( 'Maintenance', schema )
