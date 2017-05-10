module.exports = new ( require('backbone').Model.extend( {

    defaults: { state: {} },

    isAdmin() {
        return this.get('roles').includes( 'admin' )
    },

    url() { return "/user" }

} ) )()
