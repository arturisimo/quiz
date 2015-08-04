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
exports.index = function(request, response){
	 var data = { title: 'Bienvenid@ a Quiz', 
	 			  description: 'El portal donde puedes crear tus propios juegos', 
	 			  file: 'index', 
	 			  usuario_sesion: request.session.user,
	 			  classMenu: { index:true, quiz: false, author:false }
	 			};
	 response.render('', data);
}
//author
exports.author = function(request, response){
	response.render('author', { title: 'Bienvenid@ a Quiz', 
								description: 'by arturo', 
								file: 'author', 
								usuario_sesion: request.session.user,
								classMenu: { index:false, quiz: false, author:true } });
}
//error 404
exports.notfound = function(request, response) {
	response.render('error', { title: 'ERROR 404', 
							   description: 'Página no encontrada', 
							   message:'',
							   error:'', 
							   file : 'error', 
							   usuario_sesion: request.session.user,
							   classMenu: { index:false, quiz: false, author:false }});
}

//list quiz
exports.quizes = function(request, response, next){
	var data = { title: 'Preguntas', 
				 description: 'Prueba tus conocimientos', 
				 file: 'quizes/list', 
				 usuario_sesion: request.session.user,
				 classMenu: { index:false, quiz: true, author:false },
				 comments:[]
				};
	
	models.Quiz.findAll().then(function(quizes){
		data.quizes = quizes; 
		response.render(request.session.user ? 'quizes/list-admin' : 'quizes/list', data);
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
											 usuario_sesion: request.session.user,
											 file: 'quizes/list', 
											 classMenu: { index:false, quiz: true, author:false }});
	}).catch(function(error){next(error)});

}

//quiz
exports.quiz = function(request, response){
	var quizes = new Array(request.quiz);
	var data = { title: 'Pregunta #' +  request.quiz.id, 
				 description: 'Prueba tus conocimientos', 
				 quiz: request.quiz, 
				 file: 'quizes/question',
				 comments: [],
				 usuario_sesion: request.session.user,
				 classMenu: { index:false, quiz: true, author:false }
				}

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
									   file : 'quizes/answer',
									   usuario_sesion: request.session.user,
									   classMenu: { index:false, quiz: true, author:false }});
}

/*
 * ADMIN CONTROLLERS
 */


//add quiz
exports.create = function(request, response){
	var quiz = {id: "", preguntas:"", respuestas:"", tematica: ""};
	response.render('quizes/add', { title: 'Nueva Pregunta', 
									description: '', 
									quiz: quiz, 
									errors:[],
									usuario_sesion: request.session.user,
									temas: temas,
									file: 'quizes/add', 
									classMenu: { index:false, quiz: true, author:false }});
}

//edit quiz
exports.update = function(request, response){
	var quiz = request.quiz;
	response.render('quizes/add', { title: 'Modificación de la pregunta ' +  quiz.id, 
									description: '', 
									quiz: quiz, 
									errors:[],
									usuario_sesion: request.session.user,
									temas: temas,
									file: 'quizes/add', 
									classMenu: { index:false, quiz: true, author:false }});
}

//insert quiz / update quiz
exports.insert = function(request, response){
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
												   file: 'quizes/add', 
												   classMenu: { index:false, quiz: true, author:false }});
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
										   file: 'quizes/add', 
										   classMenu: { index:false, quiz: true, author:false }});
			} else {
				quiz.save().then(function(){
					response.redirect('/quizes');
				}).catch(function(error){next(error)});
			}
		});
	}
	
}

//delete quiz
exports.delete = function(request, response){
	request.quiz.destroy().then(function(){
		response.redirect('/quizes');
	}).catch(function(error){next(error)});
}