module.exports = Object.assign( {}, require('./__proto__'), {

    clear() {
        this.fields.forEach( field => this.els[ field.name ].textContent = '' )
    },

    fields: [
        { table: 'person', name: 'name', label: 'Name' },
        { table: 'person', name: 'email', label: 'Email' },
        { table: 'person', name: 'secondaryEmail', label: 'Secondary Email' },
        { table: 'member', name: 'phonenumber', label: 'Phone' },
        { table: 'member', name: 'address', label: 'Address' },
        { table: 'member', name: 'neverReceive', label: 'Vegetable to Never Receive' },
        { table: 'member', name: 'onPaymentPlan', label: 'On Payment Plan' }
    ],

    getTemplateOptions() {
        return { fields: this.fields }
    },

    models: {
        member: require('../models/Member'),
        neverReceive: require('../models/NeverReceive'),
        person: { }
    },

    populateTable() {
        this.fields.forEach( field => this.els[ field.name ].textContent = this.model[ field.table ].data[ field.name ] )
    },
    
    update( customer ) {
        this.clear()

        this.model = customer

        this.models.neverReceive.get( { resource: `never-receive/${customer.member.data.id}` } )
        .then( () => this.populateTable() )
        .then( () => this.show() )
        .catch( this.Error )
    }

} )
