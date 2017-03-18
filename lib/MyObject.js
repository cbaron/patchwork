var MyObject = function( data ) { return Object.assign( this, data ) }

Object.assign( MyObject.prototype, {

    Error: require('./MyError'),

    _: require('underscore'),

    format: require('util').format,

    moment: require('moment'),

    P: ( fun, args=[ ], thisArg ) =>
        new Promise( ( resolve, reject ) => Reflect.apply( fun, thisArg || this, args.concat( ( e, ...callback ) => e ? reject(e) : resolve(callback) ) ) ),

    Q: require('q')
    
} )

module.exports = MyObject
