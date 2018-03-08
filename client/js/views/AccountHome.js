module.exports = Object.assign( {}, require('./__proto__'), {

    Customer: require('../models/Customer'),
    Delivery: require('../models/Delivery'),

    patchMemberShare() {
        console.log( 'patchMemberShare' )
        console.log( this.selectedCustomer )
        console.log( this.memberShareId )
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

        console.log( Object.assign( {}, {
            adjustment: this.views.sharePatch.getPatchData(),
            memberShareId: this.memberShareId,
            name: this.selectedCustomer.person.data.name,
            orderOptions: this.views.orderOptions.getPatchData(),
            shareLabel: this.selectedShare.label,
            weekOptions: weekPatch.allRemoved,
            weekDetail,
            to: emailTo
        }) )

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
            this.Toast.showMessage( 'success', 'Order Updated! You will receive a confirmation email shortly.' )

            Object.keys( this.views ).forEach( view => {
                if( view.els.editSummary && !view.isHidden( view.els.editSummary ) ) view.els.editSummary.classList.add('hidden')
            } )

            this.els.container.scrollIntoView( { behavior: 'smooth' } )
            this.views.seasons.select( this.memberShareId )
        } )
        .catch( e => {
            console.log( e.stack || e )
            this.Toast.showMessage( 'error', 'Update Failed. Please contact us for assistance.' )
        } )
    },

    postRender() {
        console.log( this.user )
        console.log( this.path )
        console.log( this.user.get('email') )
        this.Customer.get( { query: { email: this.user.get('email'), 'id': { operation: 'join', value: { table: 'member', column: 'personid' } } } } )
        .then( () => {
            console.log( this.Customer.data )
            const customer = this.Customer.data[0]
            if( !customer ) return

            this.selectedCustomer = customer
            this.views.customerInfo.reset( customer )
            this.views.seasons.update( customer )
            this.views.orderOptions.hide()
            this.views.weekOptions.hide()
            this.views.sharePatch.reset()

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
        } )

        return this
    },

    requiresLogin: true

} )