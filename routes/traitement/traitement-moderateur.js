var express = require("express");
var body_parser = require("body-parser");
var router = express.Router();


const {Projet} = require("../../models");

const authentification_moderateur = require("../../middleware_perso/authentification_utilisateur").authentification_moderateur;
const { route } = require("../front/route_acceuil");
router.use(authentification_moderateur);

// var jsonParser = body_parser.json();
var urlencodedParser = body_parser.urlencoded({ extended: false })

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
            return res.redirect("/espace-porteur/proposer-un-projet");
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
                return res.redirect("/espace-porteur/proposer-un-projet");
            }).catch((error)=>{
                console.error(error);
                req.flash("error","Echec Enregistrement, réessayez");
                return res.redirect("/espace-porteur/proposer-un-projet");
            });
        
        }
});

router.post("/modifier-etat-projet",urlencodedParser,function(req,res){
    var etat_projet = req.body.etat_projet;
    var etat_financement = req.body.etat_financement;
    var id_projet = req.body.id_projet;

    Projet.findOne({where : {id:id_projet}}).then((le_projet)=>{
    
        console.log(le_projet);
        if(le_projet){
            console.log(le_projet);
            le_projet.etat = etat_projet;
            le_projet.financement = etat_financement;
            le_projet.save().then(()=>{
                req.flash("info","Mise a jour reussie.");
                return res.redirect("/espace-moderateur/details-projet/"+id_projet);
            }).catch(()=>{
                req.flash("error","Echec Mise a jour.");
                return res.redirect("/espace-moderateur/details-projet/"+id_projet); 
            });
            
        }else{
            req.flash("error","Projet indisponible.");
            return res.redirect("/espace-moderateur/tableau-de-bord");
        }
    });
});

module.exports = router;