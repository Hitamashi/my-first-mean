var express = require('express');
var router = express.Router();
var FileCtrl = require('./FileController');
var bodyParser = require('body-parser');

var VerifyToken = require('../auth/VerifyToken');
router.use(bodyParser.urlencoded({ extended: true }));

//router.post('/', VerifyToken,FileCtrl.createFile);

//router.get('/:id', VerifyToken, FileCtrl.getOneFile);
//router.delete('/:id',VerifyToken, FileCtrl.removeFile);
//router.put('/:id',  VerifyToken, FileCtrl.updateFile);

router.get('/download/demo', FileCtrl.demoDownload);
router.get('/', FileCtrl.getListFile);
router.get('/download/:id', FileCtrl.downloadFile);
router.post('/upload', FileCtrl.uploadFile);

module.exports = router;