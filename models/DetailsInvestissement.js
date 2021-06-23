const Investissement = require("./Investissement");
module.exports = (sequelize,DataTypes) => {
    const DetailsInvestissement = sequelize.define("DetailsInvestissement",{
        id_investissement : {type : DataTypes.INTEGER,allowNull:false, validate : {notEmpty:true}},
        montant : {type : DataTypes.INTEGER,allowNull:false, validate : {notEmpty:true}},
        date : {type : DataTypes.STRING,allowNull:false, validate : {notEmpty:true}},
    });

    return DetailsInvestissement;
}