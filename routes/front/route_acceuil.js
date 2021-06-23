var express = require("express");
var md5 = require("md5");
var router = express.Router();
const {Projet,Moderateur,Investissement} = require("../../models");

router.use(function(req,res,next){
    res.locals.error = req.flash("error");
    res.locals.info = req.flash("info");
    next();
});

router.get("/",async function(req,res){
    
    var connecter = null;
    if(req.session.utilisateur_id){
         connecter = req.session.utilisateur_type;
    }
    res.locals.connecter = connecter;

    var les_collecte_en_cours = [];
    Projet.findAll({where : {'financement':'collecte'}}).then((result)=>{
        les_collecte_en_cours = result;
        res.render("home/index",{les_projets:les_collecte_en_cours});
    }).catch((err)=>{
        res.send(err);
    });

});

router.get("/details-projet/:id_projet",async function(req,res){
    var id_projet = req.params.id_projet;
    var is_preview = false;

    if(req.query.apercu_porteur != undefined){
        is_preview = true;
    }

    var connecter = null;
    if(req.session.utilisateur_id){
         connecter = req.session.utilisateur_type;
    }
    res.locals.connecter = connecter;
    var montant_investit = 0;
    if(req.session.utilisateur_id){
        var id_utilisateur = req.session.utilisateur_id;
        console.log("**ID UTILISATEUR");
        console.log(id_utilisateur);
        var investissement_utilisateur = await Investissement.findOne({ where : { "id_utilisateur" : id_utilisateur } });
        console.log(investissement_utilisateur);
        if(investissement_utilisateur != null){
            montant_investit = investissement_utilisateur.montant_investit;
        }
        
    }

    Projet.findOne({where : {'id':id_projet}}).then((result)=>{
        // console.log(result.investissement);
        if(result){
            le_projet = result;
            res.render("home/details_projet",{le_projet:le_projet,montant_investit_par_utilisateur_actuel : montant_investit,is_preview:is_preview});
        }else{
           return res.redirect('/');
        }
        
    });
});

router.get("/se-connecter",function(req,res){
    req.session.destroy();
    res.render("home/connexion");
});

router.get("/connexion-moderateur",function(req,res){
    
    Moderateur.findOne().then((result)=>{
        
        if(result){
            console.log(result);
            req.session.destroy();
            res.render("espace-menbre/moderateur/connexion");
        }else{
           var nouveau_moderateur = new Moderateur();
            nouveau_moderateur.nom_complet = "moderateur";
            nouveau_moderateur.email = "kpnfinance@gmail.com";
            nouveau_moderateur.telephone = "-";
           
            var mot_de_passe = "kpnfinance@gmail.com";
            var crypt_password = md5(mot_de_passe);
            nouveau_moderateur.mot_de_passe = crypt_password;

           if(nouveau_moderateur.save()){
                res.render("espace-menbre/moderateur/connexion");
           }else{
               console.log("redirection moderateur")
               res.redirect("/");
           };
        }
        
    });
    
});


router.get("/inscription",function(req,res){
    res.render("home/inscription");
});


module.exports = router;