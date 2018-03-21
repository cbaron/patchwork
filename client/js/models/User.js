module.exports = new ( require('backbone').Model.extend( {

    defaults: function() { return { state: {} } },

    isAdmin() {
        const roles = this.get('roles')

        if( ! Array.isArray( roles ) ) return false

        return roles.includes( 'admin' )
    },

    isLoggedIn() {
        return Boolean( this.id && this.get('emailVerified') )
    },

    url() { return "/user" }

} ) )()
