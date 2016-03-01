var MyView = require('./MyView'),
    CSA = function() { return MyView.apply( this, arguments ) }

Object.assign( CSA.prototype, MyView.prototype, {

    events: {
        signupBtn: { method: 'routeToSignup' }
    },

    hashToElement: {
        'how-do-i-know': 'howDoIKnow',
    },

    postRender() {
        if( window.location.hash ) {
            this.$('body').animate( {
                scrollTop: this.templateData[ this.hashToElement[ window.location.hash.slice(1) ] ].position().top + this.$(window).height() }, 1000 )
        }
    },

    requiresLogin: false,

    routeToSignup() { this.router.navigate( "sign-up", { trigger: true } ) },

    template: require('../templates/csa')( require('handlebars') ),

} )

module.exports = CSA
