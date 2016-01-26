var MyView = require('./MyView'),
    About = function() { return MyView.apply( this, arguments ) }

Object.assign( About.prototype, MyView.prototype, {

    getTemplateOptions() {
        return { images: this.images }
    },

    requiresLogin: false,

    images: [
            { path: '/static/img/about/george.jpg', description: 'George Mertz' },
            { path: '/static/img/about/amber.jpg', description: 'Amber Fillinger' },
            { path: '/static/img/about/laura.png', description: 'Laura Krugh' },
            { path: '/static/img/about/jake.jpg', description: 'Jake Stockwell' },
            { path: '/static/img/about/alec.jpg', description: 'Alec Snead' },
            { path: '/static/img/about/sidekick.jpg', description: 'Sidekick' }
    ],

    template: require('../templates/about')( require('handlebars') )

} )

module.exports = About
