var express = require('express');
var path = require('path');
var formidable = require('formidable');
var fs = require('fs');
var mv = require('mv');

var File = require('./File');

var uploadDir = path.join(__root,'upload');

//Demo download
exports.demoDownload = function(req, res) {
    console.log("Into download");
    res.download(path.join(uploadDir, 'demo.txt'),'demo.txt', function(err){
        if(err){
            res.status(500).send("Cannot download the demo file");
        }
        else{
            console.log("File downloaded!");
        }
    });
};

//Upload
exports.uploadFile = function(req, res) {
    var form = new formidable.IncomingForm();

    form.multiples= false;

    form.parse(req, function (err, fields, files) {
        if(err) {
            console.log(err);
            return res.status(500).send("Cannot upload file");
        }

        console.log(files);
        var myfile = files["file[0]"];

        //Update in DB
        File.create({name : myfile.name, path: uploadDir, type: myfile.type},
        function (err, file) {
            if (err) 
                return res.status(500).send("There was a problem adding the information to the database.");
            else {
                //Move file from tmp to uploads                
                mv(myfile.path, file.fullPath, function (err) {
                    if (err) {
                        console.log(err);
                        return res.status(500).send("Cannot upload file");
                    }
                    res.status(200).send({status:"Success", file: file});
                });
            }
        });
    });
};

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
            File.findByIdAndUpdate(file.id, {path: path.join(__dirname, "upload", file.id.toString()) }, function (err, user) {
                if (err) return res.status(500).send("There was a problem updating the user.");
                res.status(200).send(file);
            });
        }
    });
};

//DOWNLOAD A FILE
exports.downloadFile = function(req,res){
    File.findById(req.params.id, function (err, file) {
        if (err) return res.status(500).send("There was a problem finding the file.");
        if (!file) return res.status(404).send("No file found.");
        
        res.download(file.fullPath, file.name, function(err){
            if(err){
                console.log(err);
                res.status(500).send("Cannot download file: ");
            }
            else{
                console.log("File downloaded: '" + file.name + "' with id " + file.id);
            }
        });
    });
};

//LIST ALL FILES
exports.getListFile = function(req,res) {
    File.find({}, function (err, files) {
        if (err) return res.status(500).send("There was a problem finding the files.");
        res.status(200).send(files);
    });
};

// GETS A SINGLE USER FROM THE DATABASE
exports.getOneFile = function (req, res) {
    File.findById(req.params.id,{path:0}, function (err, file) {
        if (err) return res.status(500).send("There was a problem finding the file.");
        if (!file) return res.status(404).send("No file found.");
            res.status(200).send(file);
    });
};

// DELETES A USER FROM THE DATABASE
exports.removeFile = function (req, res) {
    File.findByIdAndRemove(req.params.id, function (err, file) {
        if (err) return res.status(500).send("There was a problem deleting the file.");
        res.status(200).send("File: "+ file.name +" was deleted.");
    });
};

// UPDATES A SINGLE USER IN THE DATABASE
// Added VerifyToken middleware to make sure only an authenticated user can put to this route
exports.updateFile = function (req, res) {
    req.body.modifiedDate = new Date();
    File.findByIdAndUpdate(req.params.id, req.body, {new: true}, function (err, file) {
        if (err) return res.status(500).send("There was a problem updating the user.");
        res.status(200).send(user);
    });
};