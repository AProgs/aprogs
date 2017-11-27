
  var mongoose    =   require("mongoose");
//mongoose.Promise = require('bluebird');

//mongoose.Promise = global.Promise;
  var Schema = mongoose.Schema;
  var options = {
    db: { native_parser: true },
    server: { poolSize: 5 },
    user: 'alexafp',
    pass: '23179alex'

  }
  //<dbuser>alexafp

  //<dbpassword>23179alex
  //mongodb://<dbuser>:<dbpassword>@ds149711.mlab.com:49711/contralldb

  mongoose.connect('mongodb://ds149711.mlab.com:49711/contralldb', options);

  //modelo | nserie | memoria | resetmapa
  var resetmapsSchema  =  {
    "modelo" : String,
    "nserie" : String,
    "memoria" : String,
    "resetmapa":String
  };

//  resetmapsSchema.index({ modelo: 1, nserie: 1, memoria: 1,resetmapa:1 }, { unique: true });
  // create model if not exists.

  //rhc port-forward -a [myapp]
  module.exports = mongoose.model('resetmap',resetmapsSchema);
