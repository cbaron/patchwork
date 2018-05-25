module.exports = { ...require('./__proto__'),

    AutoComplete: require('../AutoComplete'),

    Customer: require('../models/Customer'),

    focus() { this.els.customerInput.focus() },

    postRender() {
        let searchResults
        new this.AutoComplete( {
            delay: 500,
            selector: this.els.customerInput,
            minChars: 3,
            cache: false,
            renderItem: ( item, search ) => 
                `<div class="autocomplete-suggestion" data-id="${item.id}">${item.name} - ${item.email}</div>`,
            source: async ( term, suggest ) => {
                term = term.trim()
                let personIds = [ ]

                const attrResults = await Promise.all( [ 'name', 'email', 'secondaryEmail' ].map( attr =>
                    this.search( attr, term ).catch( this.Error ) 
                ) )

                searchResults = attrResults.reduce( ( memo, curr ) => {
                    curr = curr.filter( customer => {
                        if( personIds.includes( customer.person.data.id ) ) return false
                        personIds.push( customer.person.data.id )
                        return true
                    } )

                    return [ ...memo, ...curr ]
                }, [ ] )

                return suggest( searchResults.map( customer => customer.person.data ) )
            },
            onSelect: ( e, term, item ) => {
                this.selectedCustomer = searchResults.find( customer => customer.person.data.id == e.target.getAttribute('data-id') )            
                this.emit( 'customerSelected', this.selectedCustomer )
            }
        } )    

        return this
    },

    async search( attr, term, suggest ) {
        await this.Customer.get( { query: { [attr]: { operation: '~*', value: term }, 'id': { operation: 'join', value: { table: 'member', column: 'personid' } } } } )    
        return this.Customer.data
    }
}