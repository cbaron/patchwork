module.exports = Object.assign( require('./__proto__'), {

    events: {
        list: 'click',
    },

    size() {
        const body = document.body,
            container = this.els.container
            
        let difference

        if( container.style.display === 'none' ) return
        if( container.style.height ) this.els.templateData.container.attr('style','')

        difference = body.clientHeight - body.offsetTop + this.els.clientHeight

        if( difference > 0 ) container.style.height = `${( container.height() + difference )}px`

        return this
    },

    fields: [
            { label: 'About Us', name: 'about' },
            { label: 'CSA Program', name: 'csa' },
            { label: 'Markets', name: 'markets' },
            { label: 'Sign-Up', name: 'sign-up' },
            { label: 'Get Involved', name: 'get-involved' },
            { label: 'Contact Us', name: 'contact' }
    ],

    onListClick( e ) {
        if( e.target.tagName !== 'LI' ) return
        this.emit( 'navigate', `/${e.target.getAttribute('data-id')}` )
    },

    templateOpts() {
        return { fields: this.fields, home: { label: 'Patchwork Gardens', footerLabel: 'Home', name: 'home' } }
    }

} )
