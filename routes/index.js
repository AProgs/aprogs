var express = require('express');
var router = express.Router();


/**
 * Created by atulr on 05/07/15.
 */
var express = require('express');
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var usersService = require("../services/userService.js");

var router = express.Router();

// GET /users – Return all Users from MongoDB
// POST /users – Add new user in MongoDB
// GET /users/:id – Return User with matched ID
// PUT /users/:id – Update users information
// DELETE /users/:id – Delete particular user
/* GET home page. */
router.get('/', function(req, res, next) {
    res.send('index :D');
});

router.route("/users")
    .get(function(req, res) {


  //   var readline = require('linebyline'),
  //   rl = readline(__dirname+'/BMW.TXT');
  //  rl.on('line', function(line, lineCount, byteCount) {
   //
  //     console.log(line.split('|'));
  //  }).on('error', function(e) {
  //        console.log(e);
  //  })

  let Parser = require('text2json').Parser
  let rawdata = __dirname+'/BMW.TXT';

  let parse = new Parser({hasHeader : true,separator : '|',encoding : 'ascii'})

  parse.text2json (rawdata, (err, data) => {
    if (err) {
      console.error (err)
    } else {
      var strjson = JSON.stringify(data).replace(/ "/g, '"');
      var strjson = strjson.replace(/" /g, '"');
      var strjson = strjson.replace(/] \[/g, '][');
      console.log(strjson);
    }
  })





        usersService.getUsers(req, res);
    })
    .post(function(req, res) {
        usersService.postUsers(req, res);
    });

router.route("/users/:id")
    .get(function(req, res) {
        usersService.getUsersById(req, res);
    })
    .put(function(req, res) {
        usersService.putUser(req, res);
    })
    .delete(function(req, res) {
        usersService.deleteUser(req, res)
    });

    module.exports = router;
