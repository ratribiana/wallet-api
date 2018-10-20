'use strict'
import endUser from 'routes/endUser'
import tools from 'routes/tools'
import user from 'routes/user'

export default  ( app ) => {
	tools( app )
	user( app )
	endUser( app )
}
