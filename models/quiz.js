// model definition
module.exports = function(sequelize, Datatypes) {
    return sequelize.define('quiz', {
		    preguntas: Datatypes.STRING,
		    respuestas: Datatypes.STRING,
		    tematica: Datatypes.STRING
	});
}
