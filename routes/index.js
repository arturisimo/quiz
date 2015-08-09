var express = require('express');
var router = express.Router();

//importar routes
var controller = require('../controllers/quiz_controller');
router.param('id', controller.load);

var comment_controller = require('../controllers/comment_controller');
router.param('commentId', comment_controller.load);

var session_controller = require('../controllers/session_controller');
var user_controller = require('../controllers/user_controller');

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
router.get('/doc', controller.doc);

router.post('/quizes/:id(\\d+)/comments/insert', comment_controller.insert);
router.get('/comments', comment_controller.comments);
router.get('/comment/:commentId(\\d+)/delete', comment_controller.delete);
router.get('/comment/:commentId(\\d+)/valid', comment_controller.valid);

router.get('/login', session_controller.login);
router.post('/init', session_controller.create);
router.get('/logout', session_controller.logout);

router.get('/user/:userId(\\d+)', user_controller.user);


router.get('*', controller.notfound);

module.exports = router;

