import config from '../../config'
import fs from 'fs'
import winston from 'winston'
import 'winston-daily-rotate-file'

const logDir = 'srcLogs'

if ( !fs.existsSync( logDir ) ) {
	fs.mkdirSync( logDir )
}

const tsFormat = () => ( new Date() ).toLocaleTimeString()
export const logger = ( message ) => {
	new winston.Logger({
		transports: [
			new winston.transports.Console({
				timestamp: tsFormat,
				colorize : true
			}),
			new winston.transports.DailyRotateFile({
				filename   : `${logDir}/error.log`,
				timestamp  : tsFormat,
				datePattern: 'YYYY-MM-DD'
			})
		]
	}).error( message )
}
