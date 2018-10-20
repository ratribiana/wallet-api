'use strict'
import feathers from '@feathersjs/feathers'
import express from '@feathersjs/express'
import config from '../../../config'
import {logger} from 'utils/logger'
import {user} from 'model/user'
import {encoder, decoder} from 'utils/jwt'

const app = express( feathers() )

const encode = encoder({
	secret         : config.verifierSecret,
	expireInSeconds: 900 //15min
})

const decode = decoder({
	secret: config.verifierSecret
})

const response = ( status, data, res ) => {
	res.status( status )
	res.send( JSON.stringify( data ) )
}

app.post( '/', async ( req, res ) => {
	try {
		const result = await user.findByEmail( req.body.email )
		if ( result ) {
			const {email, role, _id} = result
			const token = encode({email, role, _id, forgotPassword: true})
			const name = result.personalInfo && result.personalInfo.firstname || result.username
			req.sendEmail( email, [
				{replaceable: '{tokenLink}', replacement: `//${req.frontEndUrl}/forgot-password/${token}`},
				{replaceable: '{userName}', replacement: name},
			], 'Forgot Password Email', name )
			return response( 200, {message: 'nothing to see here'}, res )
		}
		response( 400, {error: 'email_does_not_exist'}, res )
	} catch ( e ) {
		logger( e )
		response( 400, {error: 'error_processing_data'}, res )
	}
})

app.get( '/:token', async ( req, res ) => {
	const {token} = req.params
	try {
		const payload = await decode( token )
		const {forgotPassword} = payload
		response( 200, forgotPassword, res )
	} catch ( e ) {
		logger( e )
		response( 400, {error: e.message}, res )
	}
})

app.post( '/:token', async ( req, res ) => {
	const {token} = req.params
	try {
		const payload = await decode( token )
		const {forgotPassword, _id} = payload
		if ( forgotPassword ) {
			const currentPassword = ( await user.findById( _id ) ).password
			const result = await user.updatePassword( _id, req.body.password, currentPassword )
			if ( result ) {
				return response( 200, result, res )
			} else {
				return response( 400, {error: 'error_same_password'}, res )
			}
		}
		response( 400, {error: 'error_invalid_token'}, res )
	} catch ( e ) {
		logger( e )
		response( 401, {error: req.config.errorUnAuthorized}, res )
	}
})

export default app
