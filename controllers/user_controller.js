var users = {
	admin: {
		id: 1,
		username: "admin",
		password: "1234"
	},
	pepe: {
		id: 2,
		username: "pepe",
		password: "5678"
	}
};

// Compreba si el usuario esta registrado en users
// Si autenticación falla o hay errores se ejecuta callback(error),
exports.autenticar = function(login, password, callback) {
	if(users[login]) {
		if(password === users[login].password) {
			callback(null, users[login]);
		} else {
			callback(new Error("Password erróneo."));
		}
	} else {
		callback(new Error("No existe el usuario."));
	}
};

exports.user = function(request, response){

	if(request.session.user){
		var data = { title: 'Usuario ' + request.session.user.username, 
					 description: '', 
					 file: 'quizes/question',
					 usuario_sesion: request.session.user,
					 classMenu: { index:false, quiz: false, author:false, stats: false, doc:false }
					};
		response.render('user/user', data);
	} else {
			next("No tienes permisos");
	}
	
	
}
