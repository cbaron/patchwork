var CustomContent = require('./util/CustomContent'),
    Home = function() { return CustomContent.apply( this, arguments ) }

Object.assign( Home.prototype, CustomContent.prototype, {

/*
    events: {
        signupBtn: { method: 'routeToSignup' }
    },

    initialImage: { path: 'assortment.jpg', description: "Assorted vegetables" },

    getTemplateOptions() {
        return { image: { path: 'assortment.jpg', description: "Assorted vegetables" } }
    },

    images: [
            { path: 'breakfast.jpg', description: 'Breakfast on the table' },
            { path: 'market-stand.jpg', description: 'Patchwork market stand' },
            { path: 'chard-and-onions.jpg', description: 'Chard and onions' },
            { path: 'sheep-tongue.jpg', description: 'A sheep sticking its tongue out' },
            { path: 'red-cabin.jpg', description: 'Field with red cabin in background' },
            { path: 'potatoes.jpg', description: 'Potatoes' },
            { path: 'eggplant.jpg', description: 'A bunch of eggplant' },
            { path: 'radishes.jpg', description: 'A bunch of radishes' },
            { path: 'parsley-broccoli.jpg', description: 'Broccoli and parsley with bright fruit' },
            { path: 'saplings.jpg', description: 'Some saplings' },
            { path: 'squash.jpg', description: 'A few squash varieties in the field' },
            { path: 'pigs.jpg', description: 'Some pigs hanging out' },
            { path: 'beets.jpg', description: 'A bunch of beets' },
            { path: 'vine-tomatoes.jpg', description: 'Tomatoes on the vine' },
            { path: 'tomatoes.jpg', description: 'Two large tomatoes' },
            { path: 'green-beans.jpg', description: 'Green beans' },
            { path: 'shallots.jpg', description: 'Tons of shallots' },
            { path: 'sunset.jpg', description: 'Sunset at Patchwork Gardens' }
    ],

    loadCarouselImage( image ) {
        return new Promise( ( resolve, reject ) => {
            var imageEl = new Image();
            imageEl.src = '/static/img/' + image.path
            imageEl.onload = () => {
                this.templateData.carouselInner.append( this.templates.CarouselImage( image ) )
                resolve()
            }
        } )

    },
*/

    postRender() {
        CustomContent.prototype.postRender.call(this)
        this.templateData.carousel.carousel()
    },

    requiresLogin: false,

    tables: [
        { name: 'carousel', comparator: 'position', el: 'carouselInner', image: true, template: 'carouselImage' }
    ],

    routeToSignup() { this.router.navigate( "sign-up", { trigger: true } ) },

    template: require('../templates/home')( require('handlebars') ),

    templates: {
        carouselImage: require('../templates/carouselImage')( require('handlebars') ),
    }

} )

module.exports = Home
