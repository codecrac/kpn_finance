///verifier utilisateur est un porteur de projet
var authentification_porteur = function(req, res, next)
{
   //append request and session to use directly in views and avoid passing around needless stuff
    res.locals.request = req;

    console.log(req.session.utilisateur);
    if(req.session != null && req.session.utilisateur_id != undefined && req.session.utilisateur_nom_complet != undefined && req.session.utilisateur_type != undefined)
    {
        if(req.session.utilisateur_type =="porteur_de_projet"){
            res.locals.utilisateur_id = req.session.utilisateur_id;
            res.locals.utilisateur_nom_complet = req.session.utilisateur_nom_complet;
            res.locals.utilisateur_type = req.session.utilisateur_type;
            next();
        }else{
            console.log("utilisateur pas porteur de projet");
            res.redirect("/se-connecter");
        }
        
    }else{
        console.log("utilisateur pas present en session");
        res.redirect("/se-connecter");
    }
};

///verifier utilisateur est un investisseur
var authentification_investisseur = function(req, res, next)
{
   //append request and session to use directly in views and avoid passing around needless stuff
    res.locals.request = req;

    if(req.session != null && req.session.utilisateur_id != undefined && req.session.utilisateur_nom_complet != undefined && req.session.utilisateur_type != undefined)
    {
        if(req.session.utilisateur_type =="investisseur"){
            res.locals.utilisateur_id = req.session.utilisateur_id;
            res.locals.utilisateur_nom_complet = req.session.utilisateur_nom_complet;
            res.locals.utilisateur_type = req.session.utilisateur_type;
            next();
        }else{
            console.log("utilisateur pas investisseur");
            req.flash("error","Un compte investisseur est requis");
            res.redirect("/se-connecter");
        }
        
    }else{
        console.log("utilisateur pas present en session");
        res.redirect("/se-connecter");
    }

};

///verifier utilisateur est un moderateur
var authentification_moderateur = function(req, res, next)
{
   //append request and session to use directly in views and avoid passing around needless stuff
    res.locals.request = req;

    if(req.session != null && req.session.utilisateur_id != undefined && req.session.utilisateur_nom_complet != undefined && req.session.utilisateur_type != undefined)
    {
        if(req.session.utilisateur_type =="moderateur"){
            res.locals.utilisateur_id = req.session.utilisateur_id;
            res.locals.utilisateur_nom_complet = req.session.utilisateur_nom_complet;
            res.locals.utilisateur_type = req.session.utilisateur_type;
            next();
        }else{
            console.log("utilisateur pas moderateur");
            res.redirect("/se-connecter");
        }
        
    }else{
        console.log("utilisateur pas present en session");
        res.redirect("/connexion-moderateur");
    }

};

module.exports = {authentification_porteur:authentification_porteur, authentification_investisseur:authentification_investisseur,authentification_moderateur:authentification_moderateur};