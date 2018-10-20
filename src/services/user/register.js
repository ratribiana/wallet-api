'use strict'
import feathers from '@feathersjs/feathers'
import express from '@feathersjs/express'
import {registerSerializer} from 'utils/serializer'
import config from '../../../config'
import {logger} from 'utils/logger'
import {user} from 'model/user'
import {encoder} from 'utils/jwt'
import {siteStatus} from 'utils/maintenance'

const app = express( feathers() )

const encode = encoder({
	secret         : config.verifierSecret,
	expireInSeconds: 900 //15min
})

const register = ( res, status, data ) => {
	res.status( status ).send( JSON.stringify( data ) )
}
app.post( '/', async ( req, res ) => {
	if ( ( await siteStatus() ).isRegistrationBlocked ) {
		res.status( 500 ).send({RegistrationBlocked: true})
	}
	
	const registerUser = registerSerializer( req.body )

	 var format = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
	 if(format.test(registerUser.username)) {
		 return register( res, 400, {error: 'error_special_character_not_allowed'})
	 }

	try {
		const ifExist = await user.findOne({$or: [{username: registerUser.username}, {email: registerUser.email}]}).countDocuments()

		if ( ifExist ) {
			return register( res, 400, {error: 'error_user_already_exist'})
		}

		if (  /^\s+$/.test( registerUser.username )  ||
					/^\s+$/.test( registerUser.password ) ||
					/^\s+$/.test( registerUser.email )
			 ){
			return register( res, 400, {error: 'error_saving_data'})
		}

		const newUser = await user.register( registerUser )
		register( res, 200, {message: 'Registration Success'})
	} catch ( e ) {
		register( res, 400, {error: 'error_saving_data', code: e.code})
		logger( e )
	}
})

export default app
