module.exports = Object.assign( {}, require('./__proto__'), {

    fields: [
        { name: 'name', label: 'Name' },
        { name: 'email', label: 'Email' },
        { name: 'secondaryEmail', label: 'Secondary Email' },
        { name: 'phonenumber', label: 'Phone' },
        { name: 'address', label: 'Address' },
        { name: 'neverReceive', label: 'Vegetable to Never Receive' },
        { name: 'onPaymentPlan', label: 'On Payment Plan' }
    ],

    getTableData( personData ) {
        this.models.person.data = personData

        return this.models.member.get( { query: { personid: { operation: '=', value: personData.id } } } )
        .then( () => {

            return this.models.neverReceive.get( { resource: `never-receive/${personData.id}` } )
            .then( () => {
                this.populateTable()
            })
        } )
    },

    getTemplateOptions() {
        return { fields: this.fields }
    },

    models: {
        member: require('../models/Member'),
        neverReceive: require('../models/NeverReceive'),
        person: { }
    },

    populateTable() {
        Object.keys( this.models ).forEach( model => {
            Object.keys( this.models[ model ].data ).forEach( attr => {
                if( this.els[ attr ] ) this.els[ attr ].textContent = this.models[ model ].data[ attr ]
            } )
        } )

        this.show()
    },

    postRender() {
        return this
    }

} )
