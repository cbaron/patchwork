module.exports = Object.assign( {}, require('./__proto__'), {

    handleAutoCompleteResults( column, suggest ) {
        console.log( 'handleAutoCompleteResults' )
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
                term = term.toLowerCase()
                
                return this.model.get( { query: { name: { operation: '~*', value: term } } } )
                .then( () => {
                    console.log( 'like query response' )
                    console.log( this.model )
                    console.log( this.model.data )
                    
                    /*if( this.model.data.length ) {
                        const names = this.model.data.map( person => person.name )
                        this.matches = this.model.data
                        return suggest( names )
                    }*/
                    if( this.model.data.length ) return this.handleAutoCompleteResults( 'name', suggest )

                    return this.model.get( { query: { email: { operation: '~*', value: term } } } )
                    .then( () => {
                        /*if( this.model.data.length ) {
                            const emails = this.model.data.map( person => person.email )
                            console.log( emails )
                            this.matches = this.model.data
                            return suggest( emails )
                        }*/

                        if( this.model.data.length ) return this.handleAutoCompleteResults( 'email', suggest )

                        return this.model.get( { query: { secondaryEmail: { operation: '~*', value: term } } } )
                        .then( () => {
                            if( this.model.data.length ) return this.handleAutoCompleteResults( 'secondaryEmail', suggest )
                        } )

                    } )

                } )
                .catch( e => console.log( e.stack || e ) )

            },
            onSelect: ( e, term, item ) => {
                const personData = this.persons.find( person => person.name === term || person.email === term )
                console.log( personData )
                this.emit( 'customerSelected', personData )
            }

        } )
    },

    postRender() {
        this.initAutoComplete()

        this.on( 'customerSelected', personData => {
            this.views[ 'customerInfo' ].getTableData( personData )
        } )

        return this
    },

    requiresLogin: true,

    template: require('../templates/manageCustomer')

} )