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
            { path: '/static/img/market_display.jpg', description: 'Vegetables on display' },
            { path: '/static/img/potatoes.jpg', description: 'Potatoes' },
            { path: '/static/img/parsley-broccoli.jpg', description: 'Broccoli with bright fruit' },
            { path: '/static/img/veggie_display.jpg', description: 'Lots of vegetables' },
            { path: '/static/img/green-beans.jpg', description: 'Green beans' }
    ],

    requiresLogin: false,

    template: require('../templates/home')( require('handlebars') )

} );

module.exports = Home