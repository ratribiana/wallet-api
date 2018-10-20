// Application hooks that run for every service)
import logger from './hooks/logger'
module.exports = {
	before: {
		all   : [logger()],
		find  : [],
		get   : [],
		create: [],
		update: [],
		patch : [],
		remove: []
	},

	after: {
		all   : [logger()],
		find  : [],
		get   : [],
		create: [],
		update: [],
		patch : [],
		remove: []
	},

	error: {
		all   : [logger()],
		find  : [],
		get   : [],
		create: [],
		update: [],
		patch : [],
		remove: []
	}
}
