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
        console.log( 'getTableData' )
        console.log( this.models.person )
        this.models.person.data = personData
        console.log( this.models.person.data )

        return this.models.member.get( { query: { personid: { operation: '=', value: personData.id } } } )
        .then( () => {
            console.log( this.models.member.data )

            return this.models.neverReceive.get( { resource: `never-receive/${personData.id}` } )
            .then( () => {
                console.log( 'omitData' )
                console.log( this.models.neverReceive.data )
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
        console.log( 'populateTable' )
        console.log( this.els )
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