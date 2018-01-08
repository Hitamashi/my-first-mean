var express = require('express');
var path = require('path');
var fs = require('fs');

var FileCrtl = require('../file/FileController');
var Ticket = require('./Ticket');
var Request = require('./Request');
var Program = require('./Program');
var Info = require('./Info');
var Contract = require('./Contract');
var Estimation = require('./Estimation');
var Follow = require('./Follow');

var TicketStatus = require('./TicketStatus');

// CREATES A NEW USER
exports.createTicket = function (req, res) {
    //Check exist
    Ticket.create({
        status : 0,
        createdDate: new Date(),
    }, 
    function (err, ticket) {
        if (err) 
            return res.status(500).send("There was a problem adding the information to the database.");
        else {
            res.status(200).send(ticket);
        }
    });
};

// GETS A SINGLE TICKET
exports.getOneTicket = function (req, res) {
    Ticket.findById(req.params.id)
    .populate({path: 'request', populate:{path: 'salesman'}})
    .populate({path: 'program', populate:{path: 'programFile operator'}})
    .populate({path: 'info', populate:{path: 'salesman'}})
    .populate({path: 'estimation', populate:{path: 'estimationFile operator'}})
    .populate({path: 'contract', populate:{path: 'contractFile admin accountant'}})
    .populate({path: 'follow', populate:{path: 'accountant'}})
    .populate('status')
    .exec(function (err, ticket) {
        if (err) {
            console.log(err);
            return res.status(500).send("There was a problem finding the ticket.");
        }
        if (!ticket) return res.status(404).send("No ticket found.");
            res.status(200).send(ticket);
    });
};

//GETS LIST ALL TICKET
exports.getListTicket = function (req, res) {
    Ticket.find({},null,{sort:"-createdDate"})
    .populate('request')
    .populate('program')
    .populate('info')
    .populate('estimation')
    .populate('contract')
    .populate('follow')
    .populate('status')
    .exec(function (err, ticket) {
        if (err) return res.status(500).send("There was a problem finding the ticket.");
        if (!ticket) return res.status(404).send("No ticket found.");
            res.status(200).send(ticket);
    });
};


// DELETES A TICKET
exports.removeTicket = function (req, res) {
    Ticket.findByIdAndRemove(req.params.id, function (err, ticket) {
        if (err) return res.status(500).send("There was a problem deleting the ticket.");
        res.status(200).send({"_id": ticket._id, "message":"Ticket was deleted."});
    });
};

// UPDATES A SINGLE TICKET
exports.updateTicket = function (req, res) {
    req.body.modifiedDate = new Date();
    Ticket.findByIdAndUpdate(req.params.id, req.body, {new: true}, function (err, ticket) {
        if (err) return res.status(500).send("There was a problem updating the user.");
        res.status(200).send(ticket);
    });
};

//CREATE REQUEST
exports.createRequest = function(req,res){
    req.body.createdDate = new Date();
    Request.create(req.body, 
    function (err, request) {
        if (err) {
            console.log(err);
            return res.status(500).send("There was a problem adding the information to the database.");
        }
        else {
            var _ticket = {status: 1, request: request._id, modifiedDate: new Date()};
            Ticket.findByIdAndUpdate(req.body.ticket, _ticket, function(err,ticket){
                if(err){
                    console(err);
                    res.status(500).send("Error update request");
                }
                else
                    res.status(200).send(request);
            });
        }
    });
};

//DENY A REQUEST
exports.denyRequest = function(req,res){
    var _ticket = {status: 0, request: null, modifiedDate: new Date()};
    Ticket.findByIdAndUpdate(req.body.ticket, _ticket, function(err,ticket){
        if(err){
            console(err);
            res.status(500).send("Error update ticket");
        }
        else{
            Request.findByIdAndUpdate(ticket.request, {denyReason: req.body.reason}, function(err,ticket){
                if(err)
                    res.status(500).send("Error update request");           
                else    
                res.status(200).send(ticket);
            });
        }
    });
};

//CREATE PROGRAM
exports.createProgram = function(req,res){
    req.body.createdDate = new Date();
    Program.create(req.body, 
    function (err, program) {
        if (err) {
            console.log(err);
            return res.status(500).send("There was a problem adding the information to the database.");
        }
        else {
            var _ticket = {status: 2, program: program._id, modifiedDate: new Date()};
            Ticket.findByIdAndUpdate(req.body.ticket, _ticket, function(err,ticket){
                if(err){
                    console(err);
                    res.status(500).send("Error update request");
                }
                else
                    res.status(200).send(program);
            });
        }
    });
};

//DENY A PROGRAM
exports.denyProgram = function(req,res){
    var _ticket = {status: 1, program: null, estimation: null, info: null,  modifiedDate: new Date()};
    Ticket.findByIdAndUpdate(req.body.ticket, _ticket, function(err,ticket){
        if(err){
            console(err);
            res.status(500).send("Error update ticket");
        }
        else{
            Program.findByIdAndUpdate(ticket.program, {denyReason: req.body.reason}, function(err,program){
                if(err)
                    res.status(500).send("Error update request");           
                else    
                res.status(200).send(ticket);
            });
        }
    });
};

//CREATE INFO
exports.createInfo = function(req,res){
    req.body.createdDate = new Date();
    console.log(req.body);
    Info.create(req.body, 
    function (err, info) {
        if (err) {
            console.log(err);
            return res.status(500).send("There was a problem adding the information to the database.");
        }
        else {
            var _ticket = {status: 3, info: info._id, modifiedDate: new Date()};
            Ticket.findByIdAndUpdate(req.body.ticket, _ticket, function(err,ticket){
                if(err){
                    console(err);
                    res.status(500).send("Error update request");
                }
                else
                    res.status(200).send(info);
            });
        }
    });
};

//DENY A INFO
exports.denyInfo = function(req,res){
    var _ticket = {status: 2, estimation: null, info: null,  modifiedDate: new Date()};
    Ticket.findByIdAndUpdate(req.body.ticket, _ticket, function(err,ticket){
        if(err){
            console(err);
            res.status(500).send("Error update ticket");
        }
        else{
            Info.findByIdAndUpdate(ticket.info, {denyReason: req.body.reason}, function(err,info){
                if(err)
                    res.status(500).send("Error update request");           
                else    
                res.status(200).send(ticket);
            });
        }
    });
};

//CREATE ESTIMATION
exports.createEstimation = function(req,res){
    req.body.createdDate = new Date();
    Estimation.create(req.body, 
    function (err, est) {
        if (err) {
            console.log(err);
            return res.status(500).send("There was a problem adding the information to the database.");
        }
        else {
            var _ticket = {status: 4, estimation: est._id, modifiedDate: new Date()};
            Ticket.findByIdAndUpdate(req.body.ticket, _ticket, function(err,ticket){
                if(err){
                    console(err);
                    res.status(500).send("Error update request");
                }
                else
                    res.status(200).send(est);
            });
        }
    });
};

//ACCEPT PROGRAM
exports.acceptProgram = function(req,res){
    var _ticket = {status: 5};
    //console.log()
    Ticket.findByIdAndUpdate(req.body.ticket, _ticket, function(err,ticket){
        if(err){
            console(err);
            res.status(500).send("Error update request");
        }
        else
            res.status(200).send(ticket);
    });
};

//CREATE CONTRACT
exports.createContract = function(req,res){
    req.body.createdDate = new Date();
    Contract.create(req.body, 
    function (err, cont) {
        if (err) {
            console.log(err);
            return res.status(500).send("There was a problem adding the information to the database.");
        }
        else {
            var _ticket = {status: 6, contract: cont._id, modifiedDate: new Date()};
            Ticket.findByIdAndUpdate(req.body.ticket, _ticket, function(err,ticket){
                if(err){
                    console(err);
                    res.status(500).send("Error update request");
                }
                else
                    res.status(200).send(cont);
            });
        }
    });
};

//UPDATE CONTRACT
exports.updateContract = function(req,res){
    req.body.modifiedDate = new Date();
    //var contractId = req.body._id;
    //delete req.body._id;
    console.log(req.body);
    Contract.findByIdAndUpdate(req.body._id, req.body, function (err, cont) {
        if (err) {
            console.log(err);
            return res.status(500).send("There was a problem adding the information to the database.");
        }
        else {
            var _ticket = {modifiedDate: new Date()};

            if(req.body.status == 'ACCEPTED'){
                _ticket.status = 7;
            }
            else if(req.body.status == 'REJECTED'){
                _ticket.status = 5;
                _ticket.contract = null;
            }

            Ticket.findByIdAndUpdate(req.body.ticket, _ticket, function(err,ticket){
                if(err){
                    console(err);
                    res.status(500).send("Error update request");
                }
                else{
                    res.status(200).send(cont);
                }
            });
        }
    });
};

//DENY CONTRACT
exports.denyContract = function(req,res){
    var _ticket = {status: 5, contract: null, modifiedDate: new Date()};
    Ticket.findByIdAndUpdate(req.body.ticket, _ticket, function(err,ticket){
        if(err){
            console(err);
            res.status(500).send("Error update ticket");
        }
        else{
            Contract.findByIdAndUpdate(ticket.contract, {denyReason: req.body.reason}, function(err,cont){
                if(err)
                    res.status(500).send("Error update request");           
                else    
                    res.status(200).send({"status": "ok"});
            });
        }
    });
};

//ACCEPT CONTRACT
exports.acceptContract = function(req,res){
    var _follow = { 
        ticket: req.body.ticket, 
        createdDate: new Date(), 
        modifiedDate: new Date(), 
        contractNumber: req.body.contractNumber
    };

    Follow.create(_follow,function(err, follow){
        if(err){
            console(err);
            res.status(500).send("Error update ticket");
        }
        else{
            var _ticket = {status: 8, modifiedDate: new Date(), follow: follow._id};
            Ticket.findByIdAndUpdate(req.body.ticket, _ticket, function(err,ticket){
                if(err){
                    console(err);
                    res.status(500).send("Error update ticket");
                }
                else{
                    res.status(200).send(ticket);
                }
            });
            
        }
    });
};

//UPDATE FOLLOW
exports.updateFollow = function(req,res){
    req.body.modifiedDate = new Date();
    //var contractId = req.body._id;
    //delete req.body._id;
    console.log(req.body);
    Follow.findByIdAndUpdate(req.body._id, req.body, function (err, follow) {
        if (err) {
            console.log(err);
            return res.status(500).send("There was a problem adding the information to the database.");
        }
        else {
            var _ticket = {modifiedDate: new Date()};
            Ticket.findByIdAndUpdate(req.body.ticket, _ticket, function(err,ticket){
                if(err){
                    console(err);
                    res.status(500).send("Error update request");
                }
                else{
                    res.status(200).send(follow);
                }
            });
        }
    });
};

//UPDATE FOLLOW
exports.finishTicket = function(req,res){
    var _ticket = {status: 9, modifiedDate: new Date(), finishDate: new Date()};
    Ticket.findByIdAndUpdate(req.body.ticket, _ticket, function(err,ticket){
        if(err){
            console(err);
            res.status(500).send("Error update ticket");
        }
        else{
            res.status(200).send(ticket);
        }
    });
};

exports.getModel = function(type){
    switch(type){
        case 'request':
            return Request;
        case 'program':
            return Program;
        case 'estimation':
            return Estimation;
        case 'info':
            return Info;
        case 'contract':
            return Contract;
        default:
            return null;
    }
};

//GET HISTORY
exports.getHistory = function(req,res){
    var typeModel = exports.getModel(req.body.type);
    var ticketId = req.body.ticket;

    console.log(typeModel);
    console.log(ticketId);
    if(!typeModel || !ticketId){
        res.status(400).send("Missing parameters");
    }

    typeModel.find({ticket: ticketId},null, {sort: 'createdDate'})
    .populate('salesman')
    .populate('admin')
    .populate('accountant')
    .populate('operator')
    .exec( function(err,items){
        if(err){
            console(err);
            res.status(500).send("Error update ticket");
        }
        else{
            res.status(200).send(items);
        }
    });
};