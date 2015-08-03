var models = require('../models/models.js');


exports.create = function(request, response){
	var quiz = request.quiz;
	response.render('quizes/add', { title: 'Modificación de la pregunta ' +  quiz.id, 
									description: '', 
									quiz: quiz, 
									errors:[],
									temas: temas,
									file: 'quizes/add', 
									classMenu: { index:false, quiz: true, author:false }});
}

exports.insert = function(request, response){
	var quiz = request.quiz;
	response.render('quizes/add', { title: 'Modificación de la pregunta ' +  quiz.id, 
									description: '', 
									quiz: quiz, 
									errors:[],
									temas: temas,
									file: 'quizes/add', 
									classMenu: { index:false, quiz: true, author:false }});
}
