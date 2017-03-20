module.exports = Object.assign( {}, require('./__proto__'), {

    handleAutoCompleteResults( column, suggest ) {
        if( this.model.data.length ) {
            const suggestions = this.model.data.map( person => person[ column ] )
            this.persons = this.model.data
            return suggest( suggestions )
        }
    },

    model: require('../models/Person'),

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
                const personData = this.persons.find( person => person.name === term || person.email === term )
                this.emit( 'customerSelected', personData )
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
        return this.model.get( { query: { [attr]: { operation: '~*', value: term }, 'personid': { operation: 'join' } } } )
        .then( () => {
            if( ! this.model.data.length ) return Promise.resolve( false )
                
            this.handleAutoCompleteResults( 'name', suggest )
            return Promise.resolve( true )
        } )
    }

} )
