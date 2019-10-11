var db = require('../db/pg_gestion_app.js')

var longitude;
var latitude;

// Fonction permettant la gestion d'inscription
// Une requête de création dans la table utilisateur de
// la base de données est envoie dans le cas échéant
function inscription(req, res){
  var numTel = req.body.user_phone//TODO dépend du html
  var nom = req.body.user_pseudo //TODO dépend du html
  var mdp = req.body.user_mdp
  var mdp_again = req.body.user_mdp_again
  console.log("ok");
  if(mdp != mdp_again){
      res.status(500).send("Meme mot de passe");
  }
  var coordonnee = null;
  db.createUser(numTel, nom, mdp, coordonnee, function(error){
      if(error == null){
    res.status(200).send("ok");
    }
    else {
        res.status(500).send("Erreur inscription impossible");
    }
  })
}

// Fonction permettant la gestion de desinscription
// Une requête permmettant d'enlever la tuple correspondante
// dans la base de donnée est envoyer
function desinscription(req,res){
  var numTel = req.body.user_phone //TODO dépend du html
  db.deleteUser(numTel, function(){
    res.status(200).send("ok");
  })
}

// Fonction permmettant la mise à jour des coordonnées géographiques
// dans la base de données
function updateCoordonnees(req, res){
  var numTel = req.body.user_phone
  var longitude = req.body.longitude
  var latitude = req.body.latitude
  db.updateCoordonnees(numTel, longitude, latitude, function(){
    res.status(200).send("ok");
  })
}

// Fonction permmettant la récupération des nuémros des contacts de
// l'utilisateur
function getcontact(req, res){
    var numTel = req.params.user_phone
    db.getContact(numTel, function(error, data){
        if(error == null){
          res.status(200).send(data);
        }
        else {
            console.log(error);
             res.status(500).send(error);
        }
    })
}

// Fonction permettant la récupération des données (nom et mot de passe) lié
// à un utilisateur
function getInformation(req, res){
    var numTel = req.params.user_phone
    db.getInformation(numTel, function(error, data){
        if(error == null){
          console.log(data);
          res.status(200).json({
              nom : data.nom,
              mdp : data.mdp,
              numTel : numTel
          });
        }
        else {
            console.log(error);
             res.status(500).send(error);
        }
    })
}

// Fonction permettant de modier le mot de passe d'un Utilisateur
function updateMDP(req, res){
    var newMDP = req.body.nouveau_mdp
    var numTel = req.body.user_phone
    db.updateMDP(numTel, newMDP, function(error){
    if(error == null){
  res.status(200).send("ok");
  }
  else {
      res.status(500).send("Erreur inscription impossible");
    }
    })
}


function getMessage(req, res){
    var numTel = req.params.numTel;
    var longitude = req.params.longitude;
    var latitude = req.params.latitude;
    var messages = [];
    console.log("test")
    db.getDestinataireTemps(numTel,function(error, data){
        if(error == null){
            data.forEach(function(message){
                if(message.duree < 3600){
                    console.log("test2");
                    var longi = parseFloat(longitude);
                    var lati = parseFloat(latitude);
                    var longi2 = parseFloat(message.longitude);
                    var lati2 = parseFloat(message.latitude);
                    console.log("longitude du receveur" +longi);
                    console.log("lati du receveur" +lati);
                    console.log(longi2);
                    console.log(lati2);
                    var dist = distance(longi, longi2, lati, lati2);
                    console.log("la distance est : " + dist);
                    if(dist < 100){ //TODO: pas sur de la distance
                        db.getInformation(message.numero, function(error, data1 ){

                                console.log(data1.nom);
                                var messageEnvoie = {
                                    "titre" : message.titre,
                                    "corps" : message.corps,
                                    "numTel" : message.numero,
                                    "nom" : data1.nom,
                                    "date" : message.dates
                                }
                                console.log(messageEnvoie);
                                messages.push(messageEnvoie);

                        })
                    }
                }
            })
            db.deleteMessage(numTel, function(error){
                console.log(error);
                console.log(messages);
                res.status(200).send(messages);
            })


        }
        else {
            res.status(500).send(error);
        }
    })

}


function sendMessage(sockets, messageEnvoie, clients){

            db.getContact(messageEnvoie.numTel, function(error,data1){
                if(error==null){
                    data1.forEach(function(contact){
                        clients.forEach(function(client){
                            if(client.numTel == contact.numcontact){
                                db.getCoordonnee(contact.numcontact, function(error, data2){
                                    if(error==null){
                                        var longi = parseFloat(messageEnvoie.longitude);
                                        var lati = parseFloat(messageEnvoie.latitude);
                                        var longi2 = parseFloat(data2.longitude);
                                        var lati2 = parseFloat(data2.latitude);
                                        console.log(longi);
                                        console.log(lati);
                                        console.log(longi2);
                                        console.log(lati2);
                                        var dist = distance(longi, longi2, lati, lati2);
                                        console.log("la distance est : " + dist);
                                        if(dist < 100){ //TODO: pas sur de la distance
                                            sockets.connected[client.socketid].emit("messageRecu", messageEnvoie);
                                        }
                                    }
                            })
                            }
                            else {
                                //console.log("le numero de tel de celui qui envoie" + messageEnvoie.numTel);
                                db.createMessage(messageEnvoie.numTel, contact.numcontact, messageEnvoie.titre, messageEnvoie.corps, messageEnvoie.longitude, messageEnvoie.latitude , function(error){
                                    console.log(error);
                                })
                            }
                        })
                    })
                }
            })

}


// Fonction permmettant de créer un lien de contact entre deux numéro
// dans la base de données
function amis(req, res){
    db.getListUtilisateur(function(error, data){
        if(error ==null){
            data.forEach(function(user){

                    if(user.numero == req.body.numTelContact){
                        db.createContact(req.body.numTel, req.body.numTelContact, function(error){
                            console.log(error);
                        })
                    }

            })
            res.status(200).send("ok");
        }
        else {
            res.status(500).send("connexion au utilisateur impossible");
        }
    })
}

// Fonction permettant le calcul de la distance entre deux coordonnées géographique en km
function distance (longi1, longi2, lati1, lati2){
    rad = function(x){
        return x*Math.PI/180;
    }
    var rayon = 6378.137;
    var distLati = rad(lati2 - lati1);
    var distLongi = rad(longi2 - longi1);
    var a = Math.sin(distLati/2) * Math.sin(distLati/2) + Math.cos(rad(lati1)) * Math.cos(rad(lati2)) * Math.sin(distLongi/2) * Math.sin(distLongi/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = rayon * c;
    return d;
}

module.exports = {
    inscription,
    desinscription,
    updateCoordonnees,
    getcontact,
    getInformation,
    updateMDP,
    getMessage,
    amis,
    sendMessage,
    distance
}
