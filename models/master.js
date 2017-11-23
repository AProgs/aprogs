
var mongoose    =   require("mongoose");
var options = {
  db: { native_parser: true },
  server: { poolSize: 5 },
  user: 'alexafp',
  pass: '23179alex'

}
//replset: { rs_name: 'myReplicaSetName' },
//user: 'admin',
//pass: 'eDp7PY12k5ea'

//<dbuser>alexafp
//<dbpassword>23179alex
//mongodb://<dbuser>:<dbpassword>@ds149711.mlab.com:49711/contralldb

mongoose.connect('mongodb://ds149711.mlab.com:49711/contralldb', options);

// create schema
var portSchema = {
  "name": String,
  "portNunber": {
    type: String,
    trim: true,
    index: true,
    required: true
  },
  "write": {
    type: Boolean,
    trim: true,
    index: true,
    required: true
  },
  "type": String,
  "isAdc": Boolean,
  "readTimeMs": String,
  "timeClose": String,
  "currentValue":String,
  "pinDependence": {
    "portNumber": String,
    "dependeFromValue1": Boolean
  }

};

var slaveSchema  = {
  "masterId" : String,
  "name" : String,
  "arduinoType" : String,
  "portslave":[portSchema]
};
// create schema
var masterSchema  = {
    "userId" : String,
    "name" : String,
    "slaves" : [slaveSchema],
    "arduinoType" : String,
    "config":[portSchema]
};

// create schema
var dataSchema  = {
    "masters" : [masterSchema]

};

// create model if not exists.

//rhc port-forward -a [myapp]
module.exports = mongoose.model('dataMaster',dataSchema);
