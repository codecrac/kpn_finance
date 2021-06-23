var express = require("express");
var session = require("express-session");
var router = express.Router();

const {Projet,Utilisateur,DetailsInvestissement} = require("../../models");

const authentification_moderateur = require("../../middleware_perso/authentification_utilisateur").authentification_moderateur;

router.use(function(req,res,next){
    res.locals.error = req.flash("error");
    res.locals.info = req.flash("info");
    next();
});

router.use(authentification_moderateur);
// router.get("/tableau-de-bord",async(req,res)=>{
//     const nb_projet_en_attente = await Projet.findAll();
//         if(err){console.log(err)};
//         res.render("espace-menbre/porteur/tableau-de-bord",{nb_projet_en_attente:req.nb_projet_en_attente});
// });


router.get("/tableau-de-bord",function(req,res){
    
    var nb_projet_en_attente = '-';
    var nb_projet_en_valider = '-';
    var nb_projet_en_recaler = '-';
    
    var nb_collecte_en_cours = '-';
    var nb_collecte_en_terminer = '-';
    var nb_collecte_annuler = '-';
    var id_utilisateur = req.session.utilisateur_id;

    Projet.count({where :{'etat':'examen'}}).then((result)=>{
         nb_projet_en_attente = result;
       
        Projet.count({where :{'etat':'valider'}}).then((result)=>{ 
            nb_projet_en_valider = result;
            Projet.count({where :{'etat':'recaler'}}).then((result)=>{ 
                nb_projet_en_recaler = result; 

                    Projet.count({where :{'financement':'collecte'}}).then((result)=>{ 
                        nb_collecte_en_cours = result; 
                       
                        Projet.count({where :{'financement':'terminer'}}).then((result)=>{ 
                            nb_collecte_en_terminer = result; 
                       
                            Projet.count({where :{'financement':'annuler'}}).then((result)=>{ 
                                nb_collecte_annuler = result; 
                                
                                res.render("espace-menbre/moderateur/tableau-de-bord",{
                                    nb_projet_en_attente:nb_projet_en_attente,
                                    nb_projet_en_valider:nb_projet_en_valider,
                                    nb_projet_en_recaler:nb_projet_en_recaler,

                                    nb_collecte_en_cours:nb_collecte_en_cours,
                                    nb_collecte_en_terminer:nb_collecte_en_terminer,
                                    nb_collecte_annuler:nb_collecte_annuler,
                                });    
                            }); 

                        });    
                    });
              });
        });
    });
    
});



router.get("/liste-des-projets/:etat",function(req,res){
    const etat = req.params.etat;
    var liste_projet = [];
    console.log(etat);
    Projet.findAll(
        {
            where :{'etat':etat},
            include : [
                {model : Utilisateur, required : true}
            ]
        }
        ).then((result)=>{ 
        liste_projet = result;
        // console.log(liste_projet);
        res.render("espace-menbre/moderateur/liste-des-projets",{liste_projet:liste_projet,etat:etat});
    });
});


router.get("/liste-des-collectes/:etat",function(req,res){
    const etat = req.params.etat;
    var liste_collectes = [];
    console.log(etat);
    Projet.findAll(
        {where :{'financement':etat},
        include : [
            {model : Utilisateur, required : true}
        ]
    }).then((result)=>{ 
        liste_collectes = result;
        // console.log(liste_collectes);
        res.render("espace-menbre/moderateur/liste-des-collectes",{liste_collectes:liste_collectes,etat:etat});
    });
});


router.get("/details-projet/:id_projet",async function(req,res){
    var id_projet = req.params.id_projet;
    var liste_investissement = [];

    Projet.findOne(
            {
                where : {'id':id_projet},
                include : [
                    {model : Utilisateur, required : true},
                ]
            }
        ).then((resultat_le_projet)=>{
            if(resultat_le_projet){
                le_projet = resultat_le_projet;
                // console.log("******************************8");
                // console.log(console.log(Object.keys(le_projet.__proto__)));
                    
                le_projet.getInvestissements(
                    {
                        include : [
                            {model : Utilisateur, required : true},
                            {model : DetailsInvestissement, required : true},
                        ]
                    }
                ).then(
                    (les_investissement)=>{
                        liste_investissement =  les_investissement;
                        console.log(liste_investissement[0]);
                        res.render("espace-menbre/moderateur/details_projet",{le_projet:le_projet,liste_investissement:liste_investissement});
                    }
                );
                  
            }else{
               return res.redirect('/espace-moderateur/tableau-de-bord');
            }
        }).catch((err)=>{
            console.log(err);
            res.send("err");
        });
});


module.exports = router;