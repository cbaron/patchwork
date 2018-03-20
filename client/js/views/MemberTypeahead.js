module.exports = Object.assign( {}, require('./__proto__'), {

    AutoComplete: require('../AutoComplete'),

    Customer: require('../models/Customer'),

    focus() { this.els.customerInput.focus() },

    postRender() {
        new this.AutoComplete( {
            delay: 500,
            selector: this.els.customerInput,
            minChars: 3,
            cache: false,
            source: ( term, suggest ) => {
                this.search( 'name', term.trim(), suggest )
                .then( found => found ? Promise.resolve(true) : this.search( 'email', term, suggest ) )
                .then( found => found ? Promise.resolve(true) : this.search( 'secondaryEmail', term, suggest ) )
                .then( found => found ? Promise.resolve(true) : suggest([]) )
                .catch( this.Error )
            },
            onSelect: ( e, term, item ) => {
                this.selectedCustomer = this.Customer.data.find( datum => datum.person.data[ this.attr ] === term )
                this.emit( 'customerSelected', this.selectedCustomer )
            }

        } )

        return this
    },

    search( attr, term, suggest ) {
        return this.Customer.get( { query: { [attr]: { operation: '~*', value: term }, 'id': { operation: 'join', value: { table: 'member', column: 'personid' } } } } )
        .then( () => {
            if( ! this.Customer.data.length ) return Promise.resolve( false )
            
            this.attr = attr     
            suggest( this.Customer.data.map( datum => datum.person.data[ attr ] ) )
            return Promise.resolve( true )
        } )
    }
} )
