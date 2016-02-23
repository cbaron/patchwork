var MyView = require('./MyView'),
    CSA = function() { return MyView.apply( this, arguments ) }

Object.assign( CSA.prototype, MyView.prototype, {

    hashToElement: {
        'how-do-i-know': 'howDoIKnow'
    },

    requiresLogin: false,

    postRender() {
        if( window.location.hash ) {
            this.$('body').animate( {
                scrollTop: this.templateData[ this.hashToElement[ window.location.hash.slice(1) ] ].position().top + this.$(window).height() }, 1000 )
        }
    },

    template: require('../templates/csa')( require('handlebars') ),

} )

module.exports = CSA
