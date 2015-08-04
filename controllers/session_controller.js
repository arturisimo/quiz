
exports.login = function(request, response){
	 var errors = request.session.errors || {};
	 request.session.errors = {};
	 response.render('login',{ errors:errors, layout: 'login'} );
};

exports.create= function(request, response){

	var login = request.body.login;
	var password = request.body.password;

	var user_controller = require("./user_controller");
	
	user_controller.autenticar(login, password, function(error, user) {
		// Si hay error en el inicio de session
		if(error) {
			console.log("error" + error);
			request.session.errors = [{	"message": "Se ha producido un error: " + error}];
			console.log("error" + request.session.errors["message"]);
			response.redirect("/login");
			return;
		}

		request.session.user = {
			id: user.id,
			username: user.username,
		};

		// Redirección a path anterior a login
		response.redirect('/quizes');
	});

};

exports.logout = function(request, response){
	delete request.session.user;
	response.redirect('/quizes');
};