'use strict'
import crypto from 'crypto'

const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
const PINCODE_REGEX = /^\d{5}$/

export const isValidPassword = function ( password ) {
	return PASSWORD_REGEX.test( password )
}

export const isValidPinCode = function ( pincode ) {
	return PINCODE_REGEX.test( pincode )
}

export const hash = function ( str, salt ) {
	let hash = crypto.createHash( 'sha256' ).update( str )
	if ( salt ) {
		hash = hash.update( salt )
	}
	return hash.digest( 'hex' )
}

export const generatePassword = function ( email, salt ) {
	return `${hash( email, salt ).substring( 10, 18 )}1a`
}
