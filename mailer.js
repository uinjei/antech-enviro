var nodemailer = require('nodemailer');
var emailTemplates = require('email-templates');
var path = require('path');
var templatesDir = path.join(__dirname, 'templates')
var env       = process.env.NODE_ENV || "development";
var config    = require(__dirname + '/config/conf.json')[env];

var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: config.email,
        pass: config.pass
    }
	});

// NB! No need to recreate the transporter object. You can use
// the same transporter object for all e-mails

exports.sendRequest = function(args, callback) {
	// send mail with defined transport object
	
	var qList = args.qList;
	
	emailTemplates(templatesDir, function(err, template) {

		  if (err) {
		    console.log(err);
		  } else {
		    // ## Send a single email
		    // Prepare nodemailer transport object

		    // An example users object with formatted email function
		    var locals = {
		      qList: args.qList,
		      name: args.name,
		      company: args.company,
		      address: args.address,
		      contact: args.contact,
		      email: args.email
		    };

		    // Send a single email
		    template('pricequote', locals, function(err, html, text) {
		      if (err) {
		        console.log(err);
		      } else {
		        transporter.sendMail({
		          from: config.email,
		          to: config.adminEmail,
		          subject: '(Antech Enviro Website) - Request for Price Quotation from ' + args.name,
		          html: html,
		          // generateTextFromHTML: true,
		          text: text
		        }, function(err, responseStatus) {
		          if (err) {
		            console.log(err);
		            callback(false);
		          } else {
		            console.log('status: '+responseStatus.response);
		            callback(true);
		          }
		        });
		      }
		    });
		  }
		});
	
}

exports.sendMessage = function(args, callback) {
	// send mail with defined transport object
	
	var qList = args.qList;
	
	emailTemplates(templatesDir, function(err, template) {

		  if (err) {
		    console.log(err);
		  } else {

		    // An example users object with formatted email function
		    var locals = {
		      name: args.name,
		      company: args.company,
		      subject: args.subject,
		      message: args.message,
		      phone: args.phone,
		      email: args.email
		    };

		    // Send a single email
		    template('message', locals, function(err, html, text) {
		      if (err) {
		        console.log(err);
		      } else {
		        transporter.sendMail({
		          from: config.email,
		          to: config.adminEmail,
		          subject: '(Antech Enviro Website) - Message from ' + args.name,
		          html: html,
		          // generateTextFromHTML: true,
		          text: text
		        }, function(err, responseStatus) {
		          if (err) {
		            console.log(err);
		            callback(false);
		          } else {
		            console.log('status: '+responseStatus.response);
		            callback(true);
		          }
		        });
		      }
		    });
		  }
		});
	
}













