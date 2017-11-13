var express = require('express');
var path = require('path');

var File = require('./File');

exports.demoDownload = function(req, res) {
    console.log("Into download");
    res.download(path.join(__root,'upload', 'demo.txt'),'demo.txt', function(err){
        if(err){
            res.status(500).send("Cannot download the demo file");
        }
        else{
            console.log("File downloaded!");
        }
    });
}

// CREATES A NEW USER
exports.createFile = function (req, res) {
    //Check exist
    File.create({
        name : req.body.name
    }, 
    function (err, file) {
        if (err) 
            return res.status(500).send("There was a problem adding the information to the database.");
        else {
            //res.status(200).send("File uploaded");
            User.findByIdAndUpdate(file.id, {path: path.join(__dirname, "upload", file.id.toString()) }, function (err, user) {
                if (err) return res.status(500).send("There was a problem updating the user.");
                res.status(200).send(file);
            });
        }
    });
};

// GETS A SINGLE USER FROM THE DATABASE
exports.getOneFile = function (req, res) {
    User.findById(req.params.id,{path:0}, function (err, file) {
        if (err) return res.status(500).send("There was a problem finding the user.");
        if (!file) return res.status(404).send("No file found.");
            res.status(200).send(file);
    });
};

// DELETES A USER FROM THE DATABASE
exports.removeFile = function (req, res) {
    User.findByIdAndRemove(req.params.id, function (err, file) {
        if (err) return res.status(500).send("There was a problem deleting the user.");
        res.status(200).send("File: "+ file.name +" was deleted.");
    });
};

// UPDATES A SINGLE USER IN THE DATABASE
// Added VerifyToken middleware to make sure only an authenticated user can put to this route
exports.updateFile = function (req, res) {
    req.body.modifiedDate = new Date();
    User.findByIdAndUpdate(req.params.id, req.body, {new: true}, function (err, user) {
        if (err) return res.status(500).send("There was a problem updating the user.");
        res.status(200).send(user);
    });
};