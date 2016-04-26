var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz' });
});

routers.get('/quizzes/question', quizController.question);
router.get('/quizzes/result', quizController.answer);

module.exports = router;
