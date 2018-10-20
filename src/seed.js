'use strict'
import 'babel-polyfill'
import 'app-module-path/register'
import config from '../config'
import {dbConnect} from 'utils/dbConnector'
import mongoose from 'mongoose'

import {users} from 'seeds/users.seed.js'
import {siteStatus} from 'seeds/maintenance.seed.js'

( async () => {
	dbConnect( config )

	if ( config.env=='development' || config.env == 'test' ) {
		await users( 2 )
		await siteStatus()
	}
	process.exit()
})()
