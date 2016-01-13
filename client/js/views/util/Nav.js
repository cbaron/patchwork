var MyView = require('../MyView'),
    Nav = function() { return MyView.apply( this, arguments ) }

Object.assign( Nav.prototype, MyView.prototype, {

    backgrounds: {
            home: '/static/img/bucket_in_field.jpg',
            about: '/static/img/ole_barn.jpg',
            locations: '/static/img/broccoli_bucket.jpg'
    },

    events: {
        'home': { event: 'click', selector: '', method: 'navigate' },
        'signup': { event: 'click', selector: '', method: 'navigate' },
        'about': { event: 'click', selector: '', method: 'navigate' },
        'locations': { event: 'click', selector: '', method: 'navigate' },
        'members': { event: 'click', selector: '', method: 'navigate' },
        'employment': { event: 'click', selector: '', method: 'navigate' },
        'contact': { event: 'click', selector: '', method: 'navigate' }
    },

    fields: [
            { label: 'Sign Up', name: 'signup' },
            { label: 'About Us', name: 'about' },
            { label: 'Locations', name: 'locations' },
            { label: 'Member Resources', name: 'members' },
            { label: 'Employment', name: 'employment' },
            { label: 'Contact Us', name: 'contact' }
    ],

    getTemplateOptions() { return { fields: this.fields, home: this.home } },

    home: { label: 'Patchwork Gardens', name: 'home' },

    requiresLogin: false,

    navigate( e ) {
        var currentPath = window.location.pathname.slice(1),
            id = this.$( e.currentTarget ).attr( 'id' )
        this.router.views[ currentPath ].hide().then( () => this.router.navigate( id, { trigger: true } ) )
        if ( this.router.views[ id ] ) this.router.views[ id ].show()
        this.router.header.templateData.container.css( 'background-image', this.util.format( 'url( %s )', this.backgrounds[ id ] ) )
        this.$('body').scrollTop(0);
    }

} )

module.exports = Nav