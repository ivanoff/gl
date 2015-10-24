"use strict"

var OptionsModel = require('../models/options');

exports.getAllOptions = function( req, res, next ){
    OptionsModel.getOptions( req, function( err, docs ){
        if ( err   ) { req.status=500; return next(err) }
        if ( !docs ) { return req.error( ERROR.NO_OPTIONS ) }
        res.json( docs );
    });
};

