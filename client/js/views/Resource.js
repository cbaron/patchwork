var Table = require('./util/Table'),
    Resource = function() {
        this.spinner = new this.Spinner( {
            color: '#fff',
            length: 15,
            scale: 0.25,
            width: 5
        } ).spin()
        return Table.apply( this, arguments )
    }

Object.assign( Resource.prototype, Table.prototype, {

    Instance: require('../models/Instance'),

    ItemView: require('./InstanceRow'),

    Spinner: require('../spin'),

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
        this.createProperties.forEach( property => {
            if( property.fk && this[ property.fk.table + "Typeahead" ] ) { data[ property.property ] = this[ property.fk.table + "Typeahead" ].id }
            if( property.range === "File" ) { data[ property.property ] = this[ property.property + "File" ] }
        } )

        this.modalView.templateData.confirmBtn.append( this.spinner.spin().el ).addClass('has-spinner')

        this.$.ajax( {
            headers: { accept: 'application/json' },
            contentType: 'application/json',
            data: JSON.stringify( data ),
            method: 'POST',
            url: this.util.format( "/%s", this.resource ),
        } )
        .done( ( response, textStatus, jqXHR ) => {
            if( this.items.length === 0 && this.fields === undefined ) this.setFields( response )
            this.items.add( response )
            this.modalView.templateData.confirmBtn.removeClass('has-spinner')
            this.spinner.stop()
            this.modalView.hide( { reset: true } )
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
            this.modalView.hide( { reset: true } )
        } )
    },

    edit( data ) {

        var modelAttrs = { }

        this.createProperties.forEach( property => {
            if( property.fk ) {
                if( ! this[ property.fk.table + "Typeahead" ] ) { delete data[ property.property ]; return }
                data[ property.property ] = this[ property.fk.table + "Typeahead" ].id
                this.modelToEdit.get( this.util.format( '%s.%s', property.fk.table, property.fk.recorddescriptor ) ).id = this[ property.fk.table + "Typeahead" ].id
                this.modelToEdit.get( this.util.format( '%s.%s', property.fk.table, property.fk.recorddescriptor ) )
                    .value = this[ property.fk.table + "Typeahead" ][property.fk.recorddescriptor]
            } else if( property.range === "File" ) {                
                data[ property.property ] = this[ property.property + "File" ]
                if( this[ property.property + "File" ] && this[ property.property + "File" ].length ) {
                    this.modelToEdit.get( property.property ).src = this[ property.property + "File" ]
                }
            }
            else { modelAttrs[ property.property ] = data[ property.property ] }
            
        } )
        
        this.$.ajax( {
            headers: { accept: 'application/json' },
            contentType: 'application/json',
            data: JSON.stringify( data ),
            method: 'PATCH',
            url: this.util.format( "/%s/%d", this.resource, this.modelToEdit.id )
        } )
        .done( ( response, textStatus, jqXHR ) => {
            this.modelToEdit.set( modelAttrs, { silent: true } )
            this.modelToEdit.trigger( 'change', this.modelToEdit )
            this.modelToEdit = undefined
            this.modalView.hide( { reset: true } )
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

    getImage( model ) {
        var imageEl = new Image();
       
        imageEl.style.height = '50px' 
        imageEl.onload = () => {
            if( this.itemViews[ model.id ] ) {
                this.itemViews[ model.id ].templateData[ model.column ].html( imageEl )
                this.itemViews[ model.id ].retrievedImage( model.column )
            }
            if( this.items.get( model.id ) ) this.items.get( model.id ).get( model.column ).imageEl = imageEl
            
            window.setTimeout( () => this.imageLoader.remove(model), 100 )
        }
        
        imageEl.onerror = () => window.setTimeout( () => this.imageLoader.remove(model), 100 )

        imageEl.src = this.util.format( '/file/%s/%s/%d', this.resource, model.column, model.id )
    },

    getLabel( property ) {
        return this.format.capitalizeFirstLetter( property )
    },

    initDatepicker( property ) {
        this.$( '#' + property.property ).datetimepicker( { format: "YYYY-MM-DD", minDate: this.moment() } )
    },

    initFileUploader( property ) {
        var $el = this.modalView.templateData[ property.property ]

        this[ property.property + "File" ] === undefined

        $el.on( 'change', e => {
            var reader = new FileReader(),
                btn = this.modalView.templateData[ property.property + "Btn" ]
                    
            btn.addClass('has-spinner').append( this.spinner.spin().el )

            reader.onload = ( evt ) => {
                this[ property.property + "File" ] = evt.target.result
                btn.removeClass('has-spinner')
                this.spinner.stop()
                this.$( '#' + property.property + "-preview" ).attr( { src: evt.target.result } )
            }
            
            reader.readAsDataURL( e.originalEvent.target.files[0] )
        } )
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

    populateModalField( property ) {
        var el = this.modalView.templateData[ property.property ], img

        if( ! el ) return
        if( property.range === 'File' ) {
            this.initFileUploader( property )
            img = this.itemViews[ this.modelToEdit.id ].templateData[ property.property ].find('img')
            if( img.length ) this.modalView.templateData[ property.property + "Preview" ].replaceWith( img.clone(false).attr( { id: property.property + "-preview" } ) )
            return
        }
        if( !property.fk || !property.descriptor ) return el.val( this.modelToEdit.get( property.property ) )
        
        this.initTypeahead( property ) 
        el.typeahead( 'val', this.modelToEdit.get( property.columnName ).value )
    },

    postRender() {
        this.imageLoader = new ( require('backbone').Collection )()
            .on( 'add', () => { if( this.imageLoader.length === 1 ) this.processImageLoader() } )
            .on( 'remove', () => { if( this.imageLoader.length ) this.processImageLoader() } )

        Table.prototype.postRender.call(this)
        this.items.on( 'reset', () => this.templateData.subHeading.text( this.label ) )
    },

    processImageLoader() {
        var id = this.imageLoader.at(0).id,
            columns = this.imageLoader.at(0).get('columns')

        columns.forEach( column => this.getImage( { 'id': id, 'column': column } ) )
    },

    requiresRole: 'admin',

    setFields( instance ) {
        var keys = Object.keys( instance ), width = Math.floor( 100 / keys.length )
        this.fields = keys.map( key => {
            var field = { name: key, label: this.format.capitalizeFirstLetter( key ), width: width }
            this.$( this.templateData.header.children('tr')[0] ).append( this.templates.headerColumn.call( this, field ) )
            return field
        } )
    },

    showCreateDialog() {

        var onShown = () => this.createProperties.forEach( property => {
                if( property.fk && property.descriptor !== undefined ) this.initTypeahead( property )
                else if( property.range === "Date" ) this.initDatepicker( property )
                else if( property.range === "File" ) this.initFileUploader( property )
             } ),
            onSubmit = data => this.create(data)

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
        .on( 'shown', onShown )
        .on( 'submit', onSubmit )
        .on( 'hidden', () => {
            this.modalView.removeListener( 'submit', onSubmit )
            this.modalView.removeListener( 'shown', onShown )
        } )

    },

    showDeleteDialog() {

        var onSubmit = () => this.deleteModel()
        
        this.modelToDelete = this.hoveredModel

        this.modalView.show( {
            body: this.util.format( 'Are you sure you would like to delete %s?', this.modelToDelete.get( this.recordDescriptor ) ),
            confirmText: 'Yes',
            title: this.util.format( 'Delete %s', this.label )
        } )
        .on( 'submit', onSubmit )
        .on( 'hidden', () => {
            this.modelToDelete = undefined
            this.modalView.removeListener( 'submit', onSubmit )
        } )
    },

    showEditDialog() {

        var populateModalFields = () => this.createProperties.forEach( property => this.populateModalField( property ) ),
            onSubmit = data => this.edit(data)

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
        .on( 'shown', populateModalFields )
        .on( 'submit', onSubmit )
        .on( 'hidden', () => {
            this.modalView.removeListener( 'shown', populateModalFields )
            this.modalView.removeListener( 'submit', onSubmit )
            this.modelToEdit = undefined
        } )
    },

    template: require('../templates/resource')( require('handlebars') ),

    templates: Object.assign( {}, Table.prototype.templates, {
        create: require('../templates/createInstance')( require('handlebars') ),
        Date: require('../templates/form/Date')( require('handlebars') ),
        File: require('../templates/form/File')( require('handlebars') ),
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
