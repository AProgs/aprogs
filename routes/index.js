  var express = require('express');
  var router = express.Router();
  var fs = require('fs');

  /**
  * Created by atulr on 05/07/15.
  */
  var express = require('express');
  var bodyParser = require("body-parser");
  var mongoose = require("mongoose");
  var usersService = require("../services/userService.js");
  var resetmapsService = require("../services/resetmapsService.js");

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

  router.route("/resertmapsall").get(function(req, res){
    resetmapsService.getAllResetMap(req, res);
  });
  router.route("/resertmap/:nserie").get(function(req, res){
    resetmapsService.getAllByNserie(req,res);
  });
  router.route("/resertmap/:id").get(function(req, res){
    resetmapsService.getAllById(req,res);
  });
  router.route("/resertmapall").post(function(req, res){
    resetmapsService.postAllResetMap(req,res);
  });


  router.route("/users")
  .get(function(req, res) {

    let Parser = require('text2json').Parser

    var files1=getFiles(__dirname+'/AIRBAG52817/airbag1');
    var files2=getFiles(__dirname+'/AIRBAG52817/airbag2');
     files1.push.apply(files1,files2);
    //let rawdata = __dirname+'/BMW.TXT';

    for(var file in files1) {
      let rawdata = files1[file];

      //let rawdata = __dirname+'/BMW.TXT';
      let parse = new Parser({hasHeader : true,separator : '|',encoding : 'ascii'})
      parse.text2json (rawdata, (err, data) => {
        if (err) {
          console.error (err)
        } else {
          var strjson = JSON.stringify(data).replace(/ "/g, '"');
          strjson = strjson.replace(/" /g, '"');
          strjson = strjson.replace(/] \[/g, '][');
          strjson = strjson.replace(/(?:\\[rn]|[\r\n]+)+/g, "");
          //strjson = strjson.substring(1, strjson.length - 1);
          console.log(strjson);

          console.log(rawdata);

        }

      })
    }

    //console.log(files1);

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

  function getFiles (dir, files_){
    files_ = files_ || [];
    var files = fs.readdirSync(dir);
    for (var i in files){
      var name = dir + '/' + files[i];
      if (fs.statSync(name).isDirectory()){
        getFiles(name, files_);
      } else {
        files_.push(name);
      }
    }
    return files_;
  }

  module.exports = router;
