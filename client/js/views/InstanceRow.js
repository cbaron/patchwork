var ListItem = require('./util/ListItem'),
    InstanceRow = function() { 
        this.files = [ ]
        return ListItem.apply( this, arguments )
    }

Object.assign( InstanceRow.prototype, ListItem.prototype, {

    getFieldValue( field ) {
        
        var modelValue = this.model.get(field),
            isFile = false
        
        if( modelValue === null ) return ''

        if( typeof modelValue === "object" && ( modelValue.type === "file" || modelValue.type === "Buffer" ) ) {
            if( modelValue.src ) { return this.$('<img/>').attr( { src: modelValue.src } ).css( { height: '50px' } ) }
            else if( modelValue.imageEl ) { return modelValue.imageEl }
            else { isFile = true; this.files.push( field ); return '<span class="glyphicon glyphicon-picture"></span>' }
        }

        return ( typeof modelValue === "object" && modelValue !== null )
            ? modelValue.value
            : modelValue
    },

    getTemplateOptions() {
        return {
            id: this.model.id,
            values: this.fields.map( field => ( { name: field.name, value: this.getFieldValue( field.name ), width: field.width } ) )
        }
    },

    loadFileIfVisible() {        
        var top = this.templateData.container[0].getBoundingClientRect().top,
            visible = ( top >= 0 && top <= (window.innerHeight || document.documentElement.clientHeight) ),
            imageLoaderModel = { id: this.model.id, columns: this.files }
        
        if( visible ) this.imageLoader.add( imageLoaderModel )
    },

    postRender() {
        ListItem.prototype.postRender.call(this)
        this.model.on( 'change', () =>
            Object.keys( this.model.attributes ).forEach( field =>
                this.templateData[ field ].html( this.getFieldValue( field ) )
            ) )
        
        if( this.files.length ) this.$(window).on( 'scroll.throttledLoad', this.throttledLoad.bind(this) )
    },

    retrievedImage( field ) {
        this.files = this._( this.files ).reject( file => file === field )
        if( this.files.length === 0 ) this.$(window).off( 'scroll.throttledLoad' )
    },

    size() { if( this.files.length ) this.loadFileIfVisible() },

    throttledLoad() { this._.throttle( this.loadFileIfVisible(), 500 ) },

    template: require('../templates/instanceRow')( require('handlebars') )

} )

module.exports = InstanceRow
