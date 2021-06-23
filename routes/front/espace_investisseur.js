var express = require("express");
var router = express.Router();

const {Projet,Investissement} = require("../../models");


const authentification_investisseur = require("../../middleware_perso/authentification_utilisateur").authentification_investisseur;


router.use(function(req,res,next){
    res.locals.error = req.flash("error");
    res.locals.info = req.flash("info");
    next();
});

router.use(authentification_investisseur);

router.use(function(req,res,next){
    res.locals.error = req.flash("error");
    res.locals.info = req.flash("info");
    next();
});

router.get("/projets-soutenus",async function(req,res){
    id_utilisateur = req.session.utilisateur_id;
    var les_investissement = await Investissement.findAll({
        where : {"id_utilisateur": id_utilisateur },
        include: [
            { model: Projet, required: true}
         ],
    });
    
    res.render("espace-menbre/investisseur/projets-soutenus",{
        les_investissement:les_investissement
    });

});



router.get("/proposer-un-projet",function(req,res){
    res.locals.error = req.flash("error");
    res.locals.info = req.flash("info");
    res.render("espace-menbre/investisseur/proposer-un-projet");
});

router.get("/liste-des-projets",function(req,res){
    console.log(req.session.utilisateur_id);
    var id_utilisateur = req.session.utilisateur_id;
    var liste_projet = [];
    Projet.findAll({where : {"id_utilisateur":id_utilisateur}}).then((result)=>{ 
        liste_projet = result;
        console.log(liste_projet);
        res.render("espace-menbre/investisseur/liste-des-projets",{liste_projet:liste_projet});
    });
});

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
                  nb_finance_annuler = result;
                            res.render("espace-menbre/investisseur/tableau-de-bord",{
                                nb_projet_en_attente:nb_projet_en_attente,
                                nb_projet_en_valider:nb_projet_en_valider,
                                nb_projet_en_recaler:nb_projet_en_recaler,
                            });                    

            });
        });
    });
    
});



router.get("/proposer-un-projet",function(req,res){
    res.locals.error = req.flash("error");
    res.locals.info = req.flash("info");
    res.render("espace-menbre/porteur/proposer-un-projet");
});


router.get("/liste-des-projets/:etat",function(req,res){
    const etat = req.params.etat;
    var liste_projet = [];
    console.log(etat);
    Projet.findAll({where :{'etat':etat}}).then((result)=>{ 
        liste_projet = result;
        console.log(liste_projet);
        res.render("espace-menbre/porteur/liste-des-projets",{liste_projet:liste_projet,etat:etat});
    });
});

module.exports = router;