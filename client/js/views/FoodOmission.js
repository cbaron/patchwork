module.exports = Object.assign( {}, require('./__proto__'), {

    $: require('jquery'),

    Foods: require('../models/Food'),

    clear() { this.ms.clear() },

    getMagicSuggest() { return this.ms },

    initializeFoodOmission() {      
        return this.Foods.get()
        .then( () => {
            if( ! this.Foods.data.length ) return Promise.resolve()

            const data = this.Foods.data.map( ( food, i ) => Object.assign( { id: i }, food ) ),
                  renderer =  data => 
                    data.produceid
                        ? `<span class="${data.producefamilyid ? 'produce-in-family' : ''}">${data.name}</span>`
                        : `<span class="produce-family">All ${data.name}</span>`

            this.ms = this.$( this.els.container ).magicSuggest( {
                allowFreeEntries: false,
                data,
                highlight: false,
                placeholder: '',
                maxDropHeight: 200,
                maxSelection: 1,
                renderer,
                selectionRenderer: renderer,
                valueField: 'id'
            } )

            this.ms.val = value =>
                value ? this.ms.setSelection( value ) : this.ms.getSelection()

            this.$(this.ms).on( 'selectionchange', ( e, m ) => this.emit( 'selectionChange', e, m ) )

            return Promise.resolve()
        } )
        .catch( this.Error )
    },

    removeHelperText() { this.ms.helper[0].remove() },

    setPlaceholder( text ) { this.ms.input.attr( 'placeholder', text ) },

    unstyle() { this.ms.container.removeClass('form-control') }

} )
