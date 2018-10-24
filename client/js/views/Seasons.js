module.exports = Object.assign( {}, require('./__proto__'), {

    Views: {
        orderDeleteButtonFlow() {
            return { 
                model: Object.create( this.Model ).constructor( {
                    states: {
                        start: [ { name: 'save', text: 'Delete Order', class:'delete-btn', nextState: 'confirm' } ],
                        confirm: [
                            { name: 'confirmBtn', class:'delete-btn', text: 'Are You Sure?', emit: true, nextState: 'start' },
                            { name: 'cancel', class:'reset-btn', nextState: 'start', text: 'Cancel' }
                        ]
                    }
                } )
            }
        }
    },

    MemberSeason: require('../models/MemberSeason'),

    clear() {
        this.els.list.innerHTML = ''
        this.els.balanceNotice.classList.add('fd-hidden')
        this.views.orderDeleteButtonFlow.hideSync()
        this.els.totals.classList.add('fd-hidden')
    },

    async deleteOrder() {
        await this.Xhr( { method: 'DELETE', resource: 'delete-order', id: this.currentSelection.getAttribute('data-id') } )
        this.Toast.showMessage( 'success', 'Order deleted.' )
        this.currentSelection.remove()
        if( !this.els.list.firstChild ) { this.emit('noSeasons'); return this.showNoSeasons() }
        this.els.list.firstChild.click()
    },

    events: {
        list: 'click',
        payment: 'click',
        views: {
            buttonFlow: [
                [ 'confirmBtnClicked', function() { this.deleteOrder().catch( this.Error ) } ]
            ]
        }
    },

    insertShareLabels() {
        const countPerShare = { }
        if( !this.MemberSeason.data.length ) return this.showNoSeasons()

        this.MemberSeason.data.forEach( season => {
            countPerShare[ season.name ] ? ++countPerShare[ season.name ] : countPerShare[ season.name ] = 1
            if( countPerShare[ season.name ] > 1 ) season.count = countPerShare[ season.name ]

            this.slurpTemplate( { template: this.templates.ShareBox( season ), insertion: { el: this.els.list } } )
        } )
    },

    onListClick( e ) {
        if( ! e.target.closest('div.share-label') ) return
            
        if( this.currentSelection ) this.currentSelection.classList.remove('selected')
        
        const el = e.target.closest('div.share-label')

        this.currentSelection = el
        el.classList.add( 'selected' )
        this.emit( 'selected', { customer: this.customer, share: this.MemberSeason.data.find( season => season.membershareid == el.getAttribute('data-id') ) } )
    },

    onPaymentClick() {
        this.emit('payBalance')
    },

    select( memberShareId ) {
        this.els.list.querySelector(`div.share-label[data-id="${memberShareId}"]`).click()
    },

    showNoData() {
        this.els.totals.classList.add('fd-hidden')
        this.els.noDataMessage.classList.remove('fd-hidden')
        this.views.orderDeleteButtonFlow.showSync()
    },

    showNoSeasons() {
        this.clear()
        this.slurpTemplate( { template: `<li>No orders.</li>`, insertion: { el: this.els.list } } )
    },

    templateOpts() { return { isAdmin: window.location.pathname.split('/').includes('admin-plus') } },

    templates: {
        ShareBox: require('./templates/ShareBox')
    },

    update( customer ) {
        this.customer = customer
      
        this.clear()
         
        return this.MemberSeason.get( { query: { memberid: customer.member.data.id, shareid: { operation: 'join', value: { table: 'share', column: 'id' } } } } )
        .then( () => this.insertShareLabels() )
        .then( () => this.show() )
        .catch( this.Error )
    },

    updateBalanceNotice( amount ) {
        this.els.balanceNotice.classList.toggle( 'fd-hidden', amount <= 0 )
        this.els.balanceAmount.textContent = this.Currency.format( amount )
    },

    updateWeeklyPriceAndTotal( amount, label, weeks ) {
        this.els.noDataMessage.classList.add('fd-hidden')
        this.els.seasonLabel.textContent = label
        this.els.weeklyPrice.textContent = `${this.Currency.format(amount)}/week`
        this.els.weekNumber.textContent = `Number of Weeks: ${weeks}`
        this.els.orderTotal.textContent = `Order Total: ${this.Currency.format( amount * weeks )}`
        this.els.totals.classList.remove('fd-hidden')
    }

} )
