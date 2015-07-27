var models  = require('../models');
var session = require('../session');

module.exports.controller = function(app) {

	app.get('/', function(req, res) {
		session.init(req.session, function() {
			console.log('session: ' + JSON.stringify(req.session.principals[0].Categories));
			models.Slider.findAll().then(function(sliders) {
				res.render('index', {
					active: '0',
					sliders: sliders,
				});
			});
		});
	});

}