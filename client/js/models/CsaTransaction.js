module.exports = Object.assign( {}, require('./__proto__'), {

    actions: [
        'Adjustment',
        'Payment',
        'Reimbursement',
        'Season Signup'
    ],

    attributes: [ 'action', 'value', 'checkNumber', 'initiator', 'created', 'description' ],

    getBalance() {
        return this.data.reduce( ( memo, datum ) => {
            if( datum.action === 'Payment' ) memo -= datum.value
            else memo += datum.value
            return memo
        }, 0 )
    },

    isNegative( row ) {
        if( row.action === 'Payment' ) return true

        if( row.action === 'Adjustment' && row.value < 0 ) return true
    },

    parse( response ) {
        response = response.map( row => this.parseOne( row ) )

        if( this.sortAttr ) response.sort( ( a, b ) => a[ this.sortAttr ] > b[ this.sortAttr ] )

        return response
    },

    parseOne( datum ) {
        return Object.assign(
            datum,
            { isNegative: this.isNegative( datum ) },
            { created: typeof datum.created === 'object' ? datum.created.raw : datum.created }
        )
    },

    resource: 'csaTransaction',

    sortAttr: 'created'

} )
