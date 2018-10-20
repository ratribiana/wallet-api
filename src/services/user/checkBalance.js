'use strict'
import feathers from '@feathersjs/feathers'
import express from '@feathersjs/express'
import {logger} from 'utils/logger'
import {walletBalance} from 'utils/balanceChecker'

const app = express( feathers() )

app.get( '/:walletType/:username', async ( req, res ) => {
	const {walletType,username} = req.params
	try {
		const balance = await walletBalance( walletType, username )
		res.status( 200 ).send({balance})
	} catch ( e ) {
		logger( e )
		res.status( 400 ).send()
	}
})

export default app
