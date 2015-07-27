var models  = require('../models');
var session = require('../session');
var _ = require('underscore');

module.exports.controller = function(app) {

	app.get('/products', function(req, res) {

		//find category
		models.Category.findAll({
			where: {principal_id:req.query.selPrincipalId}
		}).then(function(categories) {
			models.Product.count().then(function(count) {
				//find product
				models.Product.findAll({
					where: {category_id: _.pluck(categories, 'id')},
					limit: 9
				}).then(function(products) {
					res.render('products', {
						//active: '2',
						categories: categories,
						selCatId:categories[0]==!undefined?categories[0].id:undefined ,
						pages: Math.ceil(count/9),
						selPage: 0,
						selPrincipalId: req.query.selPrincipalId,
						products: products
					});
				});
			})
		});
	});


	app.get('/products/update', function(req, res) {

		//find category
		models.Category.findAll({
			where: {principal_id:req.query.selPrincipalId}
		}).then(function(categories) {
			models.Product.count({
				where: {category_id: req.query.catId}
			}).then(function(count) {
				//find model
				models.Product.findAll({
					where: {category_id: req.query.catId},
					limit: 9,
					offset: req.query.selPage*9
				}).then(function(products) {
					res.render('products', {
						active: req.session.actTab,
						categories: categories,
						selCatId: req.query.catId,
						pages: Math.ceil(count/9),
						selPage: req.query.selPage,
						selPrincipalId: req.query.selPrincipalId,
						products: products
					});
				});
			})
		});

	});
}