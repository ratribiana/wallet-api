'use strict'
import {maintenance} from 'model/maintenance'

export const siteStatus = async () => {
	try {
		const SITE_STATUS = {
			isMaintenance        : false,
			isLoginBlocked       : false,
			isRegistrationBlocked: false,
		}
		const result = await maintenance.create( SITE_STATUS )
		console.log( 'seeding-maintenance-done' )
	} catch ( e ) {
		console.log( 'seeding-error',e )
	}
}
