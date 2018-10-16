const filog = require('filter-log')
let log = filog('tracker-flash-message')


const createMiddleware = function(options) {
	options = options || {}

	const middleware = function(req, res, next) {
		let messages
		if(req.tracker && req.tracker.flashMessages) {
			messages = req.tracker.flashMessages
		}
			
		req.getFlashMessages = function(callback) {
			if(req.tracker && req.tracker.flashMessages) {
				delete req.tracker.flashMessages
				res.track(req.tracker, () => {
					callback(messages)
				})
			}
			else {
				callback(messages)
			}
		}
		
		res.addFlashMessage = function(message, callback) {
			let tracker = req.tracker || {}
			if(!tracker.flashMessages) {
				tracker.flashMessages = []
			}
			tracker.flashMessages.push(message)
			res.track(tracker, callback)
		}
		
		next()
	}
	
	return middleware
}

module.exports = createMiddleware