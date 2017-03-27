module.exports = Object.assign( {}, require('./__proto__'), {

    parse( response ) {
        return response.map( row => {
            const startDate = this.moment( row[ 'share.startdate' ] ),
                  endDate = this.moment( row[ 'share.enddate' ] )

            return Object.keys( row ).reduce(
                ( memo, key ) => {
                    const index = key.indexOf('.'),
                          table = key.slice(0, index)

                    if( table !== 'share' ) return memo

                    return Object.assign( memo, { [ key.slice( index + 1 ) ]: row[key] }, {
                        duration: Math.ceil( endDate.diff( startDate, 'days' ) / 7 ),
                        humanEnddate: endDate.format("MMM D"),
                        humanStartdate: startDate.format("MMM D")
                    } )
                },
                { membershareid: row[ 'membershare.id' ] }
            )
        } )
    },

    resource: 'membershare'
} )
