module.exports = Object.assign( {}, require('./__proto__'), {

    postRender() {
        this.Xhr( {
            method: 'get',
            resource: 'verify',
            qs: `{ "token": "${this.path[1]}" }`
        } )
        .then( () => this.els.message.textContent = 'Your email address has been successfully verified! You are now free to log in.' )
        .catch( e => {
            this.Error( e )
            this.els.message.textContent = `We were unable to verify your email address. Please try again or contact us.`
        } )

        return this
    }

} )