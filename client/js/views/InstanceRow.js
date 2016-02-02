var ListItem = require('./util/ListItem'),
    InstanceRow = function() { return ListItem.apply( this, arguments ) }

Object.assign( InstanceRow.prototype, ListItem.prototype, {

    getFieldValue( field ) {
        var modelValue = this.model.get(field)
        return ( typeof modelValue === "object" && modelValue !== null ) ? modelValue.value : modelValue
    },

    getTemplateOptions() {
        return {
            id: this.model.id,
            values: this.fields.map( field => ( { name: field.name, value: this.getFieldValue( field.name ), width: field.width } ) )
        }
    },

    postRender() {
        ListItem.prototype.postRender.call(this)
        this.model.on( 'change', () =>
            Object.keys( this.model.attributes ).forEach( field => this.templateData[ field ].text( this.getFieldValue( field ) ) )
        )
    },

    template: require('../templates/instanceRow')( require('handlebars') )

} )

module.exports = InstanceRow
