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
                this.recordDescriptor = response.recordDescriptor;
                if( response.operation["@type"] === "Create" ) this.createProperties = response.operation.expects.supportedProperty
                return response[ this.resource ]
            },
            url: this.util.format( "/%s", this.resource )
        }
    },

    create( data ) {
        console.log(data)
        this.createProperties.forEach( property => {
            console.log(property)
            console.log(this)
            if( property.fk ) { data[ property.property ] = this[ property.fk.table + "Typeahead" ].id }
        } )

        this.$.ajax( {
            headers: { accept: 'application/json' },
            contentType: 'application/json',
            data: JSON.stringify( data ),
            method: 'POST',
            url: this.util.format( "/%s", this.resource )
        } )
        .done( ( response, textStatus, jqXHR ) => {
            if( this.items.length === 0 ) this.setFields( response )
            this.items.add( response )
            this.modalView.hide()
        } )
            
    },

    deleteModel() {
        
        this.$.ajax( {
            headers: { accept: 'application/json' },
            contentType: 'application/json',
            method: 'DELETE',
            url: this.util.format( "/%s/%s", this.resource, this.modelToDelete.id )
        } )
        .done( ( response, textStatus, jqXHR ) => {
            this.items.remove( this.modelToDelete )
            this.modelToDelete = undefined
            this.modalView.hide()
        } )
    },

    edit( data ) {

        var modelAttrs = { }

        this.createProperties.forEach( property => {
            if( property.fk ) {
                if( ! this[ property.fk.table + "Typeahead" ] ) { delete data[ property.property ]; return }

                data[ property.property ] = this[ property.fk.table + "Typeahead" ].id
                modelAttrs[ property.fk.recorddescriptor ].id = this[ property.fk.table + "Typeahead" ].id
                modelAttrs[ property.fk.recorddescriptor ].value = this[ property.fk.table + "Typeahead" ][property.fk.recorddescriptor]
            } else {
                modelAttrs[ property.property ] = data[ property.property ]
            }
        } )

        this.$.ajax( {
            headers: { accept: 'application/json' },
            contentType: 'application/json',
            data: JSON.stringify( data ),
            method: 'PATCH',
            url: this.util.format( "/%s/%d", this.resource, this.modelToEdit.id )
        } )
        .done( ( response, textStatus, jqXHR ) => {
            this.modelToEdit.set( modelAttrs )
            this.modelToEdit = undefined
            this.modalView.hide()
        } )
            
    },

    events: {
        createBtn: { method: 'showCreateDialog' },
        deleteBtn: { method: 'showDeleteDialog' },
        editBtn: { method: 'showEditDialog' },
        body: [
            { event: 'mouseover', selector: 'tr', method: 'onRowMouseEnter' },
            { event: 'mouseout', selector: 'tr', method: 'onRowMouseLeave' }
        ]
    },

    fetch: { headers: { accept: "application/ld+json" } },

    getLabel( property ) {
        return this.format.capitalizeFirstLetter( property )
    },

    initDatepicker( property ) {
        this.$( '#' + property.property ).datetimepicker( { format: "YYYY-MM-DD", minDate: this.moment() } )
    },

    initTypeahead( property ) {

        var bloodhound = new Bloodhound( {
            datumTokenizer: Bloodhound.tokenizers.obj.whitespace(property.descriptor.column.name),
            identify: obj => obj.id,
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            remote: {
                replace: (url, query) => url.replace( '%QUERY', encodeURIComponent (query) ),
                url: this.util.format( "/%s?%s=%QUERY&like=1", property.descriptor.table, property.descriptor.column.name )
            }
        } ),
        el = this.$( '#' + property.property )

        bloodhound.initialize()

        el.typeahead( { hint: true }, { display: obj => obj[ property.descriptor.column.name ], source: bloodhound.ttAdapter() } )
        .bind( 'typeahead:selected typeahead:autocompleted', ( obj, selected, name ) => {
            this[ property.fk.table + "Typeahead" ] = selected
            el.one( 'change', () => this[ property.fk.table + "Typeahead" ] = undefined )
        } )
    },

    onRowMouseEnter( e ) {
        var row = this.$( e.currentTarget ),
            position = row.position(),
            top = position.top + ( row.outerHeight( true ) / 2 )

        this.hoveredModel = this.items.get( row.attr( 'data-id' ) )
        this.templateData.editBtn.removeClass('hide')
        this.templateData.deleteBtn.removeClass('hide')

        top -= ( this.templateData.editBtn.outerHeight() / 2 )
        
        this.templateData.editBtn.css( { top: top, right: '35px' } )
        this.templateData.deleteBtn.css( { top: top, right: '5px' } )
    },
    
    onRowMouseLeave( e ) {

        if( this.isMouseOnEl( e, this.templateData.deleteBtn ) || this.isMouseOnEl( e, this.templateData.editBtn ) ) return

        this.hoveredModel = undefined

        this.templateData.deleteBtn.addClass('hide')
        this.templateData.editBtn.addClass('hide')
    },

    postRender() {
        Table.prototype.postRender.call(this)
        this.items.on( 'reset', () => { this.templateData.subHeading.text( this.label ) } )
    },

    setFields( instance ) {
        var keys = Object.keys( instance ), width = Math.floor( 100 / keys.length )
        this.fields = keys.map( key => {
            var field = { name: key, label: this.format.capitalizeFirstLetter( key ), width: width }
            this.$( this.templateData.header.children('tr')[0] ).append( this.templates.headerColumn.call( this, field ) )
            return field
        } )
    },

    populateModalField( property ) {
        var el = this.$( '#' + property.property )

        if( ! el ) return
        if( ! property.fk || !property.descriptor ) return el.val( this.modelToEdit.get( property.property ) )
        
        this.initTypeahead( property ) 

        el.typeahead( 'val', this.modelToEdit.get( property.fk.recorddescriptor ).value )
    },

    showCreateDialog() {

        this.modalView.show( {
            body: this.templates.create( {
                fields: this.createProperties.map( property => 
                    this.templates[ property.range ]( {
                        class: ( property.fk ) ? 'typeahead' : '',
                        label: this.getLabel( property.property ),
                        name: property.property,
                        password: ( property.property === "password" ) ? true : false
                    } ) 
                )
            } ),
            title: this.util.format( 'Create %s', this.label )
        } )
        .on( 'shown', () => this.createProperties.forEach( property => {
            if( property.fk && property.descriptor !== undefined ) this.initTypeahead( property )
            else if( property.range === "Date" ) this.initDatepicker( property )
        } ) )
        .on( 'submit', data => this.create(data) )

    },

    showDeleteDialog() {
        
        this.modelToDelete = this.hoveredModel

        this.modalView.show( {
            body: this.util.format( 'Are you sure you would like to delete %s?', this.modelToDelete.get( this.recordDescriptor ) ),
            confirmText: 'Yes',
            title: this.util.format( 'Delete %s', this.label )
        } )
        .on( 'submit', () => this.deleteModel() )
        .on( 'hidden', () => this.modelToDelete = undefined )
    },

    showEditDialog() {

        this.modelToEdit = this.hoveredModel

        this.modalView.show( {
            body: this.templates.create( {
                fields: this.createProperties.map( property => 
                    this.templates[ property.range ]( {
                        class: ( property.fk ) ? 'typeahead' : '',
                        name: property.property,
                        label: this.getLabel( property.property ),
                    } )
                )
            } ),
            title: this.util.format( 'Edit %s', this.label )
        } )
        .on( 'shown', () => this.createProperties.forEach( property => this.populateModalField( property ) ) )
        .on( 'submit', data => this.edit(data) )
        .on( 'hidden', () => this.modelToEdit = undefined )
    },

    template: require('../templates/resource')( require('handlebars') ),

    templates: Object.assign( {}, Table.prototype.templates, {
        create: require('../templates/createInstance')( require('handlebars') ),
        Date: require('../templates/form/Date')( require('handlebars') ),
        Float: require('../templates/form/Text')( require('handlebars') ),
        Integer: require('../templates/form/Text')( require('handlebars') ),
        Text: require('../templates/form/Text')( require('handlebars') ),
    } ),

    update( resource ) {
        this.resource = resource

        this.items.reset( null )
        this.fields = [ ]
        this.$( this.templateData.header.children('tr')[0] ).empty()

        this.createItems()

        this.items.on( 'reset', () => { this.templateData.subHeading.text( this.label ) } )
        
        this.fetchItems().show()
    }

} )

module.exports = Resource
