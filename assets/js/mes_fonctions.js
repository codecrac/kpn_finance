
function toggle_garde_fou(id){
    var ref = 'garde_fou_'+id;
    var le_garde_fou = document.getElementById(ref);
    if(le_garde_fou.style.display != 'none'){
        le_garde_fou.style.display = 'none';
    }else{
        le_garde_fou.style.display = 'block';
    }
}

function  fermer_tous_les_garde_fou(class_a_fermer){
    class_a_fermer = (typeof class_a_fermer === 'undefined') ? 'garde_fou' : class_a_fermer;
    var les_garde_fous = document.getElementsByClassName(class_a_fermer);
    for(var i=0;i<les_garde_fous.length;i++){
        les_garde_fous[i].style.display='none';
    }
}

function  changer_localisation_client(){
    if( $("#localisation_client").val()=="interieur" ){
        $("#localisation_interieur").css('display','block');
        $("#localisation_interieur").attr('required','required');
    }else{
        $("#localisation_interieur").css('display','none');
        $("#localisation_interieur").removeAttr('required');
    }
}

function  changer_section(id_section){
    // fermer_tous_les_garde_fou('section');
    $('.section').css('display','none');
    $('#'+id_section).show(200);
    $('.option').removeClass('btn btn-dark');
    $('.'+id_section).toggleClass('btn btn-dark');
}


function addNewRow(id){
    var la_ligne = document.getElementById("la_ligne_"+id);
    // alert(la_ligne);
    var le_corps_de_la_table = document.getElementById("le_corps_de_la_table_"+id);
    var le_clone = la_ligne.cloneNode(true);
    le_clone.id ="";
    le_corps_de_la_table.appendChild(le_clone);

}

function removeLastRow(id){
    var le_corps_de_la_table = document.getElementById("le_corps_de_la_table_"+id);
    var rowCount = le_corps_de_la_table.rows.length;
    if(rowCount>1){
        le_corps_de_la_table.deleteRow(rowCount -1);
    }
}


//=======================SPECIALE FACTURE
function addNewRow_facture(){
    var la_ligne = document.getElementById("la_ligne_facture");
    // alert(la_ligne);
    var le_corps_de_la_table = document.getElementById("le_corps_de_la_table_facture");
    var le_clone = la_ligne.cloneNode(true);
    le_clone.id ="";
    le_corps_de_la_table.appendChild(le_clone);

    var quantite_pour_facture = document.getElementsByClassName('quantite_pour_facture');
    var prix_unitaire = document.getElementsByClassName('prix_unitaire');
    var prix_total = document.getElementsByClassName('prix_total');

    var id = prix_unitaire.length -1;
    // alert(quantite_pour_facture);
    prix_unitaire[id].id="prix_unitaire_"+id;
    quantite_pour_facture[id].id="quantite_pour_facture_"+id;
    prix_total[id].id="prix_total_"+id;

    prix_unitaire[id].onkeyup = function (){ calcul_prix_total_ditem(id) };
    prix_unitaire[id].onchange = function (){ calcul_prix_total_ditem(id) };
    quantite_pour_facture[id].onkeyup = function (){ calcul_prix_total_ditem(id) };
    quantite_pour_facture[id].onchange = function (){ calcul_prix_total_ditem(id) };
}
function removeLastRow_facture(){
    var le_corps_de_la_table = document.getElementById("le_corps_de_la_table_facture");
    var rowCount = le_corps_de_la_table.rows.length;
    if(rowCount>1){
        le_corps_de_la_table.deleteRow(rowCount -1);
    }
}

function calcul_prix_total_ditem(id){

    var qte = document.getElementById("quantite_pour_facture_"+id);
    var prix_unitaire = document.getElementById("prix_unitaire_"+id);
    var prix_total = document.getElementById("prix_total_"+id);

    /*var q =qte.value;
    var p =prix_unitaire.value;
    var t = q*p ;
    alert(""+q+"*"+p+"="+t);
    alert(qte.value);*/
    var total = prix_unitaire.value*qte.value;
    prix_total.value =total;
    calcul_grand_total();
}

function calcul_grand_total(){
    var prix_total = document.getElementsByClassName("prix_total");
    var grand_total_input = document.getElementById("grand_total_input");

    var grand_total =0;
    for (var i=0;i<prix_total.length;i++){
        grand_total += prix_total[i].value * 1;
    }
    grand_total_input.value = grand_total;
    ajout_de_main_doeuvre();
}

function ajout_de_main_doeuvre(){
    var grand_total_input = document.getElementById("grand_total_input");
    var main_doeuvre_input = document.getElementById("main_doeuvre");
    var reste_a_payer_input = document.getElementById("reste_a_payer");

    var reste_a_payer = grand_total_input.value * 1 + main_doeuvre_input.value *1;
    if(reste_a_payer<0){ reste_a_payer=0;}
    reste_a_payer_input.value = reste_a_payer;
}
//===========FIN============SPECIALE FACTURE
