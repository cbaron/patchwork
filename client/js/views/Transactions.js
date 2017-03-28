module.exports = Object.assign( {}, require('./__proto__'), {

    clear() { this.els.transactions.innerHTML = '' },

    events: {
        list: 'click'
    },

    model: Object.create( require('../models/__proto__'), { resource: { value: 'csaTransaction' } } ),

    onListClick( e ) {
        if( this.currentSelection ) this.currentSelection.classList.remove('selected')
        
        const el = e.target
        this.currentSelection = el
        el.classList.add( 'selected' )
        this.emit( 'selected', { customer: this.customer, share: this.MemberSeason.data.find( season => season.id == el.getAttribute('data-id') ) } )
    },

    templates: {
        Transaction: require('./templates/CsaTransaction')
    },

    update( { customer, share } ) {
        this.customer = customer
        this.share = share
      
        this.clear()

        this.model.get( { query: { memberShareId: share.membershareid } } )
        .then( () => this.model.data.forEach( csaTransaction => this.slurpTemplate( { template: this.templates.Transaction( csaTransaction ), insertion: { el: this.els.transactions } } ) ) )
        .then( () => this.show() )
        .catch( this.Error )
    }

} )
