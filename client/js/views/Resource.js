var Table = require('./util/Table'),
    Resource = function() { return Table.apply( this, arguments ) }

Object.assign( Resource.prototype, Table.prototype, {

    Instance: require('../models/Instance'),

    ItemView: require('./InstanceRow'),

    collection() {
        return {
            model: this.Instance,
            parse: response => {
                this.label = response.label;
                if( response.operation["@type"] === "Create" ) this.createProperties = response.operation.expects.supportedProperty
                return response[ this.resource ]
            },
            url: this.util.format( "/%s", this.resource )
        }
    },

    events: {
        'createBtn': { method: 'showCreateDialog' }
    },

    fetch: { headers: { accept: "application/ld+json" } },

    postRender() {
        Table.prototype.postRender.call(this)
        this.items.on( 'reset', () => this.templateData.subHeading.text( this.label ) )
    },

    showCreateDialog() {

        this.modalView.show( {
            title: this.util.format( 'Create %s', this.label ),
            body:
        } )
    },

    template: require('../templates/resource')( require('handlebars') ),
    templates: {
        'create': require('../templates/createInstance')
    }

} )

module.exports = Resource
