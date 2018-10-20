'use strict'
export const setAuthorization = ( token ) => {
	if ( token ) {
		axios.defaults.headers.common[ 'Authorization' ] = `${token}`
	} else {
		delete axios.defaults.headers.common[ 'Authorization' ]
	}
}
