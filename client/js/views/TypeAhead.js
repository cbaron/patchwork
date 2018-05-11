module.exports = Object.assign( {}, require('./__proto__'), {

    AutoComplete: require('./lib/AutoComplete'),

    Resources: {
        Document: {
            Model: Object.assign( { }, require('../models/Document') ),
            renderItem: ( item, search ) => `<div class="autocomplete-suggestion" data-val="${item.label || item.name}" data-id="${item.id}">${item.label || item.name}</div>`,
            search( term, suggest ) {
                return this.Xhr( { method: 'get', qs: this.getQs( term ), resource: this.Resource } )
                .then( documents => {
                    if( ! Array.isArray( documents ) ) documents = [ documents ]
                    if( documents.length === 0 ) return Promise.resolve( false )
                
                    this.resource.Model.constructor( documents, { storeBy: [ 'id' ] } )
                    suggest( this.resource.Model.data )
                    return Promise.resolve( true )
                } )
            }
        }
    },

    clear( suppressEmit ) {
        this.els.input.value = ''
        if( !suppressEmit ) this.emit('cleared')
    },

    events: {
        input: 'input'
    },
    
    focus() { this.els.input.focus() },

    getSelectedId() {
        if( !this.selectedModel ) return undefined

        return this.selectedModel._id || this.selectedModel.id
    },

    getQs( term ) {
        const attr = this.Resource === 'deliveryroute' ? 'label' : 'name'
        return JSON.stringify( Object.assign( {}, { [ attr ]: { operation: '~*', value: term } } ) )
    },

    initAutoComplete( initialId ) {
        new this.AutoComplete( {
            delay: 500,
            selector: this.els.input,
            minChars: 1,
            cache: false,
            renderItem: this.resource.renderItem,
            source: ( term, suggest ) => {
                Reflect.apply( this.resource.search, this, [ term.trim(), suggest ] )
                .then( found => found ? Promise.resolve(true) : suggest([]) )
                .catch( this.Error )
            },
            onSelect: ( e, term, item ) => {
                const store = this.resource.Model.store;
                this.selectedModel = ( store.id ? store.id : store['_id'] )[ item.getAttribute( 'data-id' ) ]
                this.emit( 'itemSelected', this.selectedModel )
            }
        } )

        if( initialId ) {
            this.Xhr( { method: 'get', resource: this.Resource, id: initialId } )
            .then( document => {
                document = Array.isArray( document ) ? document[0] : document
                this.selectedModel = document
                this.els.input.value = document.label || document.name
                return Promise.resolve()
            } )
            .catch( this.Error )
        }
    },

    onInputInput() {
        if( this.els.input.value.trim() === "" ) this.emit('cleared')
    },

    postRender() {
        this.Resource = this.Resource
        this.Type = this.Type
        this.resource = this.Resources[ this.Type ]
       
        if( this.resource && this.Resource ) this.initAutoComplete()
        
        return this
    },

    setResource( resource ) {
        this.Resource = resource
        this.resource = this.Resources[ this.Type ]
        return this
    }
} )
