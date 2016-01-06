var ListItem = require('./util/ListItem'),
    Resource = function() { return ListItem.apply( this, arguments ) }

Object.assign( Resource.prototype, ListItem.prototype, {

    getTemplateOptions() { return { values: this.fields.map( field => ( { name: field, value: this.model.get(field) } ) ) } },

    template: require('../templates/resource')( require('handlebars') )

} )

module.exports = Resource
