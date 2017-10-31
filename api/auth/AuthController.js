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

  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) return res.status(500).send('Error on the server.');
    if (!user) return res.status(404).send('No user found.');
    
    // check if the password is valid
    var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });

    // if user is found and password is valid
    // create a token
    var token = jwt.sign({ id: user._id }, config.secret, {
      expiresIn: 86400 // expires in 24 hours
    });

    // return the information including token as JSON
    res.status(200).send({ auth: true, token: token });
  });

});

router.get('/logout', function(req, res) {
  res.status(200).send({ auth: false, token: null });
});

router.post('/register', function(req, res) {

  var hashedPassword = bcrypt.hashSync(req.body.password, 8);

  //Check exist
    User.find({ 
            'name': req.body.name,
            'email':req.body.email 
        }, 
        function(err, user) {

            if (err) {

                console.log('Signup error');
                return done(err);
            }

            //if user found.
            if (user.length!=0) {
                if(user[0].name){
                    console.log('Username already exists, username: ' + req.body.name);
                    return res.status(400).send("User already exists");                         
                }
                else {
                    console.log('EMAIL already exists, email: ' + req.body.email);
                    return res.status(400).send("Email already exists");
                }                                    
                
            }
            else {
                User.create({
                    name : req.body.name,
                    email : req.body.email,
                    password : hashedPassword
                }, 
                function (err, user) {
                    if (err) return res.status(500).send("There was a problem registering the user`.");

                    // if user is registered without errors
                    // create a token
                    var token = jwt.sign({ id: user._id }, config.secret, {
                      expiresIn: 86400 // expires in 24 hours
                    });

                    res.status(200).send({ auth: true, token: token });
                });
            }
        });

});

router.get('/me', VerifyToken, function(req, res, next) {

    User.findById(req.userId, { password: 0 }, function (err, user) {
        if (err) return res.status(500).send("There was a problem finding the user.");
        if (!user) return res.status(404).send("No user found.");
        res.status(200).send(user);
    });

});

module.exports = router;