'use strict'
import feathers from '@feathersjs/feathers'
import express from '@feathersjs/express'
import config from '../../../config'
import {logger} from 'utils/logger'
import {encoder} from 'utils/jwt'
import {user} from 'model/user'

const app = express( feathers() )

const encode = encoder({
	secret         : config.verifierSecret,
	expireInSeconds: 900 //15min
})

const resend = ( status, data, res, error='' ) => {
	if ( status == 400 || status == 401 ) {
		logger( error )
	}
	res.status( status )
	res.send( JSON.stringify( data ) )
}

app.post( '/', async ( req, res ) => {
	const {email} = req.body
	try {
		const result = await user.findOne({email})
		if ( result ){
			const {_id, verified} = result
			if ( !verified ) {
				const newToken = {token: encode({_id})}
				const emailFrom = config.env == 'production'? result.email: config.emailUsername
				const url = `${config.protocol}://${req.frontEndUrl}/verify/${newToken.token}`
				const replacements = [
					{replaceable: '{tokenLink}', replacement: url},
					{replaceable: '{userName}', replacement: result.username || 'User'},
				]
				req.sendEmail( email, replacements, 'Validation Email', result.username )
				resend( 200, newToken, res )
			} else {
				resend( 400, {message: 'username_already_verified'}, res )
			}
		} else {
			resend( 400, {message: 'email_does_not_exist'}, res )
		}
	} catch ( e ) {
		resend( 400, {message: 'email_does_not_exist'}, res, e )
	}
})

export default app
