var express = require('express');
var router = express.Router();
var UserCtrl = require('./UserController');
var bodyParser = require('body-parser');

var VerifyToken = require('../auth/VerifyToken');
router.use(bodyParser.urlencoded({ extended: true }));


router.post('/', VerifyToken,UserCtrl.createUser);
router.get('/', VerifyToken, UserCtrl.listUser);


router.get('/:id', VerifyToken, UserCtrl.getOneUser);
router.delete('/:id',VerifyToken, UserCtrl.removeUser);
router.put('/:id',  VerifyToken, UserCtrl.updateUser);

module.exports = router;