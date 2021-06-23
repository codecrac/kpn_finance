var express = require("express");
var session = require("express-session");
var router = express.Router();

const {Projet} = require("../../models");


router.use(function(req,res,next){
    res.locals.error = req.flash("error");
    res.locals.info = req.flash("info");
    console.log(req.session);
    next();
});


const authentification_porteur = require("../../middleware_perso/authentification_utilisateur").authentification_porteur;
router.use(authentification_porteur);


router.get("/tableau-de-bord",function(req,res){
    
    var nb_projet_en_attente = '-';
    var nb_projet_en_valider = '-';
    var nb_projet_en_recaler = '-';
    var id_utilisateur = req.session.utilisateur_id;

    Projet.count({where :{'etat':'examen','id_utilisateur':id_utilisateur}}).then((result)=>{
         nb_projet_en_attente = result;
       
        Projet.count({where :{'etat':'valider','id_utilisateur':id_utilisateur}}).then((result)=>{ 
            nb_projet_en_valider = result;
            Projet.count({where :{'etat':'recaler','id_utilisateur':id_utilisateur}}).then((result)=>{ 
                nb_projet_en_recaler = result; 
                
                            res.render("espace-menbre/porteur/tableau-de-bord",{
                                nb_projet_en_attente:nb_projet_en_attente,
                                nb_projet_en_valider:nb_projet_en_valider,
                                nb_projet_en_recaler:nb_projet_en_recaler,
                            });
              });
        });
    });
    
});



router.get("/proposer-un-projet",function(req,res){
    console.log("dskldf",req.session);
    res.render("espace-menbre/porteur/proposer-un-projet");
});


router.get("/liste-des-projets/:etat",function(req,res){
    const etat = req.params.etat;
    var liste_projet = [];
    var id_utilisateur = req.session.utilisateur_id;
    console.log(etat);
    Projet.findAll({where :{'etat':etat,'id_utilisateur':id_utilisateur}}).then((result)=>{ 
        liste_projet = result;
        console.log(liste_projet);
        res.render("espace-menbre/porteur/liste-des-projets",{liste_projet:liste_projet,etat:etat});
    });
});

module.exports = router;