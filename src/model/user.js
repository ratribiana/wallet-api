'use strict'
import mongoose from 'mongoose'
import config from '../../config'
const {Schema} = mongoose
mongoose.plugin( require( 'mongoose-regex-search' ) )
import {EventEmitter} from 'events'
import {hash, isValidPassword} from 'utils/passwords'
import md5 from 'md5'
export const  PASSWORD_SALT = config.secret
const MAX_SUGGESTIONS = config.maxSuggetions
import sanitize from 'mongo-sanitize'
const e = new EventEmitter()

const schema = new Schema({
	username: {
		type      : String,
		required  : true,
		unique    : 'username_already_registered',
		index     : true,
		searchable: true
	},
	password: {
		type    : String,
		required: true
	},
	wallet: {
		cashBalance: {
			type   : Number,
			default: 0
		}
	},
	email: {
		type      : String,
		required  : true,
		index     : true,
		searchable: true
	},
	personalInfo: new Schema({
		firstname: {
			type      : String,
			index     : true,
			searchable: true,
			default   : ''
		},
		lastname: {
			type      : String,
			index     : true,
			searchable: true,
			default   : ''
		}
	}),
	registered: {
		type    : Date,
		required: true,
		default : Date.now
	},
	verified: {
		type   : Date,
		default: null
	},
	isActive: {
		type   : Boolean,
		default: true
	}
})

function autoPopulatePartners ( next ) {
	this.populate( 'partners' )
	next()
}

const checkIfEmail = ( email ) => {
	var pattern = /\S+@\S+\.\S+/
	return pattern.test( email )
}

export class UserClass {
	static async login ( identifier, password ) {
		const creds = checkIfEmail( identifier )? {email: identifier} : {username: identifier}

		const user = await this.findOne({
			...creds,
			password : hash( password, PASSWORD_SALT ),
			isActive: true
		}).exec()

		if ( user ) {
			if ( !user.verified ) {
				return {user, error: 'account_not_verified'}
			} else {
				return user
			}
		} else {
			throw new Error( 'invalid_credentials' )
		}
	}

	static async register ( user ) {
		const userData = {}
		const created = await this.create(
			Object.assign( userData, user, {
				password           : user.password && hash( user.password, PASSWORD_SALT ),
				transactionPassword: user.transactionPassword && hash( user.transactionPassword, PASSWORD_SALT )
			})
		)
		return created
	}

	static async changePassword ( _id, password, newPassword ) {
		const oldPassword = hash( password, PASSWORD_SALT )
		const newerPassword = hash( newPassword, PASSWORD_SALT )
		if ( oldPassword == newerPassword ) {
			return {error: 'error_same_password'}
		}
		return this.findOneAndUpdate(
			{
				_id,
				password: oldPassword
			},
			{password: newerPassword},
			{new: true}
		).exec()
	}

	static updateRegistration ( user ) {
		const update = {...user}
		if ( update.password ) {
			if ( !isValidPassword( update.password ) ) {
				throw new Error( 'invalid_password' )
			}
			update.password = hash( update.password, PASSWORD_SALT )
		}

		if ( update.username && update.email && update.mobile  && update.personalInfo.firstname && update.personalInfo.lastname && update.personalInfo.gender && update.personalInfo.dateOfBirth && update.contactInfo.addressLine1 && update.contactInfo.zipCode && update.contactInfo.country && update.contactInfo.state && update.contactInfo.city ) {
			update.isProfileComplete = true
		}

		return this.findOneAndUpdate(
			{
				_id: update._id
			},
			update,
			{new: true}
		).exec()
	}

	static updatePassword ( _id, password, currentPassword ) {
		if ( hash( password, PASSWORD_SALT ) == currentPassword ) {
			return false
		}
		return this.findOneAndUpdate(
			{
				_id
			},
			{password: hash( password, PASSWORD_SALT ), lastLogin: Date.now()},
			{new: true}
		).exec()
	}
}
schema.loadClass( UserClass )

export const castUserId = ( userId ) => mongoose.Types.ObjectId( userId )
export const user = mongoose.model( 'Users', schema )
