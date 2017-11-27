var resetmapsServiceDb = require("../models/resetmaps.js");
var fs = require('fs');
module.exports = {


  getAllResetMap: function(req, res) {
    var response = {};

    resetmapsServiceDb.find({}, function(err, data) {
      // Mongo command to fetch all data from collection.
      if (err) {
        response = {
          "error": true,
          "message": "Error fetching data"
        };
      } else {
        response = {
          "error": false,
          "message": data
        };
      }
      res.json(response);
    })
  },
  postAllResetMap: function(req, res){
    //https://stackoverflow.com/questions/41834360/how-to-save-array-of-json-object-to-mongoose



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
              //  strjson = strjson.substring(1, strjson.length - 1);
                console.log(strjson);
                console.log(rawdata);

                var resetmapsList = JSON.parse(strjson);
                for(var resetmapsIten in resetmapsList){
                  new resetmapsServiceDb(resetmapsList[resetmapsIten])
                  .save()
                  .catch((err)=>{
                    console.log(err.message);
                  });

                }
              }

            })
          }



  },
  postResetMap: function(req, res) {
    var response = {};
    var db = new resetmapsServiceDb();

    // fetch email and password from REST request.
    // Add strict validation when you use this in Production.
    var alreadyExist = false;
    var modelo = req.body.modelo;
    var nserie = req.body.nserie;
    var query = {};
    query.modelo = modelo;
    resetmapsServiceDb.count({
      'modelo': modelo,
      'nserie': nserie
    }, function(err, docs) {
      if (docs > 0) {
        alreadyExist = true;
      }
      if (alreadyExist === true) {
        //res.json(alreadyExist);

        //res.json(alreadyExist);
        response = {
          "error": true,
          "message": "#100# User already exist"
        };
        res.json(response);
      } else {
        db.modelo = req.body.modelo;
        db.nserie = req.body.nserie;
        db.memoria = req.body.memoria;
        db.resetmapa = req.body.resetmapa;

        db.save(function(err) {
          // save() will run insert() command of MongoDB.
          // it will add new data in collection.
          if (err) {
            response = {
              "error": true,
              "message": "Error adding data"
            };
          } else {
            response = {
              "error": false,
              "message": "Data added"
            };
          }

          res.json(response);
        })
      }
    })
  },
  getAllByNserie : function(req, res){
    var response = {};
    resetmapsServiceDb.find({
      'nserie': nserie
    }, function(err, data) {

      if (err) {
        response = {
          "error": true,
          "message": "Error fetching data"
        };
      } else {
        response = {
          "error": false,
          "message": data
        };
      }
      res.json(response);
    })
},
getResetMapById: function(req, res) {
  var response = {};
  resetmapsServiceDb.findById(req.params.id, function(err, data) {
    // This ll run Mongo Query to fetch data based on ID.
    if (err) {
      response = {
        "error": true,
        "message": "Error fetching data"
      };
    } else {
      response = {
        "error": false,
        "message": data
      };
    }
    res.json(response);
  });
},

putResetMap: function(req, res) {
  var response = {};
  // first find out record exists or not
  // if it does then update the record
  resetmapsServiceDb.findById(req.params.id, function(err, data) {
    if (err) {
      response = {
        "error": true,
        "message": "Error fetching data"
      };
    } else {
      // we got data from Mongo.
      // change it accordingly.
      if (req.body.modelo !== undefined) {
        // case where email needs to be updated.
        data.modelo = req.body.modelo;
      }
      if (req.body.nserie !== undefined) {
        // case where password needs to be updated
        data.nserie = req.body.nserie;
      }
      if (req.body.memoria !== undefined) {
        // case where password needs to be updated
        data.memoria = req.body.memoria;
      }
      if (req.body.resetmapa !== undefined) {
        // case where password needs to be updated
        data.resetmapa = req.body.resetmapa;
      }

      // save the data
      data.save(function(err) {
        if (err) {
          response = {
            "error": true,
            "message": "Error updating data"
          };
        } else {
          response = {
            "error": false,
            "message": "Data is updated for " + req.params.id
          };
        }
        res.json(response);
      })
    }
  });

},

deleteResetMap: function(req, res) {
  var response = {};
  // find the data
  resetmapsServiceDb.findById(req.params.id, function(err, data) {
    if (err) {
      response = {
        "error": true,
        "message": "Error fetching data"
      };
    } else {
      // data exists, remove it.
      resetmapsServiceDb.remove({
        _id: req.params.id
      }, function(err) {
        if (err) {
          response = {
            "error": true,
            "message": "Error deleting data"
          };
        } else {
          response = {
            "error": true,
            "message": "Data associated with " + req.params.id + "is deleted"
          };
        }
        res.json(response);
      });
    }
  });

}


}

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
