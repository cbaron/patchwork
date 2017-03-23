module.exports = Object.assign( {}, require('./__proto__'), {

    OrderOption: require('../models/OrderOption'),
    MemberSelection: require('../models/MemberSelection'),

    clear() {
        this.els.options.innerHTML = ''
        this.els = {
            container: this.els.container,
            seasonLabel: this.els.seasonLabel,
            options: this.els.options
        }
    },

    renderDelivery() {
        const option = this.model.delivery.data[0]

        this.slurpTemplate( { template: this.templates.option( { name: 'Delivery Option', id: 'deliveryOption' } ), insertion: { el: this.els.options } } )
            .els.deliveryOption.textContent = option.deliveryoption.label
           
        this.slurpTemplate( { template: this.templates.option( { name: 'Group Option', id: 'groupOption' } ), insertion: { el: this.els.options } } )
            .els.groupOption.textContent = option.groupdropoff.label || 'N/A'

        return this
    },

    templates: {
        option: option => `<li><span>${option.name}</span><span data-js="${option.id}"></span></li>`
    },

    update( { customer, delivery, share } ) {
        this.clear()

        this.model = arguments[0]

        this.els.seasonLabel.textContent = share.label

        this.OrderOption.get( { query: { shareid: share.id, shareoptionid: { operation: 'join', value: { table: 'shareoption', column: 'id' } } } } )
        .then( () => this.OrderOption.data.forEach( shareOption => this.slurpTemplate( { template: this.templates.option( shareOption ), insertion: { el: this.els.options } } ) ) )
        .then( () => this.MemberSelection.get( { query: { membershareid: share.membershareid, shareoptionoptionid: { operation: 'join', value: { table: 'shareoptionoption', column: 'id' } } } } ) )
        .then( () => this.MemberSelection.data.forEach( selection => this.els[ selection.shareoptionid ].textContent = selection.label ) )
        .then( () => this.renderDelivery().show() )
        .catch( this.Error )

    },

} )
