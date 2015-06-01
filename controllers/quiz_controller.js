exports.index = function(request, response){
	 response.render('', {title: 'Bienvenid@ a Quiz', file: 'index'});
}


exports.question = function(request, response){
	 response.render('quizes/question', {title: 'Bienvenid@ a Quiz', question: 'Capital de Italia', file: 'quizes/question'});
}

exports.answer = function(request, response){

	var answer = request.query.answer;
	var feedback = answer && answer.toLowerCase() === "roma" ? "Correcto" : "Incorrecto";	

	response.render('quizes/answer', { title: 'Bienvenid@ a Quiz', feedback: feedback, file : 'quizes/answer' });
}

exports.author = function(request, response){
	response.render('author', { title: 'Bienvenid@ a Quiz', file: 'author' });
}

exports.error = function(request, response) {
	response.render('error', { title: 'ERROR 404', file : 'error'});
}