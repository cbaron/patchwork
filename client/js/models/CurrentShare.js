module.exports = Object.assign( {}, require('./__proto__'), {

    GroupDropoffs: Object.create( require('./__proto__'), { resource: { value: 'groupdropoff' } } ),
    ShareGroupDropoffs: require('./ShareGroupDropoff'),

    getCurrentGroupDropoffsData() {
        return this.get()
        .then( () => this.ShareGroupDropoffs.get( { query: { shareid: this.data.id } } ) )
        .then( () =>
            Promise.all( this.ShareGroupDropoffs.data.map( sgdDatum =>
                this.GroupDropoffs.get()
                .then( () => {
                    const groupDropoff = this.GroupDropoffs.data.find( datum => datum.id === sgdDatum.groupdropoffid )
                    console.log( groupDropoff )
                    return Promise.resolve( Object.assign( {
                        name: groupDropoff.name,
                        venue: groupDropoff.venue,
                        street: groupDropoff.street,
                        hours: `${sgdDatum.dayofweek} ${sgdDatum.starttime} - ${sgdDatum.endtime}`
                    } ) )
                } )
            ) )
        )
    },

    getSizeOptions() {
        return this.data.produceOptions.filter( option => /size/i.test( option.prompt ) )
    },

    resource: 'currentShare'

} )