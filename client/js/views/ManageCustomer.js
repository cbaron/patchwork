module.exports = Object.assign( {}, require('./__proto__'), {

    AutoComplete: require('../AutoComplete'),

    Customer: require('../models/Customer'),
    Delivery: require('../models/Delivery'),

    initAutoComplete() {
        const myAutoComplete = new this.AutoComplete( {
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

        this.els.customerInput.focus()
    },

    patchMemberShare() {
        this.Xhr( {
            method: 'patch',
            resource: 'member-order',
            data: JSON.stringify( {
                orderOptions: this.views.orderOptions.getPatchData(),
                weekOptions: this.views.weekOptions.getPatchData(),
                adjustment: this.views.sharePatch.getPatchData()
            } )
        } )
        .then( () => {
            this.Toast.show( 'success', 'Order Updated' )
            this.emit( 'customerSelected', this.selectedCustomer )
        } )
        .catch( e => {
            console.log( e.stack || e )
            this.Toast.show( 'error', 'Update Failed' )
        } )
    },

    postRender() {
        this.initAutoComplete()

        this.on( 'customerSelected', customer => {
            this.views.customerInfo.reset( customer )
            this.views.seasons.update( customer )
            this.views.orderOptions.hide()
            this.views.weekOptions.hide()
            this.views.transactions.hide()
        } )

        this.views.seasons.on( 'selected', data => {
            this.Delivery.get( {
                query: {
                    membershareid: data.share.membershareid,
                    deliveryoptionid: { operation: 'join', value: { table: 'deliveryoption', column: 'id' } },
                    groupdropoffid: { operation: 'leftJoin', value: { table: 'groupdropoff', column: 'id' } }
                }
            } )
            .then( () => {
                //TODO:If no delivery, Toast, or some UI
                Object.assign( data, { delivery: this.Delivery } )
                this.views.orderOptions.update( data ).then( () => this.views.sharePatch.setOriginalWeeklyPrice( this.views.orderOptions.calculateWeeklyPrice() ) ).catch(this.Error)
                this.views.weekOptions.update( data ).then( () => this.views.sharePatch.setWeeksAffected( this.views.weekOptions.getWeeksAffected() ) ).catch(this.Error)
                this.views.transactions.update( data )
            } )
        } )

        this.views.orderOptions.on( 'deliveryChanged', data => this.views.weekOptions.updateDelivery( data ) )

        this.views.orderOptions.on( 'reset', model => {
            this.views.weekOptions.update( model )
            this.views.sharePatch.onOptionsReset()
        } )

        this.views.orderOptions.on( 'adjustment', data => this.views.sharePatch.onOptionsUpdate( data ) )

        this.views.sharePatch.on( 'patchMemberShare', () => this.patchMemberShare() )

        return this
    },

    requiresLogin: true,
    
    requiresRole: 'admin',

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
