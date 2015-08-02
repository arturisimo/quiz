var express = require('express');
var router = express.Router();

//importar routes
var controller = require('../controllers/quiz_controller');


router.param('id', controller.load);

router.get('/', controller.index);
router.get('/quizes', controller.quizes);
router.get('/quizes/add', controller.create);
router.get('/quizes/:id(\\d+)/update', controller.update);
router.get('/quizes/:id(\\d+)/delete', controller.delete);
router.post('/quizes/insert', controller.insert);
router.post('/quizes/edit', controller.edit);
router.get('/quizes/:id(\\d+)', controller.quiz);
router.post('/quizes/search', controller.search);
router.post('/quizes/:id(\\d+)/answer', controller.answer);
router.get('/author', controller.author);
router.get('*', controller.error);

module.exports = router;

