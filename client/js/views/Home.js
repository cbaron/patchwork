var CustomContent = require('./util/CustomContent'),
    Home = function() { return CustomContent.apply( this, arguments ) }

Object.assign( Home.prototype, CustomContent.prototype, {

    postRender() {
        CustomContent.prototype.postRender.call(this)
        this.templateData.carousel.carousel()
    },

    requiresLogin: false,

    tables: [
        { name: 'carousel', comparator: 'position', el: 'carouselInner', image: true, template: 'carouselImage' }
    ],

    template: require('../templates/home')( require('handlebars') ),

    templates: {
        carouselImage: require('../templates/carouselImage')( require('handlebars') ),
    }

} )

module.exports = Home
