var BaseResource = require('./__proto__'),
    Person = function() { return BaseResource.apply( this, arguments ) }

Object.assign( Person.prototype, BaseResource.prototype, {

    bcrypt: require('bcrypt-nodejs'),

    context: Object.assign( {}, BaseResource.prototype.context, {
        POST: function() { this.body.password = this.bcrypt.hashSync( this.body.password ) }
    } )
} )

module.exports = Person
