var CustomContent = require('./util/CustomContent'),
    Home = function() { return CustomContent.apply( this, arguments ) }

Object.assign( Home.prototype, CustomContent.prototype, {

    events: {
        signupBtn: { method: 'routeToSignup' }
    },

    postRender() {
        const result = CustomContent.prototype.postRender.call(this)

        if( result && result.then ) result.then( () => this.templateData.carousel.carousel() ).catch( e => console.log( e.stack || e ) )
    },

    requiresLogin: false,

    tables: [
        { name: 'carousel', comparator: 'position', el: 'carouselInner', image: true, template: 'carouselImage' }
    ],

    routeToSignup() { this.router.navigate( "sign-up", { trigger: true } ) },

    template: require('../templates/home'),

    templates: {
        carouselImage: require('../templates/carouselImage')( require('handlebars') ),
    }

} )

module.exports = Home
