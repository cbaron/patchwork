module.exports = Object.assign( {}, require('./__proto__'), {


    clear() { this.els.entries.innerHTML = '' },

    events: {
        list: 'click'
    },

    model: Object.create( require('../models/__proto__'), { resource: { value: 'journal' } } ),

    onListClick( e ) {
        if( this.currentSelection ) this.currentSelection.classList.remove('selected')
        
        const el = e.target
        this.currentSelection = el
        el.classList.add( 'selected' )
        this.emit( 'selected', { customer: this.customer, share: this.MemberSeason.data.find( season => season.id == el.getAttribute('data-id') ) } )
    },

    templates: {
        share: share => `<li data-id="${share.id}" class="cell">${share.label}</li>`
    },

    update( customer ) {
        this.customer = customer
      
        this.clear()

        this.model.get( { query: { memberid: this.customer.member.id } } )
        //.then( () => this.model.data.forEach( entry => this.slurpTemplate( { template: this.templates.entry( entry ), insertion: { el: this.els.entries } } ) ) )
        .catch( this.Error )
    }

} )
