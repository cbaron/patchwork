var ListItem = require('./util/ListItem'),
    InstanceRow = function() { return ListItem.apply( this, arguments ) }

Object.assign( InstanceRow.prototype, ListItem.prototype, {

    getTemplateOptions() {
        return {
            values: this.fields.map( field => ( {
                name: field.name,
                value: ( typeof this.model.get(field.name) === "object" ) ? this.model.get(field.name).value : this.model.get(field.name),
                width: field.width
            } ) )
        }
    },

    template: require('../templates/instanceRow')( require('handlebars') )

} )

module.exports = InstanceRow
