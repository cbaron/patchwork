var Table = require('./util/Table'),
    Resource = function() { return Table.apply( this, arguments ) }

Object.assign( Resource.prototype, Table.prototype, {

    Bloodhound: require('../plugins/bloodhound'),

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

    getLabel( property ) {
        return this.format.capitalizeFirstLetter( property )
    },

    initTypeahead( property ) {
        
        var bloodhound = new this.Bloodhound( {
            datumTokenizer: this.Bloodhound.tokenizers.obj.whitespace('name'),
            queryTokenizer: this.Bloodhound.tokenizers.whitespace,
            remote: {
                url: this.util.format( "/%s?name=%QUERY", property.property ),
                replace: ( url, query ) => url.replace( '%QUERY', encodeURIComponent(query) ),
            }
        } )

        this.$( '#' + property.property ).typeahead( {
            hint: true,
            highlight: true,
            minLength: 1
        }, {
            name: property.property,
            display: obj => obj.name,
            source: bloodhound.ttAdapter()
        } )
    },

    postRender() {
        Table.prototype.postRender.call(this)
        this.items.on( 'reset', () => this.templateData.subHeading.text( this.label ) )
    },

    showCreateDialog() {

        this.modalView.show( {
            body: this.templates.create( {
                fields: this.createProperties.map( property => 
                    this.templates[ property.range ]( { name: property.property, label: this.getLabel( property.property ) } )
                )
            } ),
            title: this.util.format( 'Create %s', this.label )
        } )

        this.createProperties.forEach( property => { if( property.fk ) { this.initTypeahead( property ) } } )
    },

    template: require('../templates/resource')( require('handlebars') ),
    templates: {
        'create': require('../templates/createInstance')( require('handlebars') ),
        'Float': require('../templates/form/Text')( require('handlebars') ),
        'Integer': require('../templates/form/Text')( require('handlebars') ),
        'Text': require('../templates/form/Text')( require('handlebars') ),
    }

} )

module.exports = Resource
