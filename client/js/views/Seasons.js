module.exports = Object.assign( {}, require('./__proto__'), {

    MemberSeason: require('../models/MemberSeason'),

    clear() {
        this.els.list.innerHTML = ''
        this.els.balanceNotice.classList.add('fd-hidden')
    },

    events: {
        list: 'click',
        payment: 'click'
    },

    insertShareLabels() {
        const countPerShare = { }

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
    }

} )
