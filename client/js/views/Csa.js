module.exports = Object.assign( {}, require('./__proto__'), require('./util/CustomContent'), {

    CurrentShare: require('../models/CurrentShare'),
    Shares: Object.create( require('../models/__proto__'), { resource: { value: 'Share' } } ),

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

        this.Shares.get()
        .then( () => {
            console.log( 'shares data' )
            console.log( this.Shares.data )
            this.Shares.data.forEach( share => {
                this.slurpTemplate( {
                    template: this.templates.shareExample( share.shareExample ),
                    insertion: { el: this.els.shareExamples }
                } )

                this.slurpTemplate( {
                    template: this.templates.csaItem( share.shareDescription ),
                    insertion: { el: this.els.shareDescriptions }
                } )
            } )
        } )
        .catch( this.Error )

        return this
    },

    tables: [
        //{ name: 'csastatements', el: 'csaStatements', template: 'listItem'},
        //{ name: 'largeshareexample', el: 'shareExampleLg', template: 'listItem' },
        //{ name: 'smallShareExample', el: 'shareExampleSm', template: 'listItem' },
        { name: 'AddOn', el: 'addOnItems', template: 'csaItem' }
    ],

    templates: {
        csaItem: require('./templates/CsaItem'),
        deliveryMatrix: require('./templates/deliveryMatrix'),
        shareExample: require('./templates/ShareExample')
        //listItem: require('./templates/ListItem')
    }

} )