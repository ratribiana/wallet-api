'use strict'
import feathers from '@feathersjs/feathers'
import express from '@feathersjs/express'
import {nonAdminProfileSerializer,profileSerializer} from 'utils/serializer'
import {logger} from 'utils/logger'
import {user, castUserId} from 'model/user'

const app = express( feathers() )
const INVALID_USER = {error: 'invalid_user'}


app.get( '/', async ( req, res ) => {
	try {
		 const userID = castUserId( req.session._id )
		 const result = await user.findOne({_id: userID, isDeleted: false}).exec()
		 const profile = profileSerializer( result )
		 if ( result ) {
			 res.status( 200 ).send( JSON.stringify({user: profile}) )
		 } else {
			 res.status( 400 ).send( INVALID_USER )
		 }
	} catch ( e ) {
		logger( e )
		res.status( 400 ).send({error: req.config.errorUnAuthorized})
	}
})

app.put( '/', async ( req, res ) => {
	const profile = nonAdminProfileSerializer( req.body.user )

	try {
		const userID = castUserId( req.session._id )
		const checkDuplicate = await user.findOne({ username: profile.username}).where({
    '_id': {
        $ne: userID
    }}).count()

		if(checkDuplicate > 0) {
			return res.status( 400 ).send( JSON.stringify({error: 'error_duplicate_user'}) )
		}

		const result = await user.updateRegistration({...profile, _id: userID})
		if ( result ) {
			res.status( 200 ).send({message: 'success'})
		} else {
			res.status( 400 ).send( INVALID_USER )
		}
	} catch ( e ) {
		logger( e )
		res.status( 400 ).send( JSON.stringify({error: 'error_saving_data'}) )
	}
})

export default app
