'use strict'
import {user} from 'model/user'
import faker from 'faker'

export const users = async ( length ) => {
	try {
		let personalInfo = {
			firstname: faker.name.firstName(),
			lastname: faker.name.lastName()
		}
		let wallet = {
			cashBalance: 1000
		}
		for ( let i = 0; i < length; i++ ) {
			const FAKE_USER =
          {
          	username       : faker.internet.userName(),
          	password       : 'P@ssw0rd01',
          	email          : faker.internet.email(),
						personalInfo	 : personalInfo,
						wallet				 : wallet,
          	verified			 : Date.now()
          }
			const newUser = await user.register({...FAKE_USER})
		}
		console.log( 'seeding-users-done' )
	} catch ( e ) {
		console.log( 'seeding-error',e )
	}
}
