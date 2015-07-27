var models  = require('../models');
var session = require('../session');

module.exports.controller = function(app) {

	app.get('/viewproduct', function(req, res) {
		
		console.log('query: ' + JSON.stringify(req.query));
		
		models.Product.find({
			where: {id: req.query.prodId},
			include: [models.Category]
		}).then(function(product) {
			res.render('productdetails', {
				selPrincipalId: req.query.selPrincipalId,
				catId:req.query.catId,
				product: product
			});
		});

	});

}