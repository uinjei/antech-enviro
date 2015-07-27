var models  = require('../models');
var session = require('../session');
var mailer = require('../mailer');

module.exports.controller = function(app) {

	app.get('/contact', function(req, res) {
		res.render('contact', {
			active: '3',
		});

	});
	
	app.get('/contact/sendmessage', function(req, res) {
		
		console.log('req.query: ' + JSON.stringify(req.query));
		
		var args = {
				/*name of the requester*/
				name: req.query.name,
	            company: req.query.company,
	            phone: req.query.phone,
				/*email of requester*/
				email: req.query.email,
				subject: req.query.subject,
				message: req.query.message
		};
		
		mailer.sendMessage(args, function(isOk) {
			console.log('sent: ' + isOk);

			req.session.pq = null;

			res.send({message: 'Your message was sent.'});
		});

	});
	
}