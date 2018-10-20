'use strict'
import feathers from '@feathersjs/feathers'
import express from '@feathersjs/express'
import {globalSponsor} from 'model/globalSponsor'
import sanitize from 'mongo-sanitize'
import {logger} from 'utils/logger'
const app = express( feathers() )
app.get( '/', async ( req, res ) => {
	res.status( 200 ).send()
})
export default app
