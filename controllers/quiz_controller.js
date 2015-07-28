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
	 response.render('', {title: 'Bienvenid@ a Quiz', description: 'El portal donde puedes crear tus propios juegos', file: 'index'});
}

exports.quizes = function(request, response, next){
	 models.Quiz.findAll().then(function(quizes){
		response.render('quizes/question', {title: 'Preguntas', description: 'Prueba tus conocimientos', quizes: quizes, file: 'quizes/question'});
	}).catch(function(error){next(error)});
}

exports.quiz = function(request, response){
	var quizes = new Array(request.quiz);
	response.render('quizes/question', {title: 'Pregunta #' +  request.quiz.id, description: 'Prueba tus conocimientos', quizes: [request.quiz], file: 'quizes/question'});
}

exports.search = function(request, response,  next){
	var search = request.body.search;
	models.Quiz.findAll({where: ["lower(preguntas) like '%" + search.toLowerCase() + "%'"]}).then(function(quizes){
		response.render('quizes/question', {title: 'Preguntas "' + search + '"', description: quizes.length > 0  ? 'Prueba tus conocimientos' : 'no hay preguntas con este criterio', quizes: quizes, file: 'quizes/question'});
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
									   file : 'quizes/answer' });
}

exports.author = function(request, response){
	response.render('author', { title: 'Bienvenid@ a Quiz', description: 'by arturo', file: 'author' });
}

exports.error = function(request, response) {
	response.render('error', { title: 'ERROR 404', description: 'error', file : 'error'});
}