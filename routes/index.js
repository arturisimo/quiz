var express = require('express');
var router = express.Router();

//importar routes
var controller = require('../controllers/quiz_controller');

router.get('/', controller.index);
router.get('/quizes/question', controller.question);
router.get('/quizes/answer', controller.answer);
router.get('/author', controller.author);
router.get('*', controller.error);

module.exports = router;
