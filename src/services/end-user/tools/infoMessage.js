'use strict'
import feathers from '@feathersjs/feathers'
import express from '@feathersjs/express'
import {infoMessage} from 'model/infoMessage'
import {logger} from 'utils/logger'

const app = express( feathers() )

const response = ( status, data, res ) => {
	res.status( status )
	res.send( JSON.stringify( data ) )
}

app.get( '/', async ( req, res ) => {
	try {
		const result = await infoMessage.find()
		response( 200, result, res )
	} catch ( e ) {
		response( 400, {error: 'error_retrieving_data'}, res )
		logger( e )
	}
})

app.get( '/:id', async ( req, res ) => {
	try {
		const result = await infoMessage.findById({_id: req.params.id})
		response( 200, result, res )
	} catch ( e ) {
		response( 400, {error: 'error_retrieving_data'}, res )
		logger( e )
	}
})

export default app
