'use strict'
import mongoose from 'mongoose'
import {logger} from 'utils/logger'
import config from '../../config'

export const mongooseConnect = `mongodb://${config.dbUser}:${config.dbPassword}@${config.dbHost}:${config.dbPort}/wallet?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true`

export const dbConnect = ( config ) => {
	if ( mongoose.connection.readyState == 0 ) {
		mongoose.connect( mongooseConnect,
			{
				useNewUrlParser: true,
				useCreateIndex: true
			}
		).then( client => {
			console.log( 'Connected to MongoDB Atlas', 'noSQL' )
		})
	}
}

export const dbDrop = () => {
	try {
		mongoose.connection.dropDatabase( ()=> {
			console.log( 'Database has been dropped' )
			process.exit()
		})
	} catch ( e ) {
		logger( e )
	}
}
