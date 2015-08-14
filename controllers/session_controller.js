
exports.login = function(request, response){
	response.render('login',{ errors:[], layout: 'login'} );
};

exports.create= function(request, response){

	var login = request.body.login;
	var password = request.body.password;

	var user_controller = require("./user_controller");
	
	user_controller.autenticar(login, password, function(error, user) {
		// Si hay error en el inicio de session
		if(error) {
			var errors=[{message: error}];
			response.render('login',{ errors:errors, layout: 'login'} );
			return;
		}

		request.session.user = {
			id: user.id,
			username: user.username,
		};

		// Redirección a path anterior a login
		response.redirect('/');
	});

};

exports.logout = function(request, response){
	delete request.session.user;
	response.redirect('/');
};