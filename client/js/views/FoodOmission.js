module.exports = Object.assign( {}, require('./__proto__'), {

    $: require('jquery'),

    Foods: require('../models/Food'),

    initializeFoodOmission() {      
        return this.Foods.get()
        .then( () => {
            if( ! this.Foods.data.length ) return Promise.resolve()

            const data = this.Foods.data.map( ( food, i ) => Object.assign( { id: i }, food ) ),
                  renderer =  data => 
                    data.produceid
                        ? `<span class="${data.producefamilyid ? 'produce-in-family' : ''}">${data.name}</span>`
                        : `<span class="produce-family">All ${data.name}</span>`

            this.omission = this.$('#omission').magicSuggest( {
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

            this.omission.val = value =>
                value ? this.omission.setSelection( value ) : this.omission.getSelection()

            return Promise.resolve()
        } )
        .catch( this.Error )
    }

} )