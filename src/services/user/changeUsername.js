'use strict'
import feathers from '@feathersjs/feathers'
import express from '@feathersjs/express'
import config from '../../../config'
import {profileSerializer} from 'utils/serializer'
import {user, castUserId} from 'model/user'
import {logger} from 'utils/logger'
import {encoder} from 'utils/jwt'
import {hash, isValidPassword} from 'utils/passwords'

export const  PASSWORD_SALT = config.secret
const app = express( feathers() )

const response = ( status, data, res ) => {
	res.status( status )
	res.send( JSON.stringify( data ) )
}

app.post( '/', async ( req, res ) => {
	const {password, newUsername} = req.body

	try {
		const checkUser = await user.findOne({username: newUsername})
		if ( checkUser ) {
			return response( 400, {error: 'username_already_taken'}, res )
		}
		const checkPassword = await user.findOne({
			_id      : castUserId( req.session._id ),
			password : hash( password, PASSWORD_SALT ),
			isDeleted: false
		})
		if ( !checkPassword ) {
			return response( 400, {error: 'invalid_password'}, res )
		}
		if ( checkPassword.hasChangedUsername ) {
			return response( 400, {error: 'username_can_only_be_changed_once'}, res )
		}
		const newUser = await user.findOneAndUpdate({_id: checkPassword._id}, {$set: {username: newUsername}}, {new: true})
		response( 200, {newUser}, res )
	} catch ( e ) {
		response( 400, {error: 'error_retrieving_data'}, res )
		logger( e )
	}
})

export default app
