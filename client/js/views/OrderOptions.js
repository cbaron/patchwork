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

    templates: {
        option: option => `<li><span>${option.name}</span><span data-js="${option.id}"></span></li>`
    },

    update( { customer, share } ) {
        this.clear()

        this.els.seasonLabel.textContent = share.label

        this.OrderOption.get( { query: { shareid: share.id, shareoptionid: { operation: 'join', value: { table: 'shareoption', column: 'id' } } } } )
        .then( () => this.OrderOption.data.forEach( shareOption => this.slurpTemplate( { template: this.templates.option( shareOption ), insertion: { el: this.els.options } } ) ) )
        .then( () => this.MemberSelection.get( { query: { membershareid: share.membershareid, shareoptionoptionid: { operation: 'join', value: { table: 'shareoptionoption', column: 'id' } } } } ) )
        .then( () => this.MemberSelection.data.forEach( selection => this.els[ selection.shareoptionid ].textContent = selection.label ) )
        .then( () => this.show() )
        .catch( this.Error )
    },

} )
