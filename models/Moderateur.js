module.exports = (sequelize,DataTypes) => {
    const Moderateur = sequelize.define("Moderateur",{
        type : {type : DataTypes.ENUM({values: ['moderateur'] }),defaultValue : function(){return "moderateur";}, validate : {notEmpty:true}},
        nom_complet : {type : DataTypes.STRING,allowNull:false, validate : {notEmpty:true}},
        telephone : {type : DataTypes.STRING,allowNull:false, validate : {notEmpty:true}},
        email : {type : DataTypes.STRING,unique:true,allowNull:false, validate : {notEmpty:true}},
        mot_de_passe : {type : DataTypes.TEXT,allowNull:false, validate : {notEmpty:true}},
    });

    return Moderateur;
}