module.exports = Object.assign( {}, require('./__proto__'), {

    Customer: require('../models/Customer'),
    Delivery: require('../models/Delivery'),

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
                this.emit( 'customerSelected', this.Customer.data.find( datum => datum.person.data[ this.attr ] === term ) )
            }

        } )
    },

    postRender() {
        this.initAutoComplete()

        this.on( 'customerSelected', customer => {
            this.views.customerInfo.update( customer )
            this.views.seasons.update( customer )
        } )

        this.views.seasons.on( 'selected', data => {
            this.Delivery.get( {
                query: {
                    membershareid: data.share.membershareid,
                    deliveryoptionid: { operation: 'join', value: { table: 'deliveryoption', column: 'id' } },
                    groupdropoffid: { operation: 'join', value: { table: 'groupdropoff', column: 'id' } }
                }
            } )
            .then( () => {
                Object.assign( data, { delivery: this.Delivery } )
                this.views.orderOptions.update( data )
                this.views.weekOptions.update( data )
            } )
        } )

        return this
    },

    requiresLogin: true,

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
