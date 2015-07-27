var express = require('express')
      ,http = require('http')
      ,path = require('path')
      ,app = express();

// some environment variables
app.set('views', __dirname + '/views');
app.use("/data", express.static(__dirname + '/data'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser({
	keepExtensions: true, 
    uploadDir: __dirname + '/tmp',
    limit: '10mb'
	}));


app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));

app.use(express.static(path.join(__dirname, 'public')));

app.configure('development', function(){
	  app.use(express.session());
	  app.use(function(req, res, next){
		  res.locals.session = req.session;
		  next();
	  });

	  app.use(app.router);
	  
	  app.use(function(err, req, res, next) {
	        res.status(err.status || 500);
	        
	        console.log(err.message);
	        res.render('error');
	     });
	  
	  app.use(express.errorHandler());
	  app.locals.pretty = true;
	});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

module.exports = app;