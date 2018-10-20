'use strict'
import feathers from '@feathersjs/feathers'
import express from '@feathersjs/express'
import {logger} from 'utils/logger'
import country from 'countryjs'

const app = express( feathers() )

const response = ( status, data, res ) => {
	res.status( status )
	res.send( JSON.stringify( data ) )
}

app.get( '/:countryCode', async ( req, res ) => {
	try {
		const result = country.states( req.params.countryCode.toUpperCase() )
		response( 200, result, res )
	} catch ( e ) {
		response( 400, {error: 'error_retrieving_data'}, res )
		logger( e )
	}
})

export default app
