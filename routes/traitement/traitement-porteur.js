var express = require("express");
var body_parser = require("body-parser");
var router = express.Router();

//image
var multer = require("multer");
var crypto = require("crypto");
var path = require("path");



const {Projet} = require("../../models");

const authentification_porteur = require("../../middleware_perso/authentification_utilisateur").authentification_porteur;
router.use(authentification_porteur);

// var jsonParser = body_parser.json();
var urlencodedParser = body_parser.urlencoded({ extended: false })


var storage = multer.diskStorage({
    destination : "uploads/images",
    filename : function(req, file,cb){
        crypto.pseudoRandomBytes(16,function(err,raw){
            cb(null,raw.toString('hex') + Date.now() + path.extname(file.originalname) )
        });
    }
})

var upload = multer({storage : storage});
router.post("/enregistrer-projet",upload.single('image_illustration'),urlencodedParser,function(req,res){


    var utilisateur_id = req.session.utilisateur_id;
    var type_retour = req.body.type_retour;
    var titre = req.body.titre;
    var description = req.body.description;
    var montant_objectif = req.body.montant_objectif;
    var pitch = req.body.pitch;
    pitch = pitch.replace("watch?v=","embed/");
    var fichier_presentation= req.body.fichier_presentation;
    
    //image 

    if(req.file){
        var image_illustration = req.file.path;
        image_illustration = image_illustration.replace(/\\/g,"/");
    }else{
        var image_illustration = null;
    }

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
                image_illustration : image_illustration,
            }).then(function(){
                // req.flash("info","Enregistrement Effectué.");
                return res.redirect("/espace-porteur/tableau-de-bord");
                // return res.redirect("/espace-porteur/proposer-un-projet");
            }).catch((error)=>{
                console.error(error);
                // req.flash("error","Echec Enregistrement, réessayez");
                return res.redirect("/espace-porteur/tableau-de-bord");
            });
        
        }
});

module.exports = router;