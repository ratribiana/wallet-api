'use strict'
import feathers from '@feathersjs/feathers'
import express from '@feathersjs/express'
import config from '../../../config'
import {profileSerializer} from 'utils/serializer'
import {user} from 'model/user'
import {logger} from 'utils/logger'
import {encoder} from 'utils/jwt'

const app = express( feathers() )

const encode = encoder({
	secret         : config.verifierSecret,
	expireInSeconds: 900 //15min
})

const HEADER = {
	filename: 'Users_To_Validate.xlsx',
	columns : [
		{header: 'USERNAME', key: 'username', width: 30},
		{header: 'SPONSOR', key: 'sponsorName.name', width: 30},
		{header: 'REFERRAL KEY', key: 'referralKey', width: 20},
		{header: 'DATE REGISTERED', key: 'registered', width: 20},
		{header: 'EMAIL', key: 'email', width: 30}
	]
}

const response = ( status, data, res ) => {
	res.status( status )
	res.send( JSON.stringify( data ) )
}

app.get( '/:offset/:limit', async ( req, res ) => {
	const {offset, limit} = req.params
	try {
		const result = await user.find({isConfirmed: false,  isRejected: false}).skip( parseInt( offset ) ).limit( parseInt( limit ) )
		response( 200, result, res )
	} catch ( e ) {
		response( 400, {error: 'error_retrieving_data'}, res )
		logger( e )
	}
})

app.put( '/:id', async ( req, res ) => {
	const {confirm, reject} = req.body
	const options = {new: true}
	try {
		const userStatus = await user.findOneAndUpdate({_id: req.params.id}, {$set: {isConfirmed: confirm,isRejected: reject}}, options )
		response( 200, userStatus, res )
	} catch ( e ) {
		response( 400, {error: 'error_updating_data'}, res )
		logger( e )
	}
})

app.post( '/resend-email/:id', async ( req, res ) => {
	try {
		const currentUser = await user.findById( req.params.id )
		const {_id, verified} = currentUser
		if ( !verified ) {
			const newToken = {token: encode({id: _id})}
			req.sendEmail( email, [
				{replaceable: '{tokenLink}', replacement: `//${req.frontEndUrl}/verify/${newToken}`},
				{replaceable: '{userName}', replacement: newUser.username  || 'User'},
			], 'Validation Email', newUser.username )
			response( 200, newToken, res )
		} else {
			response( 400, {message: 'email_already_verified'}, res )
		}
	} catch ( e ) {
		resend( 400, {message: 'email_does_not_exist'}, res, e )
	}
})

app.put( '/edit-email/:id', async ( req, res ) => {
	const options = {new: true}
	try {
		const updateEmail = await user.findOneAndUpdate({_id: req.params.id}, {$set: {email: req.body.email, verified: null}}, options )
		response( 200, updateEmail, res )
	} catch ( e ) {
		response( 400, {error: 'error_updating_data'}, res )
		logger( e )
	}
})


export default app
