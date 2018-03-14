module.exports = Object.assign( {}, require('./__proto__'), {

    postRender() {
        this.Xhr( {
            method: 'get',
            resource: 'verify',
            qs: `{ "token": "${this.path[1]}" }`
        } )
        .then( () => this.Toast.showMessage( 'success', 'Email verified! You are now free to log in.' ) )
        .then( () => this.delete().then( () => this.emit( 'navigate', '' ) ).catch( this.Error ) )
        .catch( e => {
            this.Error( e )
            this.Toast.showMessage( 'error', `Failed to verify email. Please try again or contact us.` )
        } )

        return this
    }

} )