// model definition
module.exports = function(sequelize, Datatypes) {
    return sequelize.define('comment', {
		    nombre: {
		    	type: Datatypes.STRING
			},
			site: {
		    	type: Datatypes.STRING
			},		
		    comentario: {
		    	type: Datatypes.STRING,
		    	validate: {
					notEmpty: {
							msg: "Falta el comentario"
					}
				}
			}
	});
}
