"use strict"

var ResourcesModel = require('../models/resources');

var ERROR = require('config').get('ERRORS');

exports.getResources = function( req, res, next ){
    ResourcesModel.getResources( req, function( err, docs ){
        if ( err   ) { req.error( 500, err ); return next(err) }
        if ( !docs ) { req.error( 404, ERROR.NO_ASSETS ); return next() }
        res.json( docs );
    });
};

