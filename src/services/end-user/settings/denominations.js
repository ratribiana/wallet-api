'use strict'
import feathers from '@feathersjs/feathers'
import express from '@feathersjs/express'
import {denominations} from 'model/denominations'
import {priceOfCoin} from 'model/priceOfCoin'
import {castUserId} from 'model/user'
import logger from 'utils/logger'

const app = express ( feathers() )

const response = ( status, data, res ) => {
	res.status( status ).send( JSON.stringify( data ) )
}

app.get( '/', async ( req, res ) => {
	try {
		const result = await denominations.find({active: true, isDeleted: false})
		if ( !result ) {
			response( 204, {error: 'data_not_found'}, res )
		}
		const coinPrice = await priceOfCoin.findOne({}).sort({dateUpdated: -1})
		response( 200, {result, coinPrice: coinPrice.priceOfCoin}, res )
	} catch ( e ) {
		logger( e )
		response( 400, {error: 'error_retrieving_data'}, res )
	}
})

app.get( '/:id', async ( req, res ) => {
	try {
		const result = await denominations.findById({_id: castUserId( req.params.id ),active: true,isDeleted: false})
		if ( !result ) {
			response( 204, {error: 'data_not_found'}, res )
		}
		const coinPrice = await priceOfCoin.findOne({}).sort({dateUpdated: -1})
		response( 200, {result, coinPrice: coinPrice.priceOfCoin}, res )
	} catch ( e ) {
		response( 400, {error: 'error_retrieving_data'}, res )
		logger( e )
	}
})

export default app
