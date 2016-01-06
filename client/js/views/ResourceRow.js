var ListItem = require('./util/ListItem'),
    ResourceRow = function() { return ListItem.apply( this, arguments ) }

Object.assign( ResourceRow.prototype, ListItem.prototype, {

    getTemplateOptions() { return { values: this.fields.map( field => ( { name: field.name, value: this.model.get(field.name), width: field.width } ) ) } },

    template: require('../templates/resourceRow')( require('handlebars') )

} )

module.exports = ResourceRow
