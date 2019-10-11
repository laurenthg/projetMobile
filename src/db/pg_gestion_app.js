var pgp = require('pg-promise')()
var dbconfig = require('./settings.js').settings

var db = pgp(dbconfig)

// Requête SQL permettant la création d'un utilisateur dans la table d'utilisateur
function createUser(numTel, nom, mdp, coord, callback)
{
  var requete = `insert into Utilisateur values (${numTel}, '${nom}'
  , '${mdp}')`
  console.log(requete);
  db.none(requete, null).then(function(data){
    callback(null);
  }).catch(function(error){
    console.log(error);
    callback(error);
  })
}

// Requête SQL permettant la création d'un message dans la table de message
function createMessage(numero, destinataire, titre, corps, longitude, latitude, callback)
{
  var requete = `insert into Message values (${numero}, ${destinataire} , current_timestamp(0), '${titre}','${corps}','POINT(${longitude} ${latitude})' ) `
  console.log(requete);
  db.none(requete, null).then(function(data){
    callback(null);
  }).catch(function(error){
    console.log(error);
    callback(error);
  })
}


// Requête SQL permettant la suppression d'un compte utilisateur
function deleteUser(numTel, callback){
  var requete = `delete from Utilisateur where numero = ${numTel}`
  console.log(requete);
  db.none(requete, null).then(function(data){
    callback();
  }).catch(function(error){
    console.log(error);
  })
}

// Requête SQL permettant la suppression des messages sur un destinataire
function deleteMessage(destinataire, callback){
  var requete = `delete from Message where destinataire = ${destinataire}`
  console.log(requete);
  db.none(requete, null).then(function(data){
    callback();
  }).catch(function(error){
    console.log(error);
  })
}


// Requête SQL permettant de mettre à jour les coordonées  géographique
// d'un utilisateur
function updateCoordonnees(numTel, longitude,latitude, callback){
  var requete = `update Utilisateur set coordonne = 'POINT(${longitude} ${latitude})' where numero = ${numTel}`
  console.log(requete);
  db.none(requete, null).then(function(data){
    callback();
  }).catch(function(error){
    console.log(error);
  })
}


// Requête SQL permettant la création d'un lien de contact entre deux numéros
function createContact(user_phone, contact, callback){
  var requete = `insert into Contact values (${user_phone}, ${contact})`
  console.log(requete);
  db.none(requete, null).then(function(data){
    callback();
  }).catch(function(error){
    console.log(error);
  })
}


// Requête SQL permmettant de modifer le mot de passe d'un utilisateur
function updateMDP(numTel, newMDP, callback){
  var requete = `update Utilisateur set mdp= '${newMDP}' where numero = ${numTel}`
  console.log(requete);
  db.none(requete, null).then(function(data){
    callback();
  }).catch(function(error){
    console.log(error);
  })
}


// Requête SQL permettant la réception des informations liés à un utilisateur
function getInformation(user_phone, callback){
    var requete =`select nom, mdp from Utilisateur where numero = ${user_phone}`
    console.log(requete);
    db.one(requete, null).then(function (data)  {
        console.log(data);
        callback(null, data);
}).catch(function(error)  {
            callback(error, null)
})
}


// Requête SQL permettant d'obtenir la liste des informations liés aux messages
function getListMessage(callback){
  var requete =`select numero, dates, Titre, Corps, ST_X(geographique), ST_Y(geographique) from message ORDER BY dates`
  console.log(requete);
  db.one(requete, null).then(function (data)  {
          callback(null, data);
}).catch(function(error)  {
          callback(error, null)
})
}

// Requête SQL permettant la réception des données géographiques lié à un utilisateur
function getCoordonnee(user_phone, callback){
  var requete =`select ST_X(coordonne) as longitude, ST_Y(coordonne) as latitude from Utilisateur where numero = ${user_phone}`
  console.log(requete);
  db.one(requete, null).then(function (data)  {
      console.log("success get coordonnee " + data);
          callback(null, data);
})
      .catch(function(error)  {
          console.log("error get cordonnee" + error);
          callback(error, null);
})
}

// Requête SQL permettant d'obtenir les numéros de contacts d'un utilisateur
function getContact(user_phone, callback){
  var requete =`select numContact from Contact where client = ${user_phone}`
  console.log(requete);
  db.any(requete, null).then(function (data)  {
    console.log("get contact " + data.numContact);
          callback(null, data);
})
      .catch(function(error)  {
          console.log("error contact :" + error)
          callback(error, null)
})
}

// Requête SQL permettant d'obtenir la distance entre deux utilisateurs
function getDistance(user_phone, contact, callback){
  var requete =`select ST_DISTANCE( U1.coordonne, U2.coordonne) FROM Utilisateur U1, Utilisateur U2 WHERE U1.numero=${user_phone} AND U2.numero=${contact}`
  console.log(requete);
  db.any(requete, null).then(function (data)  {
          callback(null, data);
})
      .catch(function(error)  {
          callback(error, null)
})
}

// Requête SQL permettant d'obtenir la distance entre un utilisateur et une message
function getDistanceMess(user_phone, contact,date, callback){
  var requete =`select ST_DISTANCE( U1.coordonne, M.geographique) as distance FROM Utilisateur U1, Message M WHERE U1.numero=${user_phone} AND M.numero=${contact} AND M.dates = ${date}`
  console.log(requete);
  db.any(requete, null).then(function (data)  {
          callback(null, data);
})
      .catch(function(error)  {
          callback(error, null)
})
}

// Requête SQL d'obtenir la liste des messages ayant user_phone_dest comme
// destinataire avec le temps écoulé en seconde
function getDestinataireTemps(user_phone_dest, callback){
  var requete =`SELECT M2.numero as numero, M2.dates as dates, M2.Titre as titre, M2.Corps as corps, ST_X(M2.geographique) as longitude, ST_Y(M2.geographique) as latitude, ((DATE_PART('day', current_timestamp(0) - M2.dates ) * 24 + DATE_PART('hour', current_timestamp(0) - M2.dates)) * 60 + DATE_PART('minute', current_timestamp - M2.dates )) * 60 + DATE_PART('second', current_timestamp(0) - M2.dates) AS duree FROM Message M2 WHERE M2.destinataire = ${user_phone_dest}`
  console.log(requete);
  db.any(requete, null).then(function (data)  {
          callback(null, data);
})
      .catch(function(error)  {
          console.log(error);
          callback(error, null)
})
}

// Requête SQL d'obtenir la liste des nuéro des utilisateurs
function getListUtilisateur(callback){
  var requete =`SELECT numero FROM Utilisateur`
  console.log(requete);
  db.any(requete, null).then(function (data)  {
          callback(null, data);
})
      .catch(function(error)  {
          callback(error, null)
})
}


// exportation des fonctions
module.exports = {
  updateCoordonnees,
  getCoordonnee,
  deleteUser,
  deleteMessage,
  createUser,
  getContact,
  updateMDP,
  getListMessage,
  getInformation,
  createContact,
  getDistance,
  getDistanceMess,
  createMessage,
  getDestinataireTemps,
  getListUtilisateur
};
