module.exports = (sequelize,DataTypes) => {
    const Utilisateur = sequelize.define("Utilisateur",{
        type : {type : DataTypes.ENUM({values: ['porteur_de_projet', 'investisseur'] }),allowNull:false, validate : {notEmpty:true}},
        nom_complet : {type : DataTypes.STRING,allowNull:false, validate : {notEmpty:true}},
        telephone : {type : DataTypes.STRING,allowNull:false, validate : {notEmpty:true}},
        email : {type : DataTypes.STRING,unique:true,allowNull:false, validate : {notEmpty:true}},
        mot_de_passe : {type : DataTypes.TEXT,allowNull:false, validate : {notEmpty:true}},
    });

    
    Utilisateur.associate = (models) => {
        Utilisateur.hasMany(models.Investissement, {foreignKey: 'id_utilisateur',onDelete: 'CASCADE',});
    };

    return Utilisateur;
}