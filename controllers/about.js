var models  = require('../models');
var session = require('../session');

module.exports.controller = function(app) {

	app.get('/about', function(req, res) {
		res.render('about', {
			active: '1',
		});

	});

}