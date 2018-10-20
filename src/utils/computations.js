'use strict'
import config from '../../config'
import {logger} from 'utils/logger'

export const convertCreditToCoin = ( member ) => {
	const miningCredit = member.rankInfo.miningCredits
	const convertedCoin = miningCredit / config.conversionRate

	return convertedCoin
}

export const adjustMiningCredit = ( user, action, amount ) => {
	try {
		if ( action == 'add' )  {
			return user.rankInfo.miningCredits + amount
		} else if ( action == 'deduct' )  {
			return user.rankInfo.miningCredits - amount
		}
	} catch ( e ) {
		logger( e )
	}
}

export const accountBalanceSummation = ( balance, action, amount ) =>{
	try {
		if ( action == 'credit' )	{
			return balance + amount
		} else if ( action == 'deduct' )	{
			return balance - amount
		}
	} catch ( e ) {
		logger( e )
	}
}

export const insufficientFund = ( balance, deduction, action ) => {
	try {
		if ( action=='deduct' ){
			if ( balance < deduction ){
				return true
			}
		}
		return false
	} catch ( e ) {
		logger( e )
	}
}

export const convertEuroToBV = ( amount ) => amount * config.euroToBV

export const convertBVToEuro = ( bv ) => bv / config.euroToBV
