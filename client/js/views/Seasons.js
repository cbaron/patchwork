module.exports = Object.assign( {}, require('./__proto__'), {

    MemberSeason: require('../models/MemberSeason'),

    clear() { this.els.list.innerHTML = '' },

    events: {
        list: 'click'
    },

    onListClick( e ) {
        if( this.currentSelection ) this.currentSelection.classList.remove('selected')
        
        const el = e.target.closest('div.share-label')

        this.currentSelection = el
        el.classList.add( 'selected' )
        this.emit( 'selected', { customer: this.customer, share: this.MemberSeason.data.find( season => season.membershareid == el.getAttribute('data-id') ) } )
    },

    templates: {
        ShareBox: require('./templates/ShareBox')
    },

    update( customer ) {
        this.customer = customer
      
        this.clear()
         
        this.MemberSeason.get( { query: { memberid: customer.member.data.id, shareid: { operation: 'join', value: { table: 'share', column: 'id' } } } } )
        .then( () => this.MemberSeason.data.forEach( memberSeason => this.slurpTemplate( { template: this.templates.ShareBox( memberSeason ), insertion: { el: this.els.list } } ) ) )
        .then( () => this.show() )
        .catch( this.Error )
    }

} )
