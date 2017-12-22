var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var VerifyToken = require('./VerifyToken');

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var User = require('../user/User');

/**
 * Configure JWT
 */
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var bcrypt = require('bcryptjs');
var config = require(__root + '/config.js' ); // get config file

router.post('/login', function(req, res) {
    console.log("Start login:" + req.body.email);
    User.findOne({ email: req.body.email.trim() }, function (err, user) {
        if (err){ return res.status(500).send('Error on the server.');}
        if (!user) { 
            console.log("Wrong user");
            return res.status(200).send({ auth: false, token: null }); 
        }

        bcrypt.compare(req.body.password, user.password, function(err, valid){
            if (err){ return res.status(500).send('Error on the server.');}
            
            if(!valid){
                console.log("Wrong pass");
                return res.status(200).send({ auth: false, token: null });
            }
            else{
                var token = jwt.sign({ id: user._id }, config.secret, {
                  expiresIn: 86400 // expires in 24 hours
                });

                // return the information including token as JSON
                res.status(200).cookie('HM_ID', token, {httpOnly:true, sameSite: true}).send({ auth: true});
            }
        });
    });
});

router.get('/logout', function(req, res) {
    res.clearCookie('HM_ID');
    res.status(200).send({ auth: false, token: null });
});

router.get('/me', VerifyToken, function(req, res, next) {
    User.findById(req.userId, { password: 0 }, function (err, user) {
        if (err) return res.status(500).send("There was a problem finding the user.");
        if (!user) return res.status(404).send("No user found.");
        res.status(200).send(user);
    });

});

module.exports = router;