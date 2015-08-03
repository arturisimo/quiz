var express = require('express');
var router = express.Router();

//importar routes
var controller = require('../controllers/quiz_controller');
var comment_controller = require('../controllers/comment_controller');


router.param('id', controller.load);

router.get('/', controller.index);
router.get('/quizes', controller.quizes);
router.post('/quizes/search', controller.search);
router.get('/quizes/:id(\\d+)', controller.quiz);
router.get('/quizes/add', controller.create);
router.get('/quizes/:id(\\d+)/update', controller.update);
router.get('/quizes/:id(\\d+)/delete', controller.delete);
router.post('/quizes/insert', controller.insert);
router.post('/quizes/:id(\\d+)/answer', controller.answer);
router.get('/author', controller.author);


router.get('/quizes/:id(\\d+)/comments/add', comment_controller.create);
router.post('/quizes/:id(\\d+)/comments/insert', comment_controller.insert);



router.get('*', controller.notfound);

module.exports = router;

