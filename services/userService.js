var usersServiceDb = require("../models/users.js");
module.exports = {
    getUsers: function(req, res) {
        var response = {};

        usersServiceDb.find({}, function(err, data) {
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

    postUsers: function(req, res) {
        var response = {};
        var db = new usersServiceDb();

        // fetch email and password from REST request.
        // Add strict validation when you use this in Production.
        var alreadyExist = false;
        var email = req.body.userEmail;
        var query = {};
        query.userEmail = email;
        usersServiceDb.count({
            'userEmail': email
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
                db.userEmail = req.body.userEmail;
                // Hash the password using SHA1 algorithm.
                db.userPassword = require('crypto')
                    .createHash('sha1')
                    .update(req.body.userPassword)
                    .digest('base64');

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

    getUsersById: function(req, res) {
        var response = {};
        usersServiceDb.findById(req.params.id, function(err, data) {
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

    putUser: function(req, res) {
        var response = {};
        // first find out record exists or not
        // if it does then update the record
        usersServiceDb.findById(req.params.id, function(err, data) {
            if (err) {
                response = {
                    "error": true,
                    "message": "Error fetching data"
                };
            } else {
                // we got data from Mongo.
                // change it accordingly.
                if (req.body.userEmail !== undefined) {
                    // case where email needs to be updated.
                    data.userEmail = req.body.userEmail;
                }
                if (req.body.userPassword !== undefined) {
                    // case where password needs to be updated
                    data.userPassword = req.body.userPassword;
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

    deleteUser: function(req, res) {
        var response = {};
        // find the data
        usersServiceDb.findById(req.params.id, function(err, data) {
            if (err) {
                response = {
                    "error": true,
                    "message": "Error fetching data"
                };
            } else {
                // data exists, remove it.
                usersServiceDb.remove({
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
