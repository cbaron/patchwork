var MyObject = function( data ) { return Object.assign( this, data ) }

Object.assign( MyObject.prototype, {
    _: require('underscore'),

    format: require('util').format,

    moment: require('moment'),

    Q: require('q'),
    
} )

module.exports = MyObject
