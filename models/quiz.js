// model definition
module.exports = function(sequelize, Datatypes) {
    return sequelize.define('quiz', {
		    preguntas: {
		    	type: Datatypes.STRING,
		    	validate: {
					notEmpty: {
							msg: "Falta pregunta"
					}
				}
			},		
		    respuestas: {
		    	type: Datatypes.STRING,
		    	validate: {
					notEmpty: {
							msg: "Falta respuesta"
					}
				}
			},
		    tematica: {
		    	type: Datatypes.STRING,
		    	validate: {
					notEmpty: {
							msg: "Falta temática"
					}
				}
			}
	});
}