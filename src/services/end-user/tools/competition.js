'use strict'
import feathers from '@feathersjs/feathers'
import express from '@feathersjs/express'
import {competition} from 'model/competition'
import {logger} from 'utils/logger'

const app = express( feathers() )

const response = ( status, data, res ) => {
	res.status( status )
	res.send( JSON.stringify( data ) )
}

app.get( '/', async ( req, res ) => {
	try {
		const result = await competition.find()
		response( 200, result, res )
	} catch ( e ) {
		response( 400, {error: 'error_retrieving_data'}, res )
		logger( e )
	}
})

app.get( '/:competitionID', async ( req, res ) => {
	try {
		const result = await competition.findById({_id: req.params.competitionID})
		response( 200, result, res )
	} catch ( e ) {
		response( 400, {error: 'error_retrieving_data'}, res )
		logger( e )
	}
})

export default app
