var models  = require('../models');
var path = require('path');
var fs = require('fs');

var deleteAfterUpload = function(path) {
	setTimeout( function(){
		fs.unlink(path, function(err) {
			if (err) console.log(err);
			console.log('file successfully deleted');
		});
	}, 60 * 1000);
};

/*
- Admin Controller
- This controller handle all the backend side
 */
module.exports.controller = function(app) {

	/*logout*/
	app.get('/admin/logout', function(req, res) {
		/*destroy session*/
		req.session.user = null;
		res.render('../views/admin/login');
	});

	/*BEGIN login module*/
	app.get('/admin', function(req, res) {
		res.render('../views/admin/login');
	});
	/*login module*/
	app.post('/admin/login', function(req, res) {
		console.log('body:' + JSON.stringify(req.body));

		models.User.find({
			where: {username:req.body.username}
		}).then(function(user) {
			console.log('user:' + JSON.stringify(user));
			if (user) {
				if(user.password==req.body.password) {
					/*create session for the logged in user*/
					req.session.user = user;

					res.redirect('/admin/general_settings');
				} else {
					/*invalid password*/
					res.render('../views/admin/login', {
						msg: 'invalid password'
					})
				}
			} else {
				/*no user found*/
				res.render('../views/admin/login', {
					msg: 'no user found'
				})
			}

		});
	});
	/*END login module*/


	/*
	|- General Setting Module
	|- Parameter title,tagline,url,logo,email,contact,createdAt,updatedAt 
	 */
	app.get('/admin/general_settings', function(req, res) {
		models.Settings.find({
			where: {
				id: 1
			}
		}).then(function(settings) {
			res.render('../views/admin/general_settings_view', {
				settings: settings
			});
		});
	});


	/*Save the form to the database*/
	app.post('/admin/general_settings/save', function(req, res) {
		fs.createReadStream('../tmp/'+path.basename(req.files.userfile.path)).pipe(fs.createWriteStream('../data/antech-logo.png'));

		deleteAfterUpload('../tmp/'+path.basename(req.files.userfile.path));

		console.log('req.body: '+JSON.stringify(req.body));

		//var site_title = req.body.site_title;
		//models.settings.save();
		models.Settings.find({
			where: {
				id: 1
			}
		}).then(function(settings) {

			if (settings) {
				settings.updateAttributes({
					/*title: DataTypes.STRING(255),
						    tagline: DataTypes.STRING(255),
						    url: DataTypes.STRING(255),
						    logo: DataTypes.STRING(255),
						    email: DataTypes.STRING(255),
						    contact: DataTypes.STRING(45)*/
					title: req.body.site_title,
					tagline: req.body.site_tagline,
					url: req.body.site_url,
					logo:req.files.userfile.name,
					email: req.body.site_email,
					contact: req.body.site_contact
				}).then(function() {
					res.redirect('/admin/general_settings');
				});
			}
		});

	});

	/*End General Settings*/


	/*****************************************************************
	| - Keyword Manager
	| - Basic SEO Purpose
	| - Parameter keyword,createdAt,updatedAt
	 *****************************************************************/

	/*Keyword View*/
	app.get('/admin/keyword_manager', function(req, res) {

		res.render('../views/admin/keyword_manager_view', {
			active: '1'
		});
	});

	/*Keyword Save*/




	/*End Keyword manager*/



	/*****************************************************************
	| - Principals Manager
	| - 
	| - Parameter ID,name,logo,url,createdAt,updatedAt
	 *****************************************************************/
	/*Principal View*/
	app.get('/admin/principals', function(req, res) {
		/*
				 | - Check if some id is set
				 | - Load the edit view
		 */
		if(req.query.id)
		{

			models.Principal.find({
				where: {
					id: req.query.id
				}
			}).then(function(principal){
				/*check if the result is 0*/
				if(principal.length != 0 )
				{
					res.render('../views/admin/principals_edit_view', {
						active: '1',
						principal : principal,
						length : principal.length
					});	
				}
				else
				{
					res.status(404);
				}
			})
		}	
		else
		{
			models.Principal.findAll().then(function(principals){
				res.render('../views/admin/principals_view', {
					principals : principals
				});
			});
		}

	});


	/*
	| - Principal Save to database
	| - table: principals
	 */

	app.post('/admin/principals/save',function(req,res){
		//for uploading file
		fs.createReadStream('../tmp/'+path.basename(req.files.userfile.path)).pipe(fs.createWriteStream('../data/' + req.files.userfile.name));
		deleteAfterUpload('../tmp/'+path.basename(req.files.userfile.path));

		models.Principal.create({
			name: req.body.name,
			logo:req.files.userfile.name,
			url: req.body.url
		}).then(function(create) {

			/*Check if create is successfull*/
			if(create){
				res.redirect('/admin/principals');
			}

		});

	});
	/*End Save Principal*/



	/*
	| - Principal Edit
	 */
	app.get('/admin/principals/edit',function(req,res){
		/*
				 | - Check if some id is set
				 | - Load the edit view
		 */
		if(req.query.id)
		{

			models.Principal.find({
				where: {
					id: req.query.id
				}
			}).then(function(principal){
				/*check if the result is 0*/
				if(principal.length != 0 )
				{
					res.render('../views/admin/principals_edit_view', {
						principal : principal,
						length : principal.length
					});	
				}
				else
				{
					res.status(404);
				}
			})
		}	
	});

	/*End Principal Edit*/


	/*
	| - Principal Update
	| - table: principals
	 */

	app.post('/admin/principals/update',function(req,res){
		models.Principal.find({
			where: {
				id: req.body.id
			}
		}).then(function(update) {
			if (update) {
				/* check if the user change the logo*/
				if(req.files.userfile.name != "")
				{
					fs.createReadStream('../tmp/'+path.basename(req.files.userfile.path)).pipe(fs.createWriteStream('../data/' + req.files.userfile.name));
					deleteAfterUpload('../tmp/'+path.basename(req.files.userfile.path));

					update.updateAttributes({
						name: req.body.name,
						logo:req.files.userfile.name,
						url: req.body.url
					}).then(function() {
						res.redirect('/admin/principals');
					});
				}
				else
				{
					update.updateAttributes({
						name: req.body.name,
						url: req.body.url
					}).then(function() {
						res.redirect('/admin/principals');
					});
				}
			}

		});

	});
	/*End update Principal*/

	/*End Principal




	/*****************************************************************
	| - Image Slider Manager
	| - Slider for landing page
	| - Parameter ID,name,logo,url,createdAt,updatedAt
	 *****************************************************************/



	/*View Image Slider*/
	app.get('/admin/image_slider', function(req, res) {
		
		models.Slider.findAll().then(function(sliders){
				res.render('../views/admin/image_slider_view', {
					active: '1',
					sliders : sliders
			});
		});
	});
	
	/*
	| - Image Slider Save to database
	| - table: slider
	*/

	app.post('/admin/image_slider/save',function(req,res){
		
		//for uploading file
		fs.createReadStream('../tmp/'+path.basename(req.files.userfile.path)).pipe(fs.createWriteStream('../data/' + req.files.userfile.name));
		deleteAfterUpload('../tmp/'+path.basename(req.files.userfile.path));

		models.Slider.create({
			title : req.body.title,
			image  :req.files.userfile.name,
			description: req.body.description,
			link: req.body.link
		}).then(function(create) {
			
			/*Check if create is successfull*/
			if(create){
				res.redirect('/admin/image_slider');
			}

		});
	});
	/*End Save Slider*/
	
	/*
	| - Image Slider Edit
	*/
	app.get('/admin/image_slider/edit',function(req,res){
		/*
		 | - Check if some id is set
		 | - Load the edit view
		 */
		if(req.query.id)
		{
			models.Slider.find({
						where: {
							id: req.query.id
						}
			}).then(function(slider){
				/*check if the result is 0*/
				if(slider.length != 0 )
				{
					res.render('../views/admin/image_slider_edit_view', {
						active: '1',
						slider : slider,
						length : slider.length
					});	
				}
				else
				{
					res.status(404);
				}
			})
		}	
	});
	/*End Principal Edit*/
	/*
	| - Slider Update
	| - table: slider
	*/
	app.post('/admin/image_slider/update',function(req,res){
		
		models.Slider.find({
			where: {
				id: req.body.id
			}
		}).then(function(update) {
			if (update) {
				/* check if the user change the logo*/
				if(req.files.userfile.name != "")
				{
					fs.createReadStream('../tmp/'+path.basename(req.files.userfile.path)).pipe(fs.createWriteStream('../data/' + req.files.userfile.name));
					deleteAfterUpload('../tmp/'+path.basename(req.files.userfile.path));
					update.updateAttributes({
						title: req.body.title,
						image:req.files.userfile.name,
						description: req.body.description,
						link: req.body.link
					}).then(function() {
						res.redirect('/admin/image_slider');
					});
				}
				else
				{
					update.updateAttributes({
						title: req.body.title,
						description: req.body.description,
						link: req.body.link
					}).then(function() {
						res.redirect('/admin/image_slider');
					});
				}
			}
			
		});
	});
	/*End update slider*/
	/*Delete Slider Image*/
	app.post('/admin/image_slider/delete',function(req,res) {
		models.Slider.destroy({ 
		    where: {
		      id: req.body.id
		    },
		    truncate: false /* this will ignore where and truncate the table instead */
		}).then(function(del){
			res.send(req.body.id);
		});
	});
	/*End Delete Product*/
	
	/*End Slider Manager*/







	/*****************************************************************
	| - Product Category
	| - 
	| - Parameter ID,name,logo,url,createdAt,updatedAt
	 *****************************************************************/



	app.get('/admin/product_category', function(req, res) {
		models.Category.findAll({
			include:[models.Principal]
		}).then(function(p_category) {
			models.Principal.findAll().then(function(principals) {
				res.render('../views/admin/product_category_view', {
					principals: principals,
					p_category: p_category
				});
			})
		});
	});


	/*
	| - Save the  product category to the database
	| - table category
	 */
	app.post('/admin/product_category/save',function(req,res){
		fs.createReadStream('../tmp/'+path.basename(req.files.userfile.path)).pipe(fs.createWriteStream('../data/' + req.files.userfile.name));
		deleteAfterUpload('../tmp/'+path.basename(req.files.userfile.path));

		models.Category.create({
			name: req.body.name,
			description: req.body.description,
			principal_id : req.body.principal_id,
			image: req.files.userfile.name
		}).then(function(create) {

			/*Check if create is successfull*/
			if(create){
				res.redirect('/admin/product_category');
			}

		});
	});



	/*Edit the product Category*/
	app.get('/admin/product_category/edit', function(req, res) {
		if(req.query.id)
		{

			models.Category.find({
				where: {
					id: req.query.id
				}
			}).then(function(category){
				models.Category.findAll().then(function(p_category) {
					models.Principal.findAll().then(function(principals) {
						res.render('../views/admin/product_category_edit_view', {
							principals: principals,
							p_category: p_category,
							category : category
						});
					})
				});
			});

		}
	});
	/*End Edit Product Edit*/


	app.post('/admin/product_category/update',function(req,res){
		models.Category.find({
			where: {
				id: req.body.id
			}
		}).then(function(update) {
			if (update) {
				/* check if the user change the logo*/
				if(req.files.userfile.name != "")
				{
					fs.createReadStream('../tmp/'+path.basename(req.files.userfile.path)).pipe(fs.createWriteStream('../data/' + req.files.userfile.name));
					deleteAfterUpload('../tmp/'+path.basename(req.files.userfile.path));

					update.updateAttributes({
						name: req.body.name,
						description: req.body.description,
						principal_id : req.body.principal_id,
						image: req.files.userfile.name
					}).then(function() {
						res.redirect('/admin/product_category');
					});
				}
				else
				{
					update.updateAttributes({
						name: req.body.name,
						description: req.body.description,
						principal_id : req.body.principal_id
					}).then(function() {
						res.redirect('/admin/product_category');
					});
				}
			}

		});

	});




	/*End Product Category Manager*/









	/*****************************************************************
	| - Product Manager
	| - Product 
	| - Parameter ID,name,logo,url,createdAt,updatedAt
	 *****************************************************************/



	app.get('/admin/product', function(req, res) {
		models.Product.findAll().then(function(products) {
			models.Category.findAll().then(function(p_category) {
				res.render('../views/admin/product_view', {
					p_category: p_category,
					products: products
				});
			});
		});
	});


	/*
	| - Save the  product category to the database
	| - table category
	 */
	app.post('/admin/product/save',function(req,res){
		fs.createReadStream('../tmp/'+path.basename(req.files.userfile.path)).pipe(fs.createWriteStream('../data/' + req.files.userfile.name));
		deleteAfterUpload('../tmp/'+path.basename(req.files.userfile.path));
		models.Product.create({
			name: req.body.name,
			description: req.body.description,
			category_id : req.body.category_id,
			image: req.files.userfile.name
		}).then(function(create) {

			/*Check if create is successfull*/
			if(create){
				res.redirect('/admin/product');
			}

		});
	});


	/*Edit the product Category*/
	app.get('/admin/product/edit', function(req, res) {
		if(req.query.id)
		{

			models.Product.find({
				where: {
					id: req.query.id
				}
			}).then(function(product){
				models.Category.findAll().then(function(p_category) {
					res.render('../views/admin/product_edit_view', {
						product: product,
						p_category: p_category
					});

				});
			});

		}

	});



	/*End Edit Product Edit*/



	app.post('/admin/product/update',function(req,res){
		models.Product.find({
			where: {
				id: req.body.id
			}
		}).then(function(update) {
			if (update) {
				/* check if the user change the logo*/
				if(req.files.userfile.name != "") {
					fs.createReadStream('../tmp/'+path.basename(req.files.userfile.path)).pipe(fs.createWriteStream('../data/' + req.files.userfile.name));
					deleteAfterUpload('../tmp/'+path.basename(req.files.userfile.path));

					update.updateAttributes({
						name: req.body.name,
						description: req.body.description,
						category_id : req.body.category_id,
						image: req.files.userfile.name
					}).then(function() {
						res.redirect('/admin/product');
					});
				} else {
					update.updateAttributes({
						name: req.body.name,
						description: req.body.description,
						category_id : req.body.category_id,
					}).then(function() {
						res.redirect('/admin/product');
					});
				}
			}

		});
	});

	/*End Product Manager*/
	
	/*Delete Product*/
	app.post('/admin/product/delete',function(req,res) {
		models.Product.destroy({ 
		    where: {
		      id: req.body.id
		    },
		    truncate: false /* this will ignore where and truncate the table instead */
		}).then(function(del){
			res.send(req.body.id);
		});
	});
	/*End Delete Product*/
}
