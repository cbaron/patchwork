var BaseResource = require('./__proto__'),
    User = function() { return BaseResource.apply( this, arguments ) }

Object.assign( User.prototype, BaseResource.prototype, {

    GET() {
        return this.validate.GET.call(this)
        .then( () => this.respond( { body: this.user } ) )
        .catch( () => this.respond( { body: { } } ) )
    }

} )

module.exports = User
