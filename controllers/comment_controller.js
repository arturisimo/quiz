var models = require('../models/models.js');

exports.insert = function(request, response){
	var quiz = request.quiz;

	//add quiz	
	var comment = models.Comment.build({nombre: request.body.nombre, site:request.body.site, comentario: request.body.comentario, quizId: quiz.id});

	comment.validate().then(function(err) {
		if(err) {
			response.redirect('/quizes/'+quiz.id);						   
		} else {
			comment.save().then(function(){
				response.redirect('/quizes/'+quiz.id);
			}).catch(function(error){next(error)});
		}
	});
}