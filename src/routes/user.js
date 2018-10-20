'use strict'
import {authorizer} from 'utils/authorizer'
import balanceChecker from 'services/user/checkBalance'
import changePassword from 'services/user/changePassword'
import changeUsername from 'services/user/changeUsername'
import forgotPassword from 'services/user/forgotPassword'
import fundTransfer from 'services/fund-management/fundTransfer'
import profile from 'services/user/profile'
import register from 'services/user/register'
import session from 'services/user/session'
import validate from 'services/user/validate'
import validateEmail from 'services/user/validateEmail'
import verify from 'services/user/verify'
import userValidation from 'services/user/userValidation'

export default  ( app ) => {
	app.use( '/change-password', authorizer(), changePassword )
	app.use( '/check-balance', authorizer(), balanceChecker )
	app.use( '/forgot-password', forgotPassword )
	app.use( '/fund-transfer', authorizer( ['accountFunding', 'fundTransfer'] ), fundTransfer )
	app.use( '/profile', authorizer( ['memberManagement','profile'] ), profile )
	app.use( '/change-username', authorizer(), changeUsername )
	app.use( '/register', register )
	app.use( '/session', session )
	app.use( '/user-validation', authorizer( ['memberManagement','validation'] ), userValidation )
	app.use( '/validate', validate )
	app.use( '/validate-email', validateEmail )
	app.use( '/verify', verify )
}
