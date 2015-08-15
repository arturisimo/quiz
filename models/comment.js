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
					},
					len: {
					    args: [0, 255],
					    msg: 'La longitud máxima es de 250 carácteres'
					}
				}
			},
			valid: {
		    	type: Datatypes.BOOLEAN
			}
	});
}