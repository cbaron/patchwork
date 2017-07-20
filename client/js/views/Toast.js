module.exports = Object.create( Object.assign( {}, require('./__proto__'), {

    Icons: {
        error: require('./templates/lib/error')(),
        success: require('./templates/lib/checkmark')()
    },

    insertion: { el: document.body },

    name: 'Toast',

    requiresLogin: false,

    showMessage( type, message ) {
        return new Promise( ( resolve, reject )  => {
            if( /show/.test( this.status ) ) return

            this.resolution = resolve

            if( type !== 'error' ) this.els.container.classList.add('success')

            this.els.message.textContent = message
            this.els.title.textContent = type === 'error' ? 'Error' : 'Success'
            this.slurpTemplate( { insertion: { el: this.els.icon }, template: type === 'error' ? this.Icons.error : this.Icons.success } )
            
            this.status = 'showing'

            this.show( true )
            .then( () => this.hide( true ) )
            .then( () => this.teardown() )
            .catch( reject )
        } )
    },

    teardown() {
        if( this.els.container.classList.contains('success') ) this.els.container.classList.remove('success')
        this.els.message.textContent = ''
        this.els.message.title = ''
        if( this.els.icon.firstChild ) this.els.icon.removeChild( this.els.icon.firstChild )

        this.status = 'hidden'
        this.resolution()
    },

    template: require('./templates/Toast')

} ), { } ).constructor()
