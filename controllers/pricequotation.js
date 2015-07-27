var _ = require('underscore');
var mailer = require('../mailer');

module.exports.controller = function(app) {
	
	app.get('/pricequotation', function(req, res) {
		if (!req.session.pq) {
			req.session.pq = [];
			console.log('pql: ' + req.session.pq.length);
		}
			
		res.render('pricequotation', {
			qList: req.session.pq
		});

	});
	
	app.get('/pricequotation/add', function(req, res) {

		var prodQty = req.query.prodQty;

		/*quotation list*/
		if(req.session.pq) {

			var keys = _.pluck(req.session.pq, 'id');

			/*check if product is already added*/
			if (!_.contains(keys, req.query.prodId)) {
				var prod = {
						id: req.query.prodId,
						name: req.query.prodName,
						qty: prodQty?prodQty:1
				};
				req.session.pq.push(prod);
			}

			/*if quotation list doesnt have items*/	
		} else {
			var prod = {
					id: req.query.prodId,	
					name: req.query.prodName,
					qty: prodQty?prodQty:1
			};
			req.session.pq = [prod];
		}

		res.render('pricequotation', {
			qList: req.session.pq
		});

	});

	app.get('/pricequotation/sendpq', function(req, res) {

		var args = {
				/*name of the requester*/
				name: req.query.rName,
	            company: req.query.rCompany,
	            address: req.query.rAddress,
	            contact: req.query.rContact,
				/*email of requester*/
				email: req.query.rEmail,
				qList: req.session.pq
		};

		mailer.sendRequest(args, function(isOk) {
			console.log('sent: ' + isOk);

			req.session.pq = null;

			res.send({message: 'Your price quotation request has been sent.'});
		});
	});

	app.post('/pricequotation/deleteitem', function(req, res) {
		console.log('deletion: ' + JSON.stringify(req.body));
		
		req.session.pq = _.without(req.session.pq, _.findWhere(req.session.pq, {id: req.body.idx}));
		
		console.log('pq: '+ JSON.stringify(req.session.pq));
		
		//req.session.pq.splice(req.body.idx, 1);
		
		res.send({status: 'ok', idx: req.body.idx});
	});
	
}