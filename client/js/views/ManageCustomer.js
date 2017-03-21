module.exports = Object.assign( {}, require('./__proto__'), {

    model: require('../models/ManageCustomer'),

    initAutoComplete() {
        const myAutoComplete = new autoComplete( {
            selector: 'input#customer',
            minChars: 3,
            source: ( term, suggest ) => {
                this.search( 'name', term, suggest )
                .then( found => found ? Promise.resolve(true) : this.search( 'email', term, suggest ) )
                .then( found => found ? Promise.resolve(true) : this.search( 'secondaryEmail', term, suggest ) )
                .catch( this.Error )
            },
            onSelect: ( e, term, item ) => {
                this.emit( 'customerSelected', this.model.data.find( person => person.data[ this.attr ] === term ) )
            }

        } )
    },

    postRender() {
        this.initAutoComplete()

        this.on( 'customerSelected', personData => {
            this.views.customerInfo.getTableData( personData )
        } )

        return this
    },

    requiresLogin: true,

    search( attr, term, suggest ) {
        return this.model.get( { query: { [attr]: { operation: '~*', value: term }, 'id': { operation: 'join', value: { table: 'member', column: 'personid' } } } } )
        .then( () => {
            if( ! this.model.data.length ) return Promise.resolve( false )
    
            this.attr = attr            
            suggest( this.model.data.map( person => person.data[ attr ] ) )
            return Promise.resolve( true )
        } )
    }

} )
