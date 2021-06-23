var express = require("express");
var body_parser = require("body-parser");
var router = express.Router();


const {Projet,Investissement,DetailsInvestissement} = require("../../models");

const authentification_investisseur = require("../../middleware_perso/authentification_utilisateur").authentification_investisseur;
router.use(authentification_investisseur);

// var jsonParser = body_parser.json();
var urlencodedParser = body_parser.urlencoded({ extended: false })




router.post("/investir",urlencodedParser,function(req,res){
    var id_investisseur= req.session.utilisateur_id;
    var id_projet= req.body.id_projet;
    var montant = req.body.montant_investissement;
    var aucun_probleme = false;

    Projet.findOne({where : {id:id_projet}}).then((projet_choisis)=>{
    
        if(projet_choisis){
            Investissement.findOne({
                where : {
                    id_utilisateur : id_investisseur,
                    id_projet : id_projet,
                }
            }).then((Investissement_existant)=>{
                //on a un investissement existant
                    if(Investissement_existant){
                        var date = new Date();
                        var date_et_heure = date.toLocaleDateString() + " à " + date.getUTCHours() + "H" + date.getUTCMinutes();
                        DetailsInvestissement.create({
                            "id_investissement" : Investissement_existant.id,
                            "montant" : montant,
                            "date" : date_et_heure,
                        }).then((result)=>{
                            var total_investissement = parseInt(Investissement_existant.montant_investit) + parseInt(montant);                        
                            Investissement_existant.montant_investit = total_investissement;
                            if(Investissement_existant.save()){
                                  //mettre a jour montant collecte dans projet
                                    const ancienne_collecte = parseInt(projet_choisis.montant_collecter);
                                    const nouvelle_collecte = parseInt(montant) + ancienne_collecte;
                                    projet_choisis.montant_collecter = nouvelle_collecte;

                                    projet_choisis.save().then(()=>{
                                        req.flash("info","Investissement reussi, merci d'avoir choisis notre plateforme. ");
                                        return res.redirect("/espace-investisseur/projets-soutenus");
                                    }).catch((error)=>{
                                        req.flash("error","Un probleme est survenus." + error.message);
                                        return res.redirect("/se-connecter");
                                    });
                            }else{
                                req.flash("error","Un probleme est survenus." + error.message);
                                return res.redirect("/details-projet/"+id_projet);
                            };
                          }).catch((error)=>{
                            req.flash("error","Un probleme est survenus." + error.message);
                            return res.redirect("/se-connecter");
                        });;
                    
                    }else{//pas d'investissement
                      
                        //enreistrer le premier l'ivestissement
                        Investissement.create({
                            "id_utilisateur" : id_investisseur,
                            "id_projet" : id_projet,
                            "montant_investit" : montant,
                        }).then((investissement)=>{

                            //mettre ajour detail investissement
                            var date = new Date();
                            var date_et_heure = date.toLocaleDateString()  + " à " + date.getUTCHours() + "H" + date.getUTCMinutes();
                            DetailsInvestissement.create({
                                "id_investissement" : investissement.id,
                                "montant" : montant,
                                "date" : date_et_heure,
                            }).then((result)=>{
                                  //mettre a jour montant collecte dans projet
                                  const ancienne_collecte = parseInt(projet_choisis.montant_collecter);
                                  const nouvelle_collecte = parseInt(montant) + ancienne_collecte;
                                  projet_choisis.montant_collecter = nouvelle_collecte;

                                  projet_choisis.save().then(()=>{
                                      req.flash("info","Investissement reussi, merci d'avoir choisis notre plateforme. ");
                                      return res.redirect("/espace-investisseur/projets-soutenus");
                                  }).catch((error)=>{
                                      req.flash("error","Un probleme est survenus." + error.message);
                                      return res.redirect("/se-connecter");
                                  });
                            }).catch((error)=>{
                                req.flash("error","Un probleme est survenus." + error.message);
                                return res.redirect("/se-connecter");
                            });
                            
                        }).catch((error)=>{
                            req.flash("error","Un probleme est survenus." + error.message);
                            return res.redirect("/se-connecter");
                        });
                    }
            }).catch((error)=>{
                req.flash("error",error.message);
                return res.redirect("/details-projet/"+id_projet);
            });
        
        }else{
            req.flash("error","Identifiant ou mot de passe incorrecte");
            return res.redirect("/se-connecter");
        }
    
    });
});



//un investisseur peut soummettre un projet
router.post("/enregistrer-projet",urlencodedParser,function(req,res){

    var utilisateur_id = req.session.utilisateur_id;
    var type_retour = req.body.type_retour;
    var titre = req.body.titre;
    var description = req.body.description;
    var montant_objectif = req.body.montant_objectif;
    var pitch = req.body.pitch;
    var fichier_presentation= req.body.fichier_presentation;

        if(titre=='' || description==''){
            req.flash("error","Le titre et la description sont obligatoire.");
            return res.redirect("/espace-investisseur/proposer-un-projet");
        }else{
            Projet.create({
                id_utilisateur : utilisateur_id,
                type_retour : type_retour,
                titre : titre,
                description : description,
                montant_objectif : montant_objectif,
                lien_pitch : pitch,
                fichier_presentation : fichier_presentation,
                etat : 'examen',
            }).then(function(){
                req.flash("info","Enregistrement Effectué.");
                return res.redirect("/espace-investisseur/proposer-un-projet");
            }).catch((error)=>{
                console.error(error);
                req.flash("error","Echec Enregistrement, réessayez");
                return res.redirect("/espace-investisseur/proposer-un-projet");
            });
        
        }
});

module.exports = router;
