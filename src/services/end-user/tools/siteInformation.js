'use strict'
import feathers from '@feathersjs/feathers'
import express from '@feathersjs/express'
import {siteInformation} from 'model/siteInformation'
import {logger} from 'utils/logger'

const app = express( feathers() )

const response = ( status, data, res ) => {
	res.status( status ).send( JSON.stringify( data ) )
}

app.get( '/', async ( req, res ) => {
	try {
		const result = await siteInformation.findOne().exec()
		response( 200, result, res )
	} catch ( e ) {
		response( 400, {error: 'error_retrieving_data'}, res )
		logger( e )
	}
})

export default app
