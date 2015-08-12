var path = require('path');
var Sequelize = require('sequelize');
 
// sequelize initialization
var sequelize = new Sequelize(process.env.DATABASE_URL);
 
var Quiz = sequelize.import(path.join(__dirname, 'quiz'));
var Comment = sequelize.import(path.join(__dirname, 'comment'));

Comment.belongsTo(Quiz);
Quiz.hasMany(Comment);

Quiz.stats = function() {
	 return sequelize.query(
	 "SELECT q.id as quizId, c.id as commentId from quizzes q left outer join comments c on (q.id=c.\"quizId\")",
 	{type: sequelize.QueryTypes.SELECT});
}

exports.Quiz = Quiz;
exports.Comment = Comment;

//sync the model with the database. crea e inicializa la tabla
sequelize.sync({ force: false }).then(function(err) {
    Quiz.count().then(function(count){
        if(count===0){
            Quiz.create({
                preguntas: "Capital de Italia?",
                respuestas: "Roma"
            });
        }

    });
}).catch(function(error){
    console.log(error.name  + " > " + error.message);
});