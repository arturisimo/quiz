var path = require('path');
var Sequelize = require('sequelize');
 
// sequelize initialization
var sequelize = new Sequelize(process.env.DATABASE_URL);
 
var Quiz = sequelize.import(path.join(__dirname, 'quiz'));

exports.Quiz = Quiz;

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