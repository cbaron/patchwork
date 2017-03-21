module.exports = Object.assign( {}, require('./__proto__'), {

    OrderOption: require('../model/OrderOption'),

    templates: {
        option: option => `<li><span>${option.label}</span><span data-js="${option.name}"></span></li>`
    },

    update( { customer, share } ) {
        this.els.seasonLabel.textContent = share.label

        this.OrderOption.get( { query: { shareid: share.id, shareoptionid: { operator: 'join', value: { table: 'shareoption', column: 'id' } } } } )
        .then( () => this.OrderOption.data.forEach( shareOption => this.slurpTemplate( { template: this.templates.option( shareOption ), insertion: { el: this.els.list } } ) ) )
        .then( () => this.show() )
        .catch( this.Error )
    },

} )
