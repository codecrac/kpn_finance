const Projet = require("./Projet");
const DetailsInvestissement = require("./DetailsInvestissement");
module.exports = (sequelize,DataTypes) => {
    const Investissement = sequelize.define("Investissement",{
        id_utilisateur : {type : DataTypes.INTEGER,allowNull:false, validate : {notEmpty:true}},
        id_projet : {type : DataTypes.INTEGER,allowNull:false, validate : {notEmpty:true}},
        montant_investit : {type : DataTypes.INTEGER,allowNull:false, validate : {notEmpty:true}},
    });

    Investissement.associate = (models) => {
        Investissement.belongsTo(models.Projet, {foreignKey: 'id_projet'});
        Investissement.belongsTo(models.Utilisateur, {foreignKey: 'id_utilisateur'});
        Investissement.hasMany(models.DetailsInvestissement, {foreignKey: 'id_investissement',onDelete: 'CASCADE',});
    };
    return Investissement;
}