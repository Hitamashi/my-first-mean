var express = require('express');

var User = require('./User');

// CREATES A NEW USER
exports.createUser = function (req, res) {
    //Check exist
    User.find({ 'email':req.body.email}, 
        function(err, user) {
            if (err) {
                console.log('Signup error');
                return done(err);
            }

            //if user found.
            if (user.length!=0) {
                console.log('EMAIL already exists, email: ' + req.body.email);
                return res.status(400).send("Email already exists");                                             
            }
            else {
                //Create
                User.create({
                        name : req.body.name,
                        email : req.body.email,
                        password : req.body.password
                }, function (err, user) {
                    if (err) return res.status(500).send("There was a problem adding the information to the database.");
                    res.status(200).send(user);
                });
            }
        });
};

// RETURNS ALL THE USERS IN THE DATABASE
exports.listUser = function (req, res) {
    User.find({},{ password: 0 }, function (err, users) {
        if (err) return res.status(500).send("There was a problem finding the users.");
        res.status(200).send(users);
    });
};

// GETS A SINGLE USER FROM THE DATABASE
exports.getOneUser = function (req, res) {
    User.findById(req.params.id, { password: 0 }, function (err, user) {
        if (err) return res.status(500).send("There was a problem finding the user.");
        if (!user) return res.status(404).send("No user found.");
        res.status(200).send(user);
    });
};

// DELETES A USER FROM THE DATABASE
exports.removeUser = function (req, res) {
    User.findByIdAndRemove(req.params.id, function (err, user) {
        if (err) return res.status(500).send("There was a problem deleting the user.");
        res.status(200).send("User: "+ user.name +" was deleted.");
    });
};

// UPDATES A SINGLE USER IN THE DATABASE
// Added VerifyToken middleware to make sure only an authenticated user can put to this route
exports.updateUser = function (req, res) {
    req.body.modifiedDate = new Date();
    User.findByIdAndUpdate(req.params.id, req.body, {new: true}, function (err, user) {
        if (err) return res.status(500).send("There was a problem updating the user.");
        res.status(200).send(user);
    });
};