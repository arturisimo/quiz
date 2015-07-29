var path = require('path');
var Sequelize = require('sequelize');
 
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name = (url[6]||null);
var user = (url[2]||null);
var pwd = (url[3]||null);
var protocol = (url[1]||null);
var dialect = (url[1]||null);
var port = (url[5]||null);
var host = (url[4]||null);

// sequelize initialization
var sequelize = new Sequelize(DB_name, user, pwd,
					{   dialect: protocol,
						protocol: protocol,
						port: port,
						host: host,
						omitNull: true // solo Postgres
					}
				);
 
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