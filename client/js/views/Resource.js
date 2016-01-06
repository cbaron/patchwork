var MyView = require('./MyView'),
    Resource = function() { return MyView.apply( this, arguments ) }

Object.assign( Resource.prototype, MyView.prototype, {

    getTemplateOptions() {
        return { resource: resource }
    },

    template: require('../templates/resource')( require('handlebars') )

} )

module.exports = Resource
