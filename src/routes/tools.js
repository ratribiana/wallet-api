'use strict'
import {authorizer} from 'utils/authorizer'
import maintenance from 'services/maintenance'

export default  ( app ) => {
	app.use( '/maintenance', authorizer( ['tools','siteMentainanceMode'] ), maintenance )
}
