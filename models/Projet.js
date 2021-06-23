const Investissement = require("./Investissement");
const Utilisateur = require("./Utilisateur");
module.exports = (sequelize,DataTypes) => {
    const Projet = sequelize.define("Projet",{
        id_utilisateur : {type : DataTypes.INTEGER,allowNull:false, validate : {notEmpty:true}},
        type_retour : {type : DataTypes.ENUM({values: ['actions', 'remboursement'] }),allowNull:false, validate : {notEmpty:true}},
        titre : {type : DataTypes.STRING,allowNull:false, validate : {notEmpty:true}},
        description : {type : DataTypes.TEXT,allowNull:false, validate : {notEmpty:true}},
        image_illustration : {type : DataTypes.STRING,allowNull:true, validate : {notEmpty:true}},
        lien_pitch : {type : DataTypes.STRING,allowNull:true},
        etat : {type : DataTypes.ENUM({values: ['examen', 'valider','recaler'] })},
        financement : {type : DataTypes.ENUM({values: ['collecte', 'terminer','annuler'] ,allowNull:true} )},
        montant_objectif : {type : DataTypes.INTEGER,defaultValue : function(){return 0},allowNull:false},
        montant_collecter : {type : DataTypes.INTEGER,defaultValue : function(){return 0},allowNull:false},
        fichier_presentation : {type : DataTypes.STRING,allowNull:true},
    });

    Projet.associate = (models) => {
        Projet.hasMany(models.Investissement, {foreignKey: 'id_projet',onDelete: 'CASCADE',});
        Projet.belongsTo(models.Utilisateur, {foreignKey: 'id_utilisateur'});
    };

    return Projet;
}