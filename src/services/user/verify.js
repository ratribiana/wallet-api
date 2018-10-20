'use strict'
import feathers from '@feathersjs/feathers'
import express from '@feathersjs/express'
import config from '../../../config'
import {profileSerializer} from 'utils/serializer'
import {logger} from 'utils/logger'
import {decoder} from 'utils/jwt'
import {user} from 'model/user'

const decode = decoder({
	secret: config.verifierSecret
})

const app = express( feathers() )

app.get( '/:token', async ( req, res ) => {
	const {token} = req.params
	try {
		const payload = await decode( token )
		try {
			const result = await user.findById( payload._id )
			if ( result ){
				const {_id, verified} = result
				if ( !verified ) {
					let updatedUser = await user.findOneAndUpdate(
		  			{
		  				_id: payload._id
		  			},
		  			{verified: Date.now()},
		  			{new: true}
		  		)
					if ( updatedUser.sponsorName && updatedUser.sponsorName.id ) {
						const getSponsor = await user.findOne({_id: updatedUser.sponsorName.id})
					}
					updatedUser = profileSerializer( updatedUser )
					res.status( 200 ).send( JSON.stringify( updatedUser ) )
				} else {
					res.status( 400 ).send({error: 'user_already_verified'})
				}
			} else {
				res.status( 400 ).send({error: 'user_does_not_exist'})
			}
		} catch ( e ) {
			logger( e )
			res.status( 400 ).send({error: e.message})
		}
	} catch ( e ) {
		logger( e )
		res.status( 400 ).send({error: e.message})
	}
})

export default app
