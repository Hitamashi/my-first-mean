var express = require('express');
var router = express.Router();
var TicketCtrl = require('./TicketController');
var bodyParser = require('body-parser');

var VerifyToken = require('../auth/VerifyToken');
router.use(bodyParser.urlencoded({ extended: true }));

router.post('/getHistory',VerifyToken, TicketCtrl.getHistory);

router.post('/finish',VerifyToken, TicketCtrl.finishTicket);
router.post('/updateFollow',VerifyToken, TicketCtrl.updateFollow);

router.post('/acceptContract',VerifyToken, TicketCtrl.acceptContract);
router.post('/denyContract',VerifyToken, TicketCtrl.denyContract);
router.post('/updateContract',VerifyToken, TicketCtrl.updateContract);
router.post('/newContract',VerifyToken, TicketCtrl.createContract);

router.post('/acceptProgram',VerifyToken, TicketCtrl.acceptProgram);
router.post('/newEstimation',VerifyToken, TicketCtrl.createEstimation);

router.post('/denyInfo',VerifyToken, TicketCtrl.denyInfo);
router.post('/newInfo',VerifyToken, TicketCtrl.createInfo);
router.post('/denyProgram',VerifyToken, TicketCtrl.denyProgram);

router.post('/newProgram',VerifyToken, TicketCtrl.createProgram);
router.post('/newRequest',VerifyToken, TicketCtrl.createRequest);
router.post('/denyRequest',VerifyToken, TicketCtrl.denyRequest);

router.post('/cancelTicket',VerifyToken, TicketCtrl.cancelTicket);
router.post('/create',VerifyToken, TicketCtrl.createTicket);
router.get('/',VerifyToken, TicketCtrl.getListTicket);
router.get('/:id',VerifyToken, TicketCtrl.getOneTicket);
router.post('/:id',VerifyToken, TicketCtrl.updateTicket);
router.delete('/:id',VerifyToken, TicketCtrl.removeTicket);

module.exports = router;