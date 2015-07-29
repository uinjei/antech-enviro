var models  = require('../models');
var session = require('../session');

module.exports.controller = function(app) {

	app.get('/services', function(req, res) {
		res.render('services', {
			active: '1',
		});

	});

}
