
var mongoose = require('mongoose');

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


var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  name: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
  },
  token:{type:String},
  nServicosPrePagos:{type:Number,required: true,default: 0},
  activo:{type:Boolean,required: true, default: false}
});



var User = mongoose.model('User', UserSchema);
module.exports = User;
