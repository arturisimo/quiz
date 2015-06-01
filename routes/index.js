var express = require('express');
var router = express.Router();

//importar routes
var controller = require('../controllers/quiz_controller');


/* GET home page. */
router.get('/', function(request, response, next) {
  response.render('index', { title: 'Bienvenid@ a Quiz' });
});


router.get('/quizes/question', controller.question);
router.get('/quizes/answer', controller.answer);
router.get('/author', controller.author);
/*
router.get('/quizes/question', function(request, response) {
     response.render('quizes/question', {title: 'Bienvenid@ a Quiz'});
});

router.get('/quizes/answer', function(request, response) {

	var feedback = request.query.answer.toLowerCase() === "roma" ? "Correcto" : "Incorrecto";
	response.render('quizes/answer', { title: 'Bienvenid@ a Quiz', feedback: feedback });
	
});

router.get('/quizes/author', function(request, response) {
     response.render('quizes/author');
});
*/

router.get('*', function(request, response) {
	response.render('error', { message: 'ERROR 404'})
}) ;


module.exports = router;
