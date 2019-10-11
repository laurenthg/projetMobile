var express = require('express');
var router = express.Router();
var gestion_app = require('../services/gestion_app')

router.put('/gestion_app/updateCoordonnees/', gestion_app.updateCoordonnees);
router.post('/gestion_app/inscription/', gestion_app.inscription);
router.put('/gestion_app/desinscription/', gestion_app.desinscription);
router.get('/gestion_app/getcontact/:user_phone', gestion_app.getcontact);
router.get('/gestion_app/getInformation/:user_phone', gestion_app.getInformation);
router.put('/gestion_app/updateMDP/', gestion_app.updateMDP);
router.get('/gestion_app/Message/:numTel/:longitude/:latitude', gestion_app.getMessage);
router.post('/gestion_app/amis', gestion_app.amis)
module.exports = router
