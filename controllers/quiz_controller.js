var models = require('../models');

exports.load = function(req, res, next, quizId) {
  models.Quiz.findById(quizId)
    .then(function(quiz) {
      if (quiz) {
        req.quiz = quiz;
        next();
      } else {
        next(new Error('No existe quizId=' + quizId));
      }
    }).catch(function(error) { next(error); });
};

//GET /quizzes
exports.index = function(req, res, next) {
  models
  .Quiz
  .findAll()
  .then(function(quizzes) {
    res.render('quizzes/index.ejs', { quizzes: quizzes});
  })
  .catch(function(error) { next(error); });
};
//GET /question
exports.show =function (req, res, next){
  models
  .Quiz
  .findById(req.params.quizId)
  .then(function(quiz) {
    if (quiz) {
      var answer = req.query.answer || '';
      res
      .render('quizzes/show', {quiz: quiz, answer: answer});
    }else{
      throw new Error('No hay preguntas en la BBDD.');
    }
  }).catch(function(error) {next(error);});
};

//GET /check
exports.check=function(req,res,next){
  models
  .Quiz
  .findById(req.params.quizId)
  .then(function(quiz) {
    if(quiz) {
      var answer = req.query.answer || "";
  var result= ((answer=== 'Roma') ? 'Correcta' : 'Incorrecta');
  res.render('quizzes/result',{quiz: quiz, result:result, answer: answer});
    }
    else {
      throw new Error('No existe ese quiz en la BBDD.');
    }
  }).catch(function(error) { next(error); });
};

//GET /quizzes/new
exports.new = function(req, res, next) {
  var quiz = models.Quiz.build({question: "", answer: ""});
  res.render('quizzes/new', {quiz: quiz});
};

//POST /quizzes/create
exports.create = function(req, res, next) {
  var quiz = models.Quiz.build({ question: req.body.quiz.question,
                                  answer:  req.body.quiz.answer} );

quiz.save({fields: ["question", "answer"]})
    .then(function(quiz) {
      req.flash('success', 'Quiz creado con éxito.');
      res.redirect('/quizzes');
    })
    .catch(Sequelize.ValidationError, function(error) {
      
      req.flash('error', 'Errores en el formulario: ');
      for (var i in error.errors) {
        req.flash('error', error.errors[i].value);
      };
      
      res.render('quizzes/new', {quiz: quiz});
    })
    .catch(function(error) {
      req.flash('error', 'Error al crear un Quiz: ' +error.message);
      next(error);
    });
}; 

//GET /quizzes/:id/edit
exports.edit = function(req, res, next) {
  var quiz = req.quiz; 
  res.render('quizzes/edit', {quiz: quiz});
};

//PUT /quizzes/:id
exports.update = function(req, res, next) {
  req.quiz.question = req.body.quiz.question;
  req.quiz.answer = req.body.quiz.answer;
  
  req.quiz.save({fields: ["question", "answer"]})
  .then(function(quiz) {
  req.flash('success', 'Quiz editado con éxito.');
    res.redirect('/quizzes');
  })
  .catch(Sequelize.ValidationError, function(error) {
    
    req.flash('error', 'Errores en el formulario:');
    for (var i in error.errors) {
      req.flash('error', error.errors[i].value);
    };
    
    res.render('quizzes/edit', {quiz: req.quiz});
  })
  .catch(function(error) {
    req.flash('error', 'Error al editar el Quiz: '+error.message);
      next(error);
  });
};

exports.destroy = function(req, res, next) {
  req.quiz.destroy()
    .then( function() {
      req.flash('success', 'Quiz borrado con éxito.');
      res.redirect('/quizzes');
    })
    .catch(function(error){
      req.flash('error', 'Error al editar el Quiz: '+error.message);
      next(error);
    });
};
