var MyView = require('./MyView'),
    Home = function() { return MyView.apply( this, arguments ) }

Object.assign( Home.prototype, MyView.prototype, {

    initialImage: { path: 'static/img/assortment.jpg', description: "Assorted vegetables" },

    getTemplateOptions() {
        return { initialImage: this.initialImage, images: this.images }
    },

    images: [
            { path: '/static/img/breakfast.jpg', description: 'Breakfast on the table' },
            { path: '/static/img/market-stand.jpg', description: 'Patchwork market stand' },
            { path: '/static/img/chard-and-onions.jpg', description: 'Chard and onions' },
            { path: '/static/img/sheep-tongue.jpg', description: 'A sheep sticking its tongue out' },
            { path: '/static/img/red-cabin.jpg', description: 'Field with red cabin in background' },
            { path: '/static/img/potatoes.jpg', description: 'Potatoes' },
            { path: '/static/img/eggplant.jpg', description: 'A bunch of eggplant' },
            { path: '/static/img/radishes.jpg', description: 'A bunch of radishes' },
            { path: '/static/img/parsley-broccoli.jpg', description: 'Broccoli and parsley with bright fruit' },
            { path: '/static/img/saplings.jpg', description: 'Some saplings' },
            { path: '/static/img/squash.jpg', description: 'A few squash varieties in the field' },
            { path: '/static/img/pigs.jpg', description: 'Some pigs hanging out' },
            { path: '/static/img/beets.jpg', description: 'A bunch of beets' },
            { path: '/static/img/vine-tomatoes.jpg', description: 'Tomatoes on the vine' },
            { path: '/static/img/tomatoes.jpg', description: 'Two large tomatoes' },
            { path: '/static/img/green-beans.jpg', description: 'Green beans' },
            { path: '/static/img/shallots.jpg', description: 'Tons of shallots' },
            { path: '/static/img/sunset.jpg', description: 'Sunset at Patchwork Gardens' }
    ],

    requiresLogin: false,

    template: require('../templates/home')( require('handlebars') )

} );

module.exports = Home
