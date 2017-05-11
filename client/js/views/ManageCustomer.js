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
        const weekPatch = this.views.weekOptions.getPatchData()

        let weekDetail = ``,
            emailTo = [ this.selectedCustomer.person.data.email ]

        if( this.selectedCustomer.person.data.secondaryEmail ) emailTo.push( this.selectedCustomer.person.data.secondaryEmail )

        if( weekPatch.addedDates.length || weekPatch.removedDates.length ) { weekDetail += ` ( ` }

        if( weekPatch.addedDates.length ) {
            const description = weekPatch.addedDates.map( date => date.slice(5) ).join(',')
            weekDetail += `Added Weeks: ${description}`
            if( weekPatch.removedDates.length ) { weekDetail += `, ` }
        }
        
        if( weekPatch.removedDates.length ) {
            const description = weekPatch.removedDates.map( date => date.slice(5) ).join(',')
            weekDetail += `Removed Weeks: ${description}`
        }
        
        if( weekPatch.addedDates.length || weekPatch.removedDates.length ) { weekDetail += ` ) ` }

        this.Xhr( {
            id: this.memberShareId,
            method: 'patch',
            resource: 'member-order',
            data: JSON.stringify( {
                adjustment: this.views.sharePatch.getPatchData(),
                memberShareId: this.memberShareId,
                name: this.selectedCustomer.person.data.name,
                orderOptions: this.views.orderOptions.getPatchData(),
                shareLabel: this.selectedShare.label,
                weekOptions: weekPatch.allRemoved,
                weekDetail,
                to: emailTo
            } )
        } )
        .then( () => {
            this.Toast.showMessage( 'success', 'Order Updated' )
            this.views.seasons.select( this.memberShareId )
        } )
        .catch( e => {
            console.log( e.stack || e )
            this.Toast.showMessage( 'error', 'Update Failed' )
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
            this.views.sharePatch.reset()
        } )

        this.views.seasons.on( 'selected', data => {
            this.views.sharePatch.reset()
            this.selectedShare = data.share
            this.memberShareId = this.selectedShare.membershareid

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
                this.views.orderOptions.update( data ).then( () => this.views.sharePatch.setOriginalWeeklyPrice( this.views.orderOptions.originalWeeklyPrice ) ).catch(this.Error)
                this.views.weekOptions.update( data ).then( () => this.views.sharePatch.setWeeksAffected( this.views.weekOptions.getWeeksAffected() ) ).catch(this.Error)
                this.views.transactions.update( data )
            } )
        } )

        this.views.orderOptions.on( 'deliveryChanged', data => {
            this.views.sharePatch.setWeeksAffected( this.views.weekOptions.getWeeksAffected() )
            this.views.weekOptions.updateDelivery( data )
        } )

        this.views.orderOptions.on( 'reset', model => {
            this.views.weekOptions.update( model )
            this.views.sharePatch.onOptionsReset()
        } )
        
        this.views.weekOptions.on( 'reset', model => this.views.sharePatch.onWeeksReset() )

        this.views.orderOptions.on( 'adjustment', data => this.views.sharePatch.onOptionsUpdate( data ) )
        this.views.weekOptions.on( 'adjustment', data => this.views.sharePatch.onWeekUpdate( data ) )

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
