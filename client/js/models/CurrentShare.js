module.exports = Object.assign( {}, require('./__proto__'), {

    ShareGroupDropoffs: require('./ShareGroupDropoff'),

    getCurrentGroupDropoffs() {
        return this.ShareGroupDropoffs.get( { query: {
            shareid: this.data.id,
            groupdropoffid: { operation: 'join', value: { table: 'groupdropoff', column: 'id' } }
        } } )
        .then( () =>
            this.ShareGroupDropoffs.data.map( datum =>                
                Object.assign( {
                    name: datum[ 'groupdropoff.name' ],
                    venue: datum[ 'groupdropoff.venue' ],
                    street: datum[ 'groupdropoff.street' ],
                    cityStateZip: datum[ 'groupdropoff.cityStateZip' ],
                    location: datum.location,
                    hours: `${datum.dayofweek} ${datum.starttime} - ${datum.endtime}`
                } )
            )
        )
    },

    getSizeOptions() {
        return this.data.produceOptions.filter( option => /size/i.test( option.prompt ) )
    },

    resource: 'currentShare'

} )