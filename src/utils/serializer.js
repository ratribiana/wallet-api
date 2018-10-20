'use strict'
export const registerSerializer = ( register ) => ({
	username           : register.username,
	password           : register.password,
	email              : register.email,
	personalInfo: {
		firstname: register.personalInfo.firstname,
		lastname : register.personalInfo.lastname,
	},
	verified		 : register.verified
})

export const userSearchSerializer = ( user ) => ({
	_id    			 : user._id,
	username   : user.username,
	email      : user.email,
	firstName    : user.personalInfo && user.personalInfo.firstname,
	lastName     : user.personalInfo && user.personalInfo.lastname,
	status       : user.isActive,
	registered   : user.registered,
	verified		 : user.verified
})

export const profileSerializer = ( profile ) => ({
	_id                      : profile._id,
	username                 : profile.username,
	email                    : profile.email,
	registered               : profile.registered,
	verified                 : profile.verified,
	personalInfo: {
		firstname  						 : profile.personalInfo && profile.personalInfo.firstname,
		lastname   						 : profile.personalInfo && profile.personalInfo.lastname
	},
	wallet: {
		cashBalance  					 : profile.cashBalance
	},
	status          				 : profile.isActive
})

export const nonAdminProfileSerializer = ( profile ) => ({
	_id                      : profile._id,
	username                 : profile.username,
	email                    : profile.email,
	registered               : profile.registered,
	verified                 : profile.verified,
	personalInfo: {
		firstname  						 : profile.personalInfo && profile.personalInfo.firstname,
		lastname   						 : profile.personalInfo && profile.personalInfo.lastname
	},
	wallet: {
		cashBalance  					 : profile.cashBalance
	},
	status          				 : profile.isActive
})
