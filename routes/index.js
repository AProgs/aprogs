var express = require('express');
var router = express.Router();
var fs = require('fs');
var User = require("../models/users.js");
const BinaryFile = require('binary-file');


var multer = require('multer');
var upload = multer({dest: './upload/'});


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

router.route("/resertmapsall").get(function(req, res){
//  var token = req.headers['x-access-token'];
//  if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

//  jwt.verify(token, config.secret, function(err, decoded) {
    resetmapsService.getAllResetMap(req, res);
//  });
});
router.get('/crashing', function(req, res, next) {

  var str = "[2F 3F AA][00 05 EE]";
  str = str.substring(1, str.length-1);
  var arr = str.split("][");
  //arr = arr.map(function (val) { return +val + 1; });
  console.log('arr:', arr[0].toString());
  var l = [];
  var r = [];
  var v = [];
  for (var i = 0; i < arr.length; i++) {
     var lrv = arr[i].toString().split(" ");
     console.log('lrv:', lrv.toString());
     l.push(lrv[0].toString());
     r.push(lrv[1].toString());
     v.push(lrv[2].toString());
  }
  console.log('body:', arr.toString());
  console.log('l:', l.toString());
  console.log('r:', r.toString());
  console.log('v:', v.toString());
  res.json("Teste->" + getHexValueByStr('41'));

  const myBinaryFile = new BinaryFile(__dirname +'/upload/'+'RAV4CRSH.BIN', 'r+');
(async function () {
  try {
    await myBinaryFile.open();
    var size = await myBinaryFile.size();
    console.log('File opened->'+size);
    const stringLength = await myBinaryFile.readUInt8();
    console.log('File stringLength->'+stringLength);
    const string = await myBinaryFile.readString(stringLength);
    await myBinaryFile.seek(0x00);
    // await myBinaryFile.writeInt8(parseInt(v[0] , 16), parseInt(l[0] , 16));
    // await myBinaryFile.writeInt8(parseInt(v[0] , 16), parseInt(l[0] , 16)+1);
    // await myBinaryFile.writeInt8(parseInt(v[0] , 16), parseInt(l[0] , 16)+2);
    // await myBinaryFile.writeInt8(parseInt(v[0] , 16), parseInt(l[0] , 16)+3);


    for (var id = 0; id < l.length; id++) {
        var value=parseInt(v[id], 16);
        var left=parseInt(l[id], 16);
        var rigth=parseInt(r[id], 16);
        for (var id2 = 0; id2 !== (rigth-left)+1; id2++) {
          await myBinaryFile.writeUInt8(value,left+id2);
        }
    }
    var pos=await myBinaryFile.tell();
    console.log(`Posicao: ` + pos);
    console.log(`File read: ${string}`);
    await myBinaryFile.close();
    console.log('File closed');
    //return "";
  } catch (err) {
    console.log(`There was an error: ${err}`);
  //    return "";
  }
})();
});

router.post('/upload', upload.single('image'), function(req, res, next) {
    console.log('files:', req.file);
    console.log('body:', req.body);
    fs.readFile(req.file.path, function (err, data){ // readfilr from the given path
    var newPath = __dirname +'/upload/' + req.file.originalname; // add the file name
    console.log(newPath);
    fs.writeFile(newPath, data, function (err) { // write file in uploads folder
    if(err){
    res.json("Failed to upload your file");
    }else {
  res.json("Successfully uploaded your file");
}

});
});

});



router.route("/upload/:file").post(function(req, res){
    file = req.params.file;
    var dirname = __dirname +'/upload/';
    console.log(dirname);
    var img = fs.readFileSync(dirname  + file);
    res.writeHead(200, {'Content-Type': 'image/jpg' });
    res.end(img, 'binary');
});

router.get('/download', function(req, res) { // create download route
  var dir=__dirname +'/upload/';// give path
    console.log(dir);
  fs.readdir(dir, function(err, list) { // read directory return  error or list
  if (err) return res.json(err);
  else{
    console.log(list[0]);
    res.json(list);
  }
  });
});

router.get('/:file(*)', function(req, res, next){ // this routes all types of file
  var file = req.params.file;
  var path = __dirname +'/upload/' +file;
  res.download(path); // magic of download fuction
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


//https://www.npmjs.com/package/binary-file



function getCleanFile(){

  const myBinaryFile = new BinaryFile(__dirname +'/upload/'+'RAV4CRSH.BIN', 'r');
(async function () {
  try {
    await myBinaryFile.open();
    var size = await myBinaryFile.size();
    console.log('File openede->'+size);
    const stringLength = await myBinaryFile.readUInt8();
    console.log('File stringLength->'+stringLength);
    const string = await myBinaryFile.readString(stringLength);
    console.log(`File read: ${string}`);
    await myBinaryFile.close();
    console.log('File closed');
    return "";
  } catch (err) {
    console.log(`There was an error: ${err}`);
      return "";
  }
})();

}

function getHexValueByStr(strHex){
  var bytestring = Number('0x' + strHex).toString(10);
  var chr = String.fromCharCode(bytestring);
  return chr;
}



module.exports = router;
