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

exports.create = function(request, response){
	var quiz = {id: "", preguntas:"", respuestas:"", tematica: ""};
	response.render('quizes/add', {title: 'Nueva Pregunta', description: 'Añade una nueva pregunta', quiz: quiz, file: 'quizes/add'});
}

exports.update = function(request, response){
	var quiz = request.quiz;
	response.render('quizes/add', {title: 'Modificación de la pregunta ' +  quiz.id, description: 'Añade una nueva pregunta', quiz: quiz, file: 'quizes/add'});
}

exports.insert = function(request, response){
	var id = request.body.id;
	var preguntas = request.body.preguntas;
	var respuestas = request.body.respuestas;
	var tematica = request.body.tematica;
	//var post =  {id: id , preguntas: preguntas, respuestas:respuestas, tematica: tematica};
	//console.log(quiz);
	if(id != ''){
		var post =  {id: id , preguntas: preguntas, respuestas:respuestas, tematica: tematica};
		var quiz = models.Quiz.build(post);
		quiz.updateAttributes({preguntas: preguntas, respuestas:respuestas, tematica: tematica}).then(function(){
			response.redirect('/');
		}).catch(function(error){next(error)});
	} else {
		var quiz = models.Quiz.build({preguntas: preguntas, respuestas:respuestas, tematica: tematica});
		quiz.save().then(function(){
			response.redirect('/');
		}).catch(function(error){next(error)});
	}
	
}

exports.search = function(request, response,  next){
	var search = request.body.search;
	var tematica = request.body.tematica;
	var where = "";
	var criterio = "";
	if (tematica!=''){
		where = where + "tematica = '" + tematica + "'";
		criterio = criterio + " Temática: " + tematica;
	}
	if (search!=''){
		if(where!=''){
			where = where + " and "
		}
		where = where + "lower(preguntas) like '%" + search.toLowerCase() + "%";
		criterio = criterio + " Busqueda: '" + search + "'";
	}

	//var where = "lower(preguntas) like '%" + search.toLowerCase() + "%";
	
	models.Quiz.findAll({where: [where]}).then(function(quizes){
		response.render('quizes/question', {title: 'Preguntas ' + criterio, description: quizes.length > 0  ? 'Prueba tus conocimientos' : 'no hay preguntas con este criterio', quizes: quizes, file: 'quizes/question'});
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