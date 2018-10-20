'use strict'
import feathers from '@feathersjs/feathers'
import express from '@feathersjs/express'
import {logger} from 'utils/logger'
import {activateDeactivateSerializer} from 'utils/serializer'
import {user} from 'model/user'

const app = express( feathers() )

app.post( '/', async ( req, res ) => {
	const {_id, isActive, note} = req.body
	try {
		await user.findOneAndUpdate(
			{
				_id
			},
			{isActive, note},
			{new: true}
		).exec()
		res.sendStatus( 200 )
	} catch ( e ) {
		logger( e )
		res.status( 400 ).send()
	}
})

export default app
