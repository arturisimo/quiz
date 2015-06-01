exports.question = function(request, response){
	 response.render('quizes/question', {title: 'Bienvenid@ a Quiz', question: 'Capital de Italia'});
}

exports.answer = function(request, response){

	var answer = request.query.answer;
	var feedback = answer && answer.toLowerCase() === "roma" ? "Correcto" : "Incorrecto";	

	response.render('quizes/answer', { title: 'Bienvenid@ a Quiz', feedback: feedback });
}

exports.author = function(request, response){
	response.render('author', { title: 'Bienvenid@ a Quiz' });
}