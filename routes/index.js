var express = require('express');
var router = express.Router();

var quiz_controller = require('../controllers/quiz_controller');
var comment_controller = require('../controllers/comment_controller');
var session_controller = require('../controllers/session_controller');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz', errors: [] });
});

// Autoload de comandos con :quizId
router.param('quizId', quiz_controller.load); // Autoload :quizId
router.param('commentId', comment_controller.load); // Autoload :commentId

// Definici�n de rutas de sesi�n
router.get('/login', session_controller.new); // formulario login
router.post('/login', session_controller.create); // crear sesi�n
router.get('/logout', session_controller.destroy); // destruir sesi�n

/* Definici�n de rutas de Quizes */
router.get('/quizes', quiz_controller.index);
router.get('/quizes/:quizId(\\d+)', quiz_controller.show);
router.get('/quizes/:quizId(\\d+)/answer', quiz_controller.answer);
router.get('/quizes/new', session_controller.loginRequired, quiz_controller.new);
router.post('/quizes/create', session_controller.loginRequired,quiz_controller.create);
router.get('/quizes/:quizId(\\d+)/edit', session_controller.loginRequired,quiz_controller.edit);
router.put('/quizes/:quizId(\\d+)', session_controller.loginRequired,quiz_controller.update);
router.delete('/quizes/:quizId(\\d+)', session_controller.loginRequired,quiz_controller.destroy);

/* Definici�n de rutas de comentarios */
router.get('/quizes/:quizId(\\d+)/comments/new', comment_controller.new);
router.post('/quizes/:quizId(\\d+)/comments', comment_controller.create);
router.get('/quizes/:quizId(\\d+)/comments/:commentId(\\d+)/publish', session_controller.loginRequired, comment_controller.publish);

/* Creditos */
router.get('/author', function (req, res) {
    res.render('author', { errors: [] });
});

module.exports = router;
