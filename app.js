//importation node
var express = require("express");
var path = require("path");
const {Sequelize} = require("sequelize");
const session = require("express-session");
const flash = require("connect-flash");

//nos importations
// const {Utilisateur} = require("./models");
// var routes_acceuil = require(".\routes\front\route_acceuil.js")(router);

var app = express();

app.set("port", process.env.PORT || 3000);


//LES NOTIFS
app.use(session(
    { cookie: { maxAge: 60000 *60 * 24 }, 
        secret: 'un*truc-de.malade',
        resave: false, 
        saveUninitialized: false
    }
)
);

app.set("views",path.join(__dirname,"/views"));
app.set("view engine","ejs");


app.use(flash());

//STOKAGE

app.use("/uploads",express.static(path.resolve(__dirname,'uploads')));

//LES ROUTES
app.use(express.static(__dirname + '/assets')); //pours les assets
app.use('/',require("./routes/front/route_acceuil.js"));
app.use('/espace-porteur',require("./routes/front/espace_porteur.js"));
app.use('/espace-investisseur',require("./routes/front/espace_investisseur.js"));
app.use('/espace-moderateur',require("./routes/front/espace_moderateur.js"));

app.use('/traitement',require("./routes/traitement/traitement-acceuil.js"));
app.use('/traitement-porteur',require("./routes/traitement/traitement-porteur.js"));
app.use('/traitement-investisseur',require("./routes/traitement/traitement-investisseur.js"));
app.use('/traitement-moderateur',require("./routes/traitement/traitement-moderateur.js"));


//connexion a la base de donnee

const db = require("./models")

db.sequelize.sync({alter:true}).then((req)=>{
    console.log("connexion a la bd reussie");

    //lancer le serveur
    app.listen(app.get("port"), function(){
        console.log("Server lancer sur le port "+ app.get("port"));
    });    
});

