module.exports = Object.assign( {}, require('./__proto__'), {

    Customer: require('../models/Customer'),
    Delivery: require('../models/Delivery'),

    events: {
        customerLoginBtn: 'click'
    },

    patchMemberShare() {
        const weekPatch = this.views.weekOptions.getPatchData();
        const email = this.selectedCustomer.person.data.email;
        const secondaryEmail = this.selectedCustomer.person.data.secondaryEmail;
        const emailTo = [email];
        let weekDetail = ``;

        if( secondaryEmail && email !== secondaryEmail ) {
            emailTo.push(secondaryEmail)
        }

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
                previousBalance: this.views.sharePatch.balance,
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

    async onCustomerLoginBtnClick() {
        try {
            const data = await this.Xhr( { method: 'PATCH', resource: 'customer-login', data: JSON.stringify( { customerId: this.selectedCustomer.person.data.id } ) } )
            this.user.set( data )
            this.user.trigger( 'loginAsCustomer' )
        } catch( err ) { this.Error( err ) }
    },

    postRender() {

        this.views.memberTypeahead.focus()

        this.views.memberTypeahead.on( 'customerSelected', customer => {
            this.views.seasons.views.orderDeleteButtonFlow.hideSync()
            this.selectedCustomer = customer
            this.views.customerInfo.reset( customer )
            this.views.storeOrders.update( customer )
            this.views.seasons.update( customer )
            this.views.orderOptions.hide()
            this.views.weekOptions.hide()
            this.views.transactions.hide()
            this.views.sharePatch.reset()
            this.views.seasons.els.totals.classList.add('fd-hidden')
            this.els.customerLogin.classList.remove('fd-hidden')
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
                if( !this.Delivery.data.length ) {
                    this.views.orderOptions.hide()
                    this.views.weekOptions.hide()
                    this.views.transactions.hide()
                    this.views.sharePatch.hide()
                    return this.views.seasons.showNoData()
                }

                Object.assign( data, { delivery: this.Delivery } )

                this.views.orderOptions.update( { ...data, isAdmin: true } ).then( () => {
                    this.views.seasons.els.totals.classList.remove('fd-hidden')
                    this.views.seasons.updateWeeklyPriceAndTotal( this.views.orderOptions.originalWeeklyPrice, this.selectedShare.label, this.views.weekOptions.getTotalDates() )
                    this.views.sharePatch.setOriginalWeeklyPrice( this.views.orderOptions.originalWeeklyPrice, this.views.weekOptions.getTotalDates() )
                    this.views.seasons.views.orderDeleteButtonFlow.showSync()
                } ).catch(this.Error)

                this.views.weekOptions.update( { ...data, isAdmin: true } ).then( () => this.views.sharePatch.setWeeksAffected( this.views.weekOptions.getWeeksAffected() ) ).catch(this.Error)
                this.views.transactions.update( data ).then( () => this.views.sharePatch.balance = this.views.transactions.model.getBalance() ).catch( this.Error )
            } )
        } )

        this.views.seasons.on( 'noSeasons', () =>
            Promise.all( [ 'orderOptions', 'weekOptions', 'sharePatch', 'transactions' ].map( view => this.views[ view ].hide() ) )
            .catch( this.Error )
        )

        this.views.orderOptions.on( 'deliveryChanged', data => {
            this.views.sharePatch.setWeeksAffected( this.views.weekOptions.getWeeksAffected() )
            this.views.sharePatch.onWeeksReset()
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
    
    requiresRole: 'admin'    

} )
