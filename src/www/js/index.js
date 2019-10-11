/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

/**
  application
  */
var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {

        //attente du chargement de l'application
        this.receivedEvent('deviceready');

        // Button retour arrière
        function onBackKeyDown(e) {
            $("#connexion").css("display", "none");
            $("#inscription").css("display", "none");
            $("#compose").css("display", "none");
            $("#reception").css("display", "none");
            $("#configuration").css("display", "none");
            $("#profile").css("display", "none");
            $("#accueil").css("display", "block");
            if (socket != null) {
            socket.close();
            }
            socket = null;
            e.preventDefault();
        }
        $(document).bind("backbutton",onBackKeyDown);




        // Variables
        //var url="http://130.190.105.52:8080";
        var url="http://129.88.240.65:8080";
        var nom;
        var numTel;
        var longitude;
        var latitude;
        var listContact = [];
        var socket = null;


        // chargement de la page de chargement
        $("#chargement").toggle();


        // chargement de la page accueil
        $("#accueil").css("display", "block");


        // Demande d'accès à la page d'inscription sur click du button
        // "inscription_accueil"
        $(document).on('click','#inscription_accueil', function(){
          $("#connexion").css("display", "none");
          $("#accueil").css("display", "none");
          $("#inscription").css("display", "block");
        })


        // Demande d'inscription après remplissage du formulaire
        // sur click de button "button_inscription"
        // requête POST
        $(document).on('click', "#button_inscription", function(e){
            alert($("#form_inscription").serialize());
               $.ajax({
                 url : url+'/api/gestion_app/inscription',
                 datatype: 'json',
                 type: 'post',
                 content: 'application/x-www-form-urlencoded',
                 data: $("#form_inscription").serializeArray(),
                 success : function(){
                     alert("Votre compte a bien été crée");
                     $("#connexion").css("display", "none");
                     $("#inscription").css("display", "none");
                     $("#compose").css("display", "none");
                     $("#reception").css("display", "none");
                     $("#configuration").css("display", "none");
                     $("#profile").css("display", "none");
                     $("#accueil").css("display", "block");
                 },
                 error : function(){
                     alert("Le compte existe déjà");
                 }
             });
               e.preventDefault();
        })


        // Demande d'accès à la page de connexion sur click
        // du button connexion_accueil
        $(document).on('click','#connexion_accueil', function(){
            $("#accueil").css("display", "none");
            $("#inscription").css("display", "none");
            $("#connexion").css("display", "block");
        })


        // Demande de connexion sur click du button
        // "connexionprofil" après remplissage des champs nécessaires
        // une requête get est réalisé
        $(document).on('click', "#connexionprofil", function(e){
            numTel = $("#form_connexion").serializeArray()[0].value;
            $.get(url+"/api/gestion_app/getInformation/" + numTel,"", verifierMDP, "json").fail(function(jqXHR, textStatus, errorThrown){
                alert("connexion impossible");
            }); // inclue une vérification du mot de passe

            e.preventDefault();
             //récupération de donnée géographique
        })


        // Aller à l'onglet Profile
        $(document).on('click', "#Pprofile", function(){
            $("#compose").css("display", "none");
            $("#reception").css("display", "none");
            $("#configuration").css("display", "none");
            $("#profile").css("display", "block");
            MAJmap(); //récupération de donnée géographique
        })

        // Aller à l'onglet reception
        $(document).on('click', "#Preception", function(){
            $("#compose").css("display", "none");
            $("#configuration").css("display", "none");
            $("#profile").css("display", "none");
            $("#reception").css("display", "block");
            MAJmap(); //récupération de donnée géographique
        })

        // Aller à l'onglet compose
        $(document).on('click', "#Pcompose", function(){
            $("#reception").css("display", "none");
            $("#configuration").css("display", "none");
            $("#profile").css("display", "none");
            $("#compose").css("display", "block");
            MAJmap(); //récupération de donnée géographique
        })


        // Aller à l'onglet configuration
        $(document).on('click', "#Pconfiguration", function(){
            $("#compose").css("display", "none");
            $("#reception").css("display", "none");
            $("#profile").css("display", "none");
            $("#configuration").css("display", "block");
            MAJmap(); //récupération de donnée géographique
        })

        // Fonction permettant de vérifier le mot de passe lors de la connexion
        function verifierMDP(value, statut){

            // Si le mot de passe est valide
            if ($("#form_connexion").serializeArray()[1].value == value.mdp){

                $("#accueil").css("display", "none");
                $("#inscription").css("display", "none");
                $("#connexion").css("display", "none");
                $("#profile").css("display", "block");
                nom = value.nom;
                var str = "Pseudo : " + nom;
                $("#Profile_pseudo").text(str);
                var num = "Téléphone : " + numTel;
                $("#Profile_tel").text(num);
                MAJmap();
                navigator.contacts.find(fields, onSuccessContacts, onErrorContacts, options);
                $.get(url+"/api/gestion_app/Message/" + numTel+"/"+longitude+"/"+latitude,"", afficherMessage, "json").fail(function(){
                    alert("impossibilité d'avoir les messages");
                })
                listContact.forEach(function(contact){
                    $.ajax({
                      url : url + '/api/gestion_app/amis/',
                      datatype: 'text',
                      type: 'post',
                      content: 'application/x-www-form-urlencoded',
                      data: "numTel="+contact.numTel+"&numTelContact="+contact.numTelContact,
                      error : function(){
                          alert("ajout d'ami impossible");
                      }
                    })
                })

                connexionSocket(); // Connexion avec une socket
            }
            else {
                alert("mauvais mot de passe");
            }
        }

        // Fonction permettant d'afficher les nouveaux message dans l'onglet réception
        function afficherMessage(data, statut){
            $.each(data, function(index, value){
                //var li = "<li class =  <a class='navigate-right'> <div class='media-body'>" + value.titre + "<p>" + value.message "</p>  </div> </a> </li>"
                //$("#message").prepend("<li class='table-view-cell media'> <a class='navigate-right'> <div class='media-body'>" + value.titre + "<p>" + value.corps + "</p>  </div> </a> </li>");
                $("#message").prepend("<li class='table-view-cell media'> <a class='navigate-right' <div class='media-body'>" + value.titre +    "<p>" + value.corps + "<br /> <br/>" + value.nom +   "<br />" +  value.date +"</p>  </div> </a> </li>");
            })
        }

        // Fonction permettant de vérifier le mot de passe lors du changement de celui-ci
        function verifierMDPchangement(value, statut){
          // alert($("#form_changement").serializeArray()[3].value);
          // alert(value.mdp);
          // alert($("#form_changement").serializeArray()[1].value);
          // alert($("#form_changement").serializeArray()[1].value == value.mdp);
            if ($("#form_changement").serializeArray()[1].value == value.mdp){
                alert("dans le if");
                $.ajax({
                  url : url + '/api/gestion_app/updateMDP/',
                  datatype: 'json',
                  type: 'put',
                  content: 'application/x-www-form-urlencoded',
                  data: $("#form_changement").serializeArray(),
                  success : function(){
                      alert("Votre mot de passe a bien été changé");
                  },
                  error : function(){
                      alert("Changement de mot de passe impossible");
                  }
                })
            }
            else {
                alert("mauvais mot de passe");
            }
        }


        // Demande de changement de mot de passe
        $(document).on("click", "#changemdp",function(e){
            e.preventDefault();
            if($("#form_changement").serializeArray()[2].value == $("#form_changement").serializeArray()[3].value){
                $.get(url+"/api/gestion_app/getInformation/" + numTel,"", verifierMDPchangement, "json").fail(function(){
                    alert("connexion impossible");
                })
            }
            else {
                alert("les deux mots de passe ne correspondent pas");
            }
            e.preventDefault();
        })


        // Fonction permettant d'établir la connexion en socket
        function connexionSocket(){
            alert("ok");
            socket = io(url);
            alert("connect");
            socket.emit("connexion", numTel);
            socket.on("messageRecu", function(messageRecu){
                alert("j'ai recu");
                alert(messageRecu.titre);
                    $("#message").prepend("<li class='table-view-cell media'> <a class='navigate-right'>  <div class='media-body'>" + messageRecu.titre +   "<p>" + messageRecu.corps +  "<br />  <br/>"  + messageRecu.nom+   "<br />" +  messageRecu.date +"</p>  </div> </a> </li>");

            });
        }


        // Demande d'envoie de message
        $(document).on("click", "#envoie_message", function(e){
            e.preventDefault();
            var date = new Date();
            var titre = $("#form_envoie").serializeArray()[0].value;
            var corps = $("#form_envoie").serializeArray()[1].value;
            var messageEnvoie = {
                "longitude" : longitude,
                "latitude" : latitude,
                "titre" : titre,
                "corps" : corps,
                "numTel" : numTel,
                "nom" : nom,
                "date" : date

            };
            //$("#message").prepend("<li class='table-view-cell media'> <a class='navigate-right'> <div class='media-body'>" + messageEnvoie.titre + "<p>" + messageEnvoie.corps + "</p>  </div> </a> </li>");
            $("#message").prepend("<li class='table-view-cell media'> <a class='navigate-right'> <div class='media-body'>" + messageEnvoie.titre  + "<p>" + messageEnvoie.corps  + "<br />  <br/>"  +  messageEnvoie.nom+   "<br />" +  messageEnvoie.date  +"</p>  </div> </a> </li>");
            socket.emit("messageEnvoie", messageEnvoie);
        })



        /** ----------- Récupération des contact -----------*/

        // Fonction permettant la récupération des numéros des contacts de l'utilisateur
        function onSuccessContacts(contacts) {
          alert('Found ' + contacts.length + ' contacts.');
          for (var i = 0; i < contacts.length; i++) {
              for(var j = 0; j < contacts[i].phoneNumbers.length; j++) {
                  // Le numéro de téléphone comporte des - ( ) ...
                  var phoneNumber = parseInt(contacts[i].phoneNumbers[j].value.match(/\d+/g).join(''), 10); // garder que les nombres, base 10
                  var contact = {
                      numTel : numTel,
                      numTelContact : phoneNumber};
                   listContact.push(contact);
              }
          }
          // alert(listContact);
        };

        // Callback en cas d'erreur
        function onErrorContacts(contactError) {
            alert('onError!');
        };

        // find all contacts
        var options      = new ContactFindOptions();
        options.filter   = "";
        options.multiple = true;
        options.desiredFields = [navigator.contacts.fieldType.phoneNumbers];
        options.hasPhoneNumber = true;
        var fields       = [navigator.contacts.fieldType.phoneNumbers];
        //navigator.contacts.find(fields, onSuccessContacts, onErrorContacts, options);
        /** --------------------------------------------*/



        // Fonction permmettant la mis-a-jour des coordonées géographique
        function updateCoordonnees(){
            var coordonnee = {
                "longitude" : longitude,
                "latitude" : latitude
            }
            // alert(JSON.stringfy(coordonnee));
            var datta = "user_phone="+numTel+"&longitude="+longitude+"&latitude="+latitude;
            $.ajax({
              url : url + '/api/gestion_app/updateCoordonnees/',
              datatype: 'text',
              type: 'put',
              content: 'application/x-www-form-urlencoded',
              data: datta,
              error : function(){
                  alert("j'aifail");
              }
            })
        }


        // Fonction permettant la récupération des coordonnées géographiques
        var adresse = undefined;
        function MAJmap(adresse){

          // Callback en cas de succès
          var onSuccess = function(position){
            var div= document.getElementById("map_canvas");
            // Ajout des données géographiques dans l'onglet profile
            div.innerHTML = 'Latitude: '  + position.coords.latitude      + '<br />' +
                                        'Longitude: ' + position.coords.longitude     + '<br />';

            longitude = position.coords.longitude;
            latitude = position.coords.latitude;
            updateCoordonnees();
          }

          /* Callback qui est retournée en cas d'erreur
          notamment sur la réception de données de localisation
          */
          var onError = function(error){
            alert('code: '    + error.code    + '\n' +
                  'message: ' + error.message + '\n');
          };
          navigator.geolocation.getCurrentPosition(onSuccess,onError,{enableHighAccuracy: true});
        };
},

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.initialize();
