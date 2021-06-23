var express = require("express");
var md5 = require("md5");
var body_parser = require("body-parser");
var router = express.Router();


const {Utilisateur,Moderateur} = require("../../models");


// router.get("/",function(req,res){
//     res.render("home/index");
// });

router.get("/se-connecter",function(req,res){
    res.render("home/connexion");
});


var jsonParser = body_parser.json();
var urlencodedParser = body_parser.urlencoded({ extended: false })

router.post("/inscription",urlencodedParser,function(req,res){
    var type = req.body.type;
    var nom_complet = req.body.nom_complet;
    var telephone = req.body.telephone;
    var email= req.body.email;
    var mot_de_passe = req.body.mot_de_passe;
    var crypt_password = md5(mot_de_passe);

    Utilisateur.findOne({where : {email:email}}).then((un_utilisateur_avec_le_mail)=>{
    
        if(un_utilisateur_avec_le_mail){
            req.flash("error","Désolé, Cette adresse email est déja utilisée");
            return res.redirect("/inscription");
        }else{
            Utilisateur.create({
                type : type,
                nom_complet : nom_complet,
                telephone : telephone,
                email : email,
                mot_de_passe : crypt_password,
            }).then(function(){
                req.flash("info","Inscription reussi, connectez-vous");
                return res.redirect("/se-connecter");
            }).catch((error)=>{
                console.error(error);
                req.flash("error","Echec de l'inscription, réessayez");
                return res.redirect("/inscription");
            });
        
        }
    });
});



router.post("/connexion-moderateur",urlencodedParser,function(req,res){
    var email= req.body.email;
    var mot_de_passe = req.body.mot_de_passe;
    var crypt_password = md5(mot_de_passe);

    Moderateur.findOne({where : {email:email,mot_de_passe:crypt_password}}).then((le_moderateur)=>{
    
        if(le_moderateur){
            
            req.session.utilisateur_id = le_moderateur.id;
            req.session.utilisateur_type = le_moderateur.type;
            req.session.utilisateur_nom_complet = le_moderateur.nom_complet;
            console.log(req.session);

            if(le_moderateur.type == "moderateur"){
                return res.redirect("/espace-moderateur/tableau-de-bord");
            }else{
                return res.redirect("/se-connecter");
            }
            
        
        }else{
            req.flash("error","Identifiant ou mot de passe incorrecte");
            return res.redirect("/connexion-moderateur");
        }
    });
});


router.post("/connexion",urlencodedParser,function(req,res){
    var email= req.body.email;
    var mot_de_passe = req.body.mot_de_passe;
    var crypt_password = md5(mot_de_passe);

    const user_exist = Utilisateur.findOne({where : {email:email,mot_de_passe:crypt_password}}).then((lutilisateur)=>{
    
        if(lutilisateur){
            
            req.session.utilisateur_id = lutilisateur.id;
            req.session.utilisateur_type = lutilisateur.type;
            req.session.utilisateur_nom_complet = lutilisateur.nom_complet;
            

            if(lutilisateur.type == "porteur_de_projet"){
                return res.redirect("/espace-porteur/tableau-de-bord");
            }else{
                return res.redirect("/espace-investisseur/projets-soutenus");
            }
            
        
        }else{
            req.flash("error","Identifiant ou mot de passe incorrecte");
            return res.redirect("/se-connecter");
        }
    });
});


module.exports = router;