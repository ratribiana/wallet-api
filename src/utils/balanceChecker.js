'use strict'
import {user} from 'model/user'
import {logger} from 'utils/logger'

export const walletBalance =	async ( walletType, username ) => {
	if ( !!walletType && ( walletType=='cash' || walletType=='trading' || walletType=='shopping' || walletType=='charity' ) ) {
		walletType = `account.${walletType}Balance`
	} else if ( !!walletType && walletType == 'ducatuscoin' ) {
		walletType = 'rankInfo.ducatusCoins'
	}
	try {
		const userWallet = await user.findOne({username},{[ walletType ]: 1})
		const balance = walletType.split( '.' ).reduce( ( p,c )=>p&&p[ c ]||0, userWallet )
		return balance
	} catch ( e ) {
		logger( e )
		throw new Error( 'error_in_wallet_balance' )
	}
}
