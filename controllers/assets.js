"use strict"

var AssetsModel = require('../models/assets');

exports.getRootAssets = function( req, res, next ){
    AssetsModel.getRoot( req, function( err, docs ){
        if ( err   ) { req.error( 500, err ); return next(err) }
        if ( !docs ) { req.error( 404, 132 ); return next() }   // No assets found
        res.json( docs );
    });
};

exports.getAssetById = function( req, res, next ) {
    AssetsModel.get( req, function( err, doc ){
        if ( err  ) { req.error( 500, err ); return next(err) }
        if ( !doc ) { req.error( 404, 131 ); return next() }   // Asset not found
        if ( doc.type != 'folder' ) {
            res.json( doc );
        } else {
            AssetsModel.getFolderContent( req, doc.path + '/' + doc.name, function( err, doc ){
                if ( err  ) { req.error( 500, err ); return next(err) }
                if ( !doc ) { req.error( 404, 131 ); return next() }   // Asset not found
                res.json( doc );
            });
        }
    });
};

exports.addAsset = function( req, res, next ) {
    var doc    = req.body;
    doc['_id'] = req.uuid.v4();
    doc['userId'] = req.params.userId;
    if( !req.params.path ) { doc['path'] = '' };

    AssetsModel.validate( doc, function( err ) {
        if ( err ) { req.error( 500, err ); return next(err) }

        AssetsModel.add( req, doc, function( err, result, next ){
            if ( err ) { req.error( 500, err ); return next(err) }
            res.json( { ok : 1, _id: doc['_id'] } );
        });
    });
};

exports.addAssetToFolder = function( req, res, next ) {
    var doc    = req.body;
    doc['_id'] = req.uuid.v4();
    doc['userId'] = req.params.userId;
    if( !req.params.path ) { doc['path'] = '' };

//Promisesis?
    if( req.params.assetId ) {
        AssetsModel.get( req, function( err, docFolder ){
            if ( err ) { req.error( 500, err ); return next(err) }
            if ( !docFolder ) { req.error( 404, 131 ); return next() }  // Asset not found
            if ( docFolder.type != 'folder' ) 
                        { req.error( 404, 133 ); return next() }  // Asset is not folder
            doc['path'] = docFolder.path + '/' + docFolder.name

            AssetsModel.validate( doc, function( err ) {
                if ( err ) { req.error( 500, err ); return next(err) }
        
                AssetsModel.add( req, doc, function( err, result, next ){
                    if ( err ) { req.error( 500, err ); return next(err) }
                    res.json( { ok : 1, _id: doc['_id'] } );
                });
            });
        })
    }

};

exports.updateAsset = function( req, res, next ) {
    AssetsModel.get( req, function( err, doc ){
        if ( err  ) { req.error( 500, err ); return next(err) }
        if ( !doc ) { req.error( 404, 121 ); return next() }  // Asset not found

        doc = req._.extend( doc, req.body );

        AssetsModel.validate( doc, function( err ) {
            if ( err ) { req.error( 500, err ); return next(err) }

            AssetsModel.update( req, doc, function( err, result, next ){
                if ( err ) { req.error( 500, err ); return next(err) }
                res.json( { ok : 1, _id: doc._id } );
            });
        });

    });
};

exports.search = function( req, res, next ){
    AssetsModel.search( req, function( err, docs ){
        if ( err   ) { req.error( 500, err ); return next(err) }
        if ( !docs ) { req.error( 404, 132 ); return next() }
        res.json( docs );
    });
};

exports.deleteAsset = function( req, res, next ) {
    AssetsModel.remove( req, function( err, doc ){
        if ( err  ) { req.error( 500, err ); return next(err) }
        if ( !doc ) { req.error( 404, 121 ); return next() } // Asset not found
        res.json( { ok : 1, _id: req.params.assetId } );
    });
};