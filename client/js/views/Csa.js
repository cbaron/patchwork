module.exports = Object.assign( {}, require('./__proto__'), require('./util/CustomContent'), {

    CurrentShare: require('../models/CurrentShare'),

    events: {
        link: 'click',
        signupBtn: 'click'
    },

    hashToElement: {
        'how-do-i-know': 'howDoIKnow',
    },

    onLinkClick( e ) {
        this.emit( 'navigate', e.target.getAttribute('data-name') )
    },

    onSignupBtnClick() { this.emit( 'navigate', 'sign-up' ) },

    postRender() {
        require('./util/CustomContent').postRender.call(this)

        if( window.location.hash ) {
            this.els[ this.hashToElement[ window.location.hash.slice(1) ] ].scrollIntoView( { behavior: 'smooth' } )
        }

        this.CurrentShare.get()
        .then( () =>
            this.slurpTemplate( {
                template: this.templates.deliveryMatrix( {
                    deliveryOptions: this.CurrentShare.data.deliveryOptions,
                    sizeOptions: this.CurrentShare.getSizeOptions()
                } ),
                insertion: { el: this.els.deliveryMatrix }
            } )
        )
        .catch( this.Error )

        return this
    },

    tables: [
        //{ name: 'csastatements', el: 'csaStatements', template: 'listItem'},
        { name: 'largeshareexample', el: 'shareExampleLg', template: 'listItem' },
        { name: 'smallShareExample', el: 'shareExampleSm', template: 'listItem' },
    ],

    templates: {
        deliveryMatrix: require('./templates/deliveryMatrix'),
        listItem: require('./templates/ListItem')
    }

} )