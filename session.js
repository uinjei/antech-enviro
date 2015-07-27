var models  = require('./models');

exports.init = function(session, callback) {
	
	//load settings
	models.Settings.find({
		where: {
			id: 1
		}
	}).then(function(settings) {
		if (!session.settings) session.settings = settings;
		//load principal
		models.Principal.findAll({
			include:[models.Category],
			order: 'name asc'
		}).then(function(principals) {
			if (!session.principals) session.principals = principals;
			callback();
		});
	});
}