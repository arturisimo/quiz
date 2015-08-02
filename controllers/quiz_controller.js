var models = require('../models/models.js');

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

exports.index = function(request, response){
	 var data = {title: 'Bienvenid@ a Quiz', description: 'El portal donde puedes crear tus propios juegos', file: 'index', classMenu: { index:true, quiz: false, author:false }};
	 response.render('', data);
}

exports.quizes = function(request, response, next){
	
	var data = { title: 'Preguntas', description: 'Prueba tus conocimientos', file: 'quizes/question', classMenu: { index:false, quiz: true, author:false }};
	
	models.Quiz.findAll().then(function(quizes){
		data.quizes = quizes; 
		response.render('quizes/question', data);
	}).catch(function(error){next(error)});
}

exports.quiz = function(request, response){
	var quizes = new Array(request.quiz);
	var data = { title: 'Pregunta #' +  request.quiz.id, 
				 description: 'Prueba tus conocimientos', 
				 quizes: [request.quiz], 
				 file: 'quizes/question',
				 classMenu: { index:false, quiz: true, author:false }
				}
	response.render('quizes/question', data);
}

exports.create = function(request, response){
	var quiz = {id: "", preguntas:"", respuestas:"", tematica: ""};
	response.render('quizes/add', {title: 'Nueva Pregunta', description: 'Añade una nueva pregunta', quiz: quiz, file: 'quizes/add', classMenu: { index:false, quiz: true, author:false }});
}

exports.update = function(request, response){
	var quiz = request.quiz;
	response.render('quizes/add', {title: 'Modificación de la pregunta ' +  quiz.id, description: 'Añade una nueva pregunta', quiz: quiz, file: 'quizes/add', classMenu: { index:false, quiz: true, author:false }});
}

exports.edit = function(request, response){
		
}

exports.insert = function(request, response){
	var id = request.body.id;
	var preguntas = request.body.preguntas;
	var respuestas = request.body.respuestas;
	var tematica = request.body.tematica;

	if(id!=''){
		models.Quiz.findById(id).then(function(quiz){
			if(quiz){
				quiz.preguntas = preguntas;
				quiz.respuestas = respuestas;
				quiz.tematica = tematica;

				quiz.save({fields: ["preguntas", "respuestas", "tematica"]}).then(function(){
					response.redirect('/quizes');
				})
			}
		});
	} else {

		var quiz = models.Quiz.build({preguntas: preguntas, respuestas:respuestas, tematica: tematica});
		quiz.save().then(function(){
			response.redirect('/quizes');
		}).catch(function(error){next(error)});
	}
	
}

exports.delete = function(request, response){
		request.quiz.destroy().then(function(){
			response.redirect('/quizes');
		}).catch(function(error){next(error)});
}

exports.search = function(request, response,  next){
	var search = request.body.search;
	var where = "lower(preguntas) like '%" + search.toLowerCase() + "%'";
	var criterio = " Busqueda: '" + search + "'";
	models.Quiz.findAll({order: [['preguntas', 'DESC']], where: [where]}).then(function(quizes){
		response.render('quizes/question', {title: 'Preguntas ' + criterio, description: quizes.length > 0  ? 'Prueba tus conocimientos' : 'no hay preguntas con este criterio', quizes: quizes, file: 'quizes/question', classMenu: { index:false, quiz: true, author:false }});
	}).catch(function(error){next(error)});

}

exports.answer = function(request, response){

	var answer = request.body.answer;
	var respuesta = request.quiz.respuestas
	var feedback = answer && answer.toLowerCase() === respuesta.toLowerCase() ? "OK":"KO";	
	
	response.render('quizes/answer', { title: 'Pregunta #'+  request.quiz.id + " " + request.quiz.preguntas, 
									   description: '', 
									   respuesta: answer,
									   feedback: feedback, 
									   file : 'quizes/answer',
									   classMenu: { index:false, quiz: true, author:false }});
}

exports.author = function(request, response){
	response.render('author', { title: 'Bienvenid@ a Quiz', description: 'by arturo', file: 'author', classMenu: { index:false, quiz: false, author:true } });
}


exports.error = function(request, response) {
	response.render('error', { title: 'ERROR 404', description: '', message:'Página no encontrada', file : 'error', classMenu: { index:false, quiz: false, author:false }});
}