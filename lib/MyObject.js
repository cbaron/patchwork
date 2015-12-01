var MyObject = function( data ) { return Object.assign( this, data ) }

MyObject.prototype.format = require('util').format

module.exports = MyObject;
