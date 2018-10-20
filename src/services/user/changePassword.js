'use strict'
import feathers from '@feathersjs/feathers'
import express from '@feathersjs/express'
import config from '../../../config'
import {logger} from 'utils/logger'
import {decoder} from 'utils/jwt'
import {user} from 'model/user'

const decode = decoder({
	secret: config.verifierSecret
})

const app = express( feathers() )

app.post( '/', async ( req, res ) => {
	try {
		const result = await user.changePassword( req.session._id, req.body.oldPassword, req.body.newPassword )
		if ( result && result.error ) {
			return res.status( 400 ).send({error: result.error})
		}
		if ( !result ) {
			return res.status( 400 ).send({error: 'invalid_credentials'})
		}
		await req.activity.create({
			userID: result._id,
			type  : 'change-password',
			data  : JSON.stringify({
				success: true
			})
		})
		res.sendStatus( 200 )
	} catch ( e ) {
		logger( e )
		res.status( 400 ).send({error: e.errmsg})
	}
})

export default app
