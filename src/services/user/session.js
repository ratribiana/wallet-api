'use strict'
import feathers from '@feathersjs/feathers'
import express from '@feathersjs/express'
import config from '../../../config'
import {user} from 'model/user'
import {logger} from 'utils/logger'
import {encoder, decoder} from 'utils/jwt'
import {siteStatus} from 'utils/maintenance'


const encode = encoder({
	secret         : config.secret,
	expireInSeconds: 259200 // 72hours
})

const decode = decoder({
	secret: config.secret
})

const app = express( feathers() )

const session = ( status, token, res, error='' ) => {
	if ( status == 400 || status == 401 ) {
		logger( error )
	}
	res.status( status ).send( JSON.stringify({token , error}) )
}

app.post( '/', async ( req, res ) => {
	if ( ( await siteStatus() ).isLoginBlocked ) {
		res.status( 500 ).send({LoginBlocked: true})
	}
	const {email, password} = req.body
	let token = {}
	try {
		let result = await user.login( email, password )

		if ( result.user && !result.user.verified ) {
			const userEmail = result.user.email
			return session( 400, {email: userEmail}, res, result.error )
		}
		const {_id, username} = result
		const tokenPayload = {email: result.email, _id, username}

		await user.findOneAndUpdate({_id},{lastLogin: Date.now()})
		token = encode( tokenPayload )
		session( 200, token, res )

	} catch ( e ) {
		session( 401, {token}, res, e.message )
	}
})

app.put( '/', async ( req, res ) => {
	const {accountID} = req.body
	const currentToken = req.header( 'authorization' )

	try {
		decode( currentToken )
		try {
			const result = await user.findOne({_id: accountID})
			const {email, role, _id} = result
			const newToken = {token: encode({email, role, _id})}
			session( 200, newToken, res )
		} catch ( e ) {
			session( 400, {}, res, e )
		}
	} catch ( e ) {
		session( 401, {}, res, e )
	}
})

app.delete( '/', async ( req, res ) => {
	session( 200, {}, res )
})
export default app
