'use strict'
import feathers from '@feathersjs/feathers'
import express from '@feathersjs/express'
import {competition} from 'model/competition'
import {news} from 'model/news'
import {tutorialsWebinars} from 'model/tutorialsWebinars'
import {whitePaper} from 'model/whitepaper'
import {logger} from 'utils/logger'

const app = express( feathers() )
const SORT_DECENDING = -1


const response = ( status, data, res ) => {
	res.status( status )
	res.send( JSON.stringify( data ) )
}

app.get( '/:limit', async ( req, res ) => {
	try {
		let press = {}
		const limit = isNaN( req.params.limit )?0:req.params.limit
		press.news = await news.find({category: 'info'}).limit( +limit ).sort({'date': SORT_DECENDING})
		press.popupNews = await news.find({category: 'popup'}).limit( +limit ).sort({'date': SORT_DECENDING})
		press.latestNews = await news.find({category: 'marquee'}).limit( +limit ).sort({'date': SORT_DECENDING})
		press.competitions = await competition.find().limit( +limit ).sort({'dateCreated': SORT_DECENDING})
		press.whitepapers = await whitePaper.find().limit( +limit ).sort({'date': SORT_DECENDING})
		press.tutorialsWebinars = await tutorialsWebinars.find().limit( +limit ).sort({'created': SORT_DECENDING})
		response( 200, press, res )
	} catch ( e ) {
		response( 400, {error: 'error_retrieving_data'}, res )
		logger( e )
	}
})

export default app
