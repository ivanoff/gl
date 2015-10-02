"use strict"

var config = require('config');
var express = require('express');
var uuid = require( 'node-uuid' );
var bodyParser = require('body-parser');
var mongo = require('mongodb');

var DB_URL     = config.get( 'DB.url' ),
    PORT       = config.get( 'SERVER.port' ),
    ERRORS     = config.get( 'ERRORS' );

var app = new express();

var db = require('./controllers/db');

app.use( function( req, res, next ){ 
    req.db    = db.get(); 
    req.uuid  = uuid; 
    req.error = function(n,e){ 
                    var text=ERRORS[e] || e; 
                    if( text==e ) e=1; 
                    res.status(n).json( {error:e, text:text} )
                }; 
    next() 
});
app.use( bodyParser.urlencoded( { extended: true } ) );

require('./controllers/routes')(app);

db.connect( DB_URL, function( err, next ) {
    if ( err ) { return next( err ) }
    app.listen( PORT, function() {
        console.log( 'Listening on port ' + PORT + '...' )
    })
})

