var express = require('express');
var router = express.Router();
var fs = require('fs');
var User = require("../models/users.js");
// https://medium.freecodecamp.org/securing-node-js-restful-apis-with-json-web-tokens-9f811a92bb52
/**
* Created by atulr on 05/07/15.
*/
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var usersService = require("../services/userService.js");
var resetmapsService = require("../services/resetmapsService.js");
var jwt = require('jsonwebtoken');
var CryptoJS = require("crypto-js");
var config = require('../services/config.js');
var PASSHASH='mypassword';

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

//https://stackoverflow.com/questions/6783921/which-mime-type-to-use-for-a-binary-file-thats-specific-to-my-program
//https://stackoverflow.com/questions/7288814/download-a-file-from-nodejs-server-using-express
//https://www.mindstick.com/Articles/1499/upload-and-download-file-in-node-js
//https://www.learn2crack.com/2017/08/node-js-server-upload-images.html
//https://www.npmjs.com/package/crypto-js

var fs = require('fs');
router.post('/upload', function(req, res) {
  var path=require('path'); // add path module
    fs.readFile(req.files.image.path, function (err, data){ // readfilr from the given path
    var dirname = path.resolve(".")+'/uploads/'; // path.resolve(“.”) get application directory path
    var newPath = dirname +   req.files.image.originalFilename; // add the file name
    fs.writeFile(newPath, data, function (err) { // write file in uploads folder
    if(err){
    res.json("Failed to upload your file");
    }else {
  res.json("Successfully uploaded your file");
}

});
});

});

router.get('/uploads/:file', function (req, res){
  var path=require('path');
    file = req.params.file;
    var dirname = path.resolve(".")+'/uploads/';
    var img = fs.readFileSync(dirname  + file);
    res.writeHead(200, {'Content-Type': 'image/jpg' });
    res.end(img, 'binary');
});



router.route("/resertmapsall").get(function(req, res){
  var token = req.headers['x-access-token'];
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

  jwt.verify(token, config.secret, function(err, decoded) {
    resetmapsService.getAllResetMap(req, res);
  });
});
router.route("/resertmap/:nserie").get(function(req, res){
  var token = req.headers['x-access-token'];
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

  jwt.verify(token, config.secret, function(err, decoded) {
    resetmapsService.getAllByNserie(req,res);
  });
});
router.route("/resertmap/:id").get(function(req, res){
  var token = req.headers['x-access-token'];
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

  jwt.verify(token, config.secret, function(err, decoded) {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });

    resetmapsService.getAllById(req,res);
  });
});
router.route("/resertmapall").post(function(req, res){
  var token = req.headers['x-access-token'];
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

  jwt.verify(token, config.secret, function(err, decoded) {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    resetmapsService.postAllResetMap(req,res);
  });
});


router.post('/register', function(req, res) {

  var bytes= CryptoJS.AES.encrypt(req.body.password.toString(), PASSHASH);
  var passHash=bytes.toString();

  User.create({
    name : req.body.name,
    email : req.body.email,
    password : passHash.toString()
  },
  function (err, user) {
    if (err) return res.status(500).send("There was a problem registering the user."+err)
    // create a token
    var token = jwt.sign({ id: user._id }, config.secret, {
      expiresIn: 86400 // expires in 24 hours
    });
    res.status(200).send({ auth: req.body.password, token: token });
  });
});

router.get('/me', function(req, res) {
  var token = req.headers['x-access-token'];
  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

  jwt.verify(token, config.secret, function(err, decoded) {
    if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });

    User.findById(decoded.id, function (err, user) {
      if (err) return res.status(500).send("There was a problem finding the user.");
      if (!user) return res.status(404).send("No user found.");

      res.status(200).send(user);
    });
  });
});

router.post('/login', function(req, res) {
  User.findOne({ email: req.body.email }, function (err, user) {
    if (err) return res.status(500).send('Error on the server.');
    if (!user) return res.status(404).send('No user found.');

    var bytes = CryptoJS.AES.decrypt(user.password, PASSHASH);
    var pass = bytes.toString(CryptoJS.enc.Utf8);

    if (!(pass===req.body.password)){
        return res.status(401).send({ auth: false, message: 'No token provided.'});
    }

    var token = jwt.sign({ id: user._id }, config.secret, {
      expiresIn: 86400 // expires in 24 hours
    });
    res.status(200).send({ auth: true, token: token });
  });
});

router.route("/users")
.get(function(req, res) {
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
