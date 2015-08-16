var models = require('../models/models.js');

var temas = ["otro", "humanidades","ocio","ciencia","tecnologia"];

exports.load = function(request, response, next, id){
	models.Quiz.findById(id).then(function(quiz){
		if(quiz){
			request.quiz = quiz;
			next();
		} else{
			next(new Error('No hay pregunta #'+id));
		}
	}).catch(function(error){next(error)});
}

//welcome 
exports.index = function(request, response, next){

	var data = { title: 'Bienvenid@ a Quiz', 
				 errors:[],
				 usuario_sesion: request.session.user,
				 classMenu: { index:true, quiz: false, author:false, stats: false, doc:false}
	};

	if(request.session.user) {

		data.description = 'Zona de administración';

		models.Quiz.findAll({ include: [{ model: models.Comment }] }).then(function(quizes) {
			data.quizes = quizes;
			response.render('quizes/list-admin', data);
		}).catch(function(error){next(error)});

	} else {
		data.description = 'El portal donde puedes crear tus propios juegos';
		response.render('', data);
	}

}


//author
exports.author = function(request, response){
	response.render('author', { title: 'Bienvenid@ a Quiz', 
								description: 'by arturo', 
								usuario_sesion: request.session.user,
								classMenu: { index:false, quiz: false, author:true, stats: false, doc:false} });
}

//error 404
exports.notfound = function(request, response) {
	response.render('error', { title: 'ERROR 404', 
							   description: 'Página no encontrada', 
							   message:'',
							   error:'', 
							   usuario_sesion: request.session.user,
							   classMenu: { index:false, quiz: false, author:false, stats: false, doc:false }});
}

//list quiz
exports.quizes = function(request, response, next){
	var data = { title: 'Preguntas', 
				 description: 'Prueba tus conocimientos', 
				 usuario_sesion: request.session.user,
				 classMenu: { index:false, quiz: true, author:false, stats: false, doc:false },
				 comments:[]
				};
	
	models.Quiz.findAll().then(function(quizes){
		data.quizes = quizes; 
		response.render('quizes/list', data);
	}).catch(function(error){next(error)});
}

//list quiz by search
exports.search = function(request, response,  next){
	var search = request.body.search;
	var where = "lower(preguntas) like '%" + search.toLowerCase() + "%'";
	var criterio = " Busqueda: '" + search + "'";
	models.Quiz.findAll({order: [['preguntas', 'DESC']], where: [where]}).then(function(quizes){
		response.render('quizes/list', { title: 'Preguntas ' + criterio, 
											 description: quizes.length > 0  ? 'Prueba tus conocimientos' : 'no hay preguntas con este criterio', 
											 quizes: quizes, 
											 comments: [],
											 search: search,
											 usuario_sesion: request.session.user,
											 classMenu: { index:false, quiz: true, author:false, stats: false, doc:false }});
	}).catch(function(error){next(error)});

}

//quiz
exports.quiz = function(request, response){
	var data = { title: 'Pregunta #' +  request.quiz.id, 
				 description: 'Prueba tus conocimientos', 
				 quiz: request.quiz, 
				 errors:[],
				 msg:'',
				 usuario_sesion: request.session.user,
				 classMenu: { index:false, quiz: true, author:false, stats: false, doc:false }
				};

	models.Comment.findAll({order: [['id', 'DESC']], where: {quizId:request.quiz.id}}).then(function(comments){
		data.comments = comments; 
		response.render('quizes/question', data);
	}).catch(function(error){next(error)});
}

//answer quiz
exports.answer = function(request, response){

	var answer = request.body.answer;
	var respuesta = request.quiz.respuestas
	var feedback = answer && answer.toLowerCase() === respuesta.toLowerCase() ? "OK":"KO";	
	
	response.render('quizes/answer', { title: 'Pregunta #'+  request.quiz.id + " " + request.quiz.preguntas, 
									   description: '', 
									   respuesta: answer,
									   feedback: feedback, 
									   usuario_sesion: request.session.user,
									   classMenu: { index:false, quiz: true, author:false, stats: false, doc:false}});
}

/*
 * ADMIN CONTROLLERS
 */

exports.stadistic = function(request, response, next) {

	if(request.session.user){
	
		var data = { title: 'Estadísticas', 
			 description: 'Prueba tus conocimientos', 
			 quiz: request.quiz, 
			 errors:[],
			 usuario_sesion: request.session.user,
			 classMenu: { index:false, quiz: false, author:false, stats: true, doc:false }
		};
		
		models.Quiz.findAll({ include: [{ model: models.Comment }] }).then(function(quizes) {

			var num_comment = 0;
			var num_quiz_comment = 0;
			var num_quiz_nocomment = 0;

			quizes.forEach(function(quiz){
				if (quiz.comments.length > 0) {
					num_quiz_comment++;
					num_comment += quiz.comments ? quiz.comments.length : 0;
			 	} else {
			 		num_quiz_nocomment++;
			 	}
			});

			var num_quiz = quizes.length;
			var avg_comment_quiz = (num_comment / num_quiz).toFixed(2);

			data.stats = {num_quiz:num_quiz, num_comment:num_comment, num_quiz_comment:num_quiz_comment, num_quiz_nocomment:num_quiz_nocomment, avg_comment_quiz:avg_comment_quiz};
			response.render('quizes/stadistic', data);
		});
	} else {
			next("No tienes permisos");
	}
};

//doc
exports.doc = function(request, response, next){
	if(request.session.user){
		var fs = require('fs');
		var dir = './public/doc/';

		fs.readdir(dir, function (err, files) {
		  if (err) next(err);

		  	response.render('doc', { title: 'Documentación', 
									description: '', 
									files: files,
									dir: dir,
									usuario_sesion: request.session.user,
									classMenu: { index:false, quiz: false, author:false, stats: false, doc:true} });

		  
		});
	} else {
			next("No tienes permisos");
	}
}

//add quiz
exports.create = function(request, response, next ){
	if(request.session.user){
		var quiz = {id: "", preguntas:"", respuestas:"", tematica: ""};
		response.render('quizes/add', { title: 'Nueva Pregunta', 
										description: '', 
										quiz: quiz, 
										errors:[],
										usuario_sesion: request.session.user,
										temas: temas,
										classMenu: { index:false, quiz: true, author:false, stats: false, doc:false}});
	} else {
			next("No tienes permisos");
	}
}

//edit quiz
exports.update = function(request, response, next){
	if(request.session.user){
		var quiz = request.quiz;
		response.render('quizes/add', { title: 'Modificación de la pregunta ' +  quiz.id, 
										description: '', 
										quiz: quiz, 
										errors:[],
										usuario_sesion: request.session.user,
										temas: temas,
										classMenu: { index:false, quiz: true, author:false, stats: false, doc:false }});
	} else {
			next("No tienes permisos");
	}	
}

//insert quiz / update quiz
exports.insert = function(request, response, next){
	if(request.session.user){
		var id = request.body.id;
		var preguntas = request.body.preguntas;
		var respuestas = request.body.respuestas;
		var tematica = request.body.tematica;

		//update quiz
		if(id!=''){
			models.Quiz.findById(id).then(function(quiz){
				if(quiz){
					quiz.preguntas = preguntas;
					quiz.respuestas = respuestas;
					quiz.tematica = tematica;

					quiz.validate().then(function(err) {
						if(err) {
							response.render("quizes/add", { title: 'Modificación de la pregunta ' +  quiz.id, 
													   description: '', 
													   quiz: quiz, 
													   errors:err.errors,
													   temas: temas,
													   usuario_sesion: request.session.user,
													   classMenu: { index:false, quiz: true, author:false, stats: false, doc:false }});
						} else {
							quiz.save({fields: ["preguntas", "respuestas", "tematica"]}).then(function(){
								response.redirect('/quizes');
							}).catch(function(error){next(error)});
						}
					});
				}
			});
		} else {
			//add quiz	
			var quiz = models.Quiz.build({preguntas: preguntas, respuestas:respuestas, tematica: tematica});

			quiz.validate().then(function(err) {
				if(err) {
					response.render("quizes/add", { title: 'Nueva pregunta ', 
											   description: '', 
											   quiz: quiz, 
											   errors:err.errors,
											   temas: temas,
											   usuario_sesion: request.session.user,
											   classMenu: { index:false, quiz: true, author:false, stats: false, doc:false }});
				} else {
					quiz.save().then(function(){
						response.redirect('/quizes');
					}).catch(function(error){next(error)});
				}
			});
		}
	} else {
			next("No tienes permisos");
	}
}

//delete quiz
exports.delete = function(request, response, next){
	if(request.session.user){
		request.quiz.destroy().then(function(){
			response.redirect('/quizes');
		}).catch(function(error){next(error)});
	} else {
			next("No tienes permisos");
	}	
}