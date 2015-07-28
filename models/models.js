var path = require('path');
var Sequelize = require('sequelize');
 
// sequelize initialization
var sequelize = new Sequelize('postgres://usxdnzxkncgkow:C9Sq2PO1jbBnKDzD8XCrt6E6PD@ec2-54-217-202-110.eu-west-1.compute.amazonaws.com:5432/dbk8ktaimnp4ih');
 
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