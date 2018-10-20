'use strict'
import jwt from 'jsonwebtoken'

export const now = () => new Date().getTime() / 1000

export const encoder = ({secret, expireInSeconds, time = now}) => payload => jwt.sign(
	{
		exp: time() + expireInSeconds,
		...payload
	},
	secret
)

export const decoder = ({secret}) => encoded => jwt.verify( encoded, secret )
