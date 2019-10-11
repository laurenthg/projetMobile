var express = require('express');
var path = require('path');
var app = express();// creation du serveur
var server = require('http').createServer(app)
var bodyParser = require('body-parser')  // envoie des paramètres en POST
var io = require('socket.io')(server, {
    pingTimeout : 30000,
     upgradeTimeout: 30000
});
var gestion_app_router = require('../routes/gestion_app_ctrl')
var gestion_app_services = require('../services/gestion_app') //permettra de faire les websockets
var mustacheExpress = require('mustache-express');

app.use(bodyParser.urlencoded({     // pour gérer les URL-encoded bodies (envoie formulaire en POST)
  extended: true
}));

app.use('/api/', gestion_app_router);

app.get('/test',function(req, res){
  res.send('test');
})




var clients = [];

// Gestion des sockets
io.on('connect', function (socket){
  console.log("Start conversion");
    socket.on('connexion', function(connexion){

        var connexion = {"socketid" : socket.id, "numTel" : connexion}
        console.log(socket.id);

        clients.push(connexion);
        //socket.clients = clients;
    });
    socket.on('messageEnvoie', function(messageEnvoie){

      console.log(messageEnvoie);
        gestion_app_services.sendMessage(io.sockets, messageEnvoie, clients);
    })
    socket.on('disconnect', function(){
        for (var i = 0; i< clients.lenght; i++){
            if(socket.id == clients[i].socketid){
                clients.splice(i,1);
                break;
            }
        }
        console.log("Stop conversation");
    })
})



var ip = server.listen(8080); // démarrage du serveur sur le port 8080
console.log(ip);
console.log("Serveur démarré sur le port 8080");
