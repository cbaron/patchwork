module.exports = Object.assign( {}, require('./__proto__'), {

    MemberSeason: require('../models/MemberSeason'),

    clear() { this.els.list.innerHTML = '' },

    templates: {
        share: share => `<li data-id="${share.id}" class="cell">${share.label}</li>`
    },

    update( customer ) {
        this.customer = customer
      
        this.clear()
         
        this.MemberSeason.get( { query: { memberid: customer.member.data.id, shareid: { operation: 'join', value: { table: 'share', column: 'id' } } } } )
        .then( () => this.MemberSeason.data.forEach( season => this.slurpTemplate( { template: this.templates.share( season ), insertion: { el: this.els.list } } ) ) )
        .then( () => this.show() )
        .catch( this.Error )
    }

} )
