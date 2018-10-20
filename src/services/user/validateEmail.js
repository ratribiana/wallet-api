'use strict'
import feathers from '@feathersjs/feathers'
import express from '@feathersjs/express'

import {logger} from 'utils/logger'
import {user} from 'model/user'

const app = express( feathers() )

app.get( '/:email', async ( req, res ) => {
	const {email} = req.params
	try {
		const result = await user.find({'email': email}).count()
		const isValid = result ? true : false
		res.status( 200 ).send( JSON.stringify({isValid}) )
	} catch ( e ) {
		res.status( 400 ).send( JSON.stringify({error: e.message}) )
		logger( e )
	}
})

export default app
