var CustomContent = require('./util/CustomContent'),
    CSA = function() { return CustomContent.apply( this, arguments ) }

Object.assign( CSA.prototype, CustomContent.prototype, {

    events: {
        signupBtn: { method: 'routeToSignup' }
    },

    hashToElement: {
        'how-do-i-know': 'howDoIKnow',
    },

    postRender() {

        CustomContent.prototype.postRender.call(this)

        if( window.location.hash ) {
            this.$('body').animate( {
                scrollTop: this.templateData[ this.hashToElement[ window.location.hash.slice(1) ] ].position().top + this.$(window).height() }, 1000 )
        }
    },

    requiresLogin: false,

    tables: [
        { name: 'csapageimage', comparator: 'id', el: 'csaImage', image: true, template: 'csaImage' },
        { name: 'csastatements', comparator: 'position', el: 'csaStatements', template: 'listItem'},
        { name: 'largeshareexample', comparator: 'position', el: 'shareExample', template: 'listItemTwoCol' },
    ],
    
    routeToSignup() { this.router.navigate( "sign-up", { trigger: true } ) },

    template: require('../templates/csa')( require('handlebars') ),

    templates: {
        csaImage: require('../templates/imageInstance')( require('handlebars') ),
        listItem: require('../templates/listItem')( require('handlebars') ),
        listItemTwoCol: require('../templates/listItemTwoCol')( require('handlebars') )
    }

} )

module.exports = CSA
