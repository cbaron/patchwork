module.exports = Object.assign( {}, require('./__proto__'), {

    GroupDropoffs: require('./GroupDropoff'),
    ShareGroupDropoffs: require('./ShareGroupDropoff'),

    getCurrentGroupDropoffs() {
        return Promise.all( [ this.GroupDropoffs.get(), this.ShareGroupDropoffs.get( { query: { shareid: this.data.id } } ) ] )
        .then( () =>
            Promise.all( this.ShareGroupDropoffs.data.map( sgdDatum => {
                const groupDropoff = this.GroupDropoffs.data.find( datum => datum.id === sgdDatum.groupdropoffid )

                return Promise.resolve( Object.assign( {
                    name: groupDropoff.name,
                    venue: groupDropoff.venue,
                    street: groupDropoff.street,
                    cityStateZip: groupDropoff.cityStateZip,
                    location: groupDropoff.location,
                    hours: `${sgdDatum.dayofweek} ${sgdDatum.starttime} - ${sgdDatum.endtime}`
                } ) )
            } ) )
            .then( data => this.data.groupDropoffs = data )
        )
    },

    getSizeOptions() {
        return this.data.produceOptions.filter( option => /size/i.test( option.prompt ) )
    },

    resource: 'currentShare'

} )