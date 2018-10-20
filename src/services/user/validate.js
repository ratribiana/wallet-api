'use strict'
import feathers from '@feathersjs/feathers'
import express from '@feathersjs/express'
import _ from 'lodash'
import {logger} from 'utils/logger'
import {userSearchSerializer} from 'utils/serializer'
import {user} from 'model/user'
import {getChildren} from 'utils/dbConnector'

const app = express( feathers() )

app.get( '/:username/:placement?', async ( req, res ) => {
	try {
		const {username, placement} = req.params
		const result = await user.findOne({username}).lean()
		let isValid = result ? true : false
		if ( result && placement && username != placement  ) {
			const sponsorPartners = await getChildren( result._id, -1 )
			const parent = await user.findOne({username: placement})
			const found = parent ? sponsorPartners.indexOf( parent._id.toString() ) : 0
			isValid = found > 0 ? true : false
		}
		res.status( 200 ).send( JSON.stringify({isValid}) )
	} catch ( e ) {
		logger( e )
		res.status( 400 ).send( JSON.stringify({error: e.message}) )
	}
})

export default app
