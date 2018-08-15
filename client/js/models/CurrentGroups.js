module.exports = { ...require('./__proto__'),

    dayOfWeekMap: require('./DayOfWeek'),

    parse( response ) {
        let groupIds = [ ]

        return response.reduce( ( memo, row ) => {
            if( groupIds.includes( row.id ) ) return memo
            groupIds.push( row.id )

            const starttime = this.moment( `${this.moment().format('YYYY-MM-DD')} ${row.starttime}` ).format('h:mmA')
            const endtime = this.moment( `${this.moment().format('YYYY-MM-DD')} ${row.endtime}` ).format('h:mmA')
            
            memo.push( {
                ...row,
                location: row.location ? JSON.parse( row.location ).coordinates : undefined,
                hours: `${this.dayOfWeekMap[ row.dayofweek ]} ${starttime} - ${endtime}`
            } )

            return memo

        }, [ ] )
    },

    resource: 'currentGroups'

}