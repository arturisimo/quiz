var models = require('../models/models.js');


exports.load = function(request, response, next, commentId) {
	models.Comment.findById(commentId).then(function(comment) {
		if(comment) {
			request.comment = comment;
			next();
		} else {
			next(new Error("No hay comentario #" + commentId));
		}
	}).catch(function(error) {next(error);});
};

exports.insert = function(request, response){
	var quiz = request.quiz;

	//add quiz	
	var comment = models.Comment.build({nombre: request.body.nombre, site:request.body.site, comentario: request.body.comentario, quizId: quiz.id});

	comment.validate().then(function(err) {
		if(err) {
				var data = { title: 'Pregunta #' +  request.quiz.id, 
							 description: 'Prueba tus conocimientos', 
							 quiz: quiz, 
							 errors:err.errors,
							 file: 'quizes/question',
							 comments: [],
							 usuario_sesion: request.session.user,
							 classMenu: { index:false, quiz: true, author:false }
							};

				models.Comment.findAll({order: [['id', 'DESC']], where: {quizId:quiz.id}}).then(function(comments){
					data.comments = comments; 
					response.render('quizes/question', data);
				}).catch(function(error){next(error)});

		} else {
			comment.save().then(function(){
				response.redirect('/quizes/'+quiz.id);
			}).catch(function(error){next(error)});
		}
	});
}

exports.comments = function(request, response){
	if(request.session.user){
		models.Comment.findAll().then(function(comments){
			var data = { title: 'Bienvenid@ a Quiz', 
 			 			 description: 'El portal donde puedes crear tus propios juegos', 
 			  			 usuario_sesion: request.session.user,
 			  			 comments: comments,
 			  			 classMenu: { index:true, quiz: false, author:false }
 			};
 			response.render('', data);
		}).catch(function(error){next(error)});
	} else {
		response.redirect('/');
	}
}	


//delete comment
exports.delete = function(request, response, next){
	if(request.session.user){
		request.comment.destroy().then(function(){
			response.redirect('/');
		}).catch(function(error){next(error)});
	} else {
			next("No tienes permisos");
	}	
}

exports.valid = function(request, response, next){

	if(request.session.user){
		var comment = request.comment;
		comment.valid = !comment.valid;

		comment.save().then(function(){
			response.redirect('/');
		}).catch(function(error){next(error)});
	} else {
		next("No tienes permisos");
	}	
}