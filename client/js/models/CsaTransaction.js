module.exports = Object.assign( {}, require('./__proto__'), {

    actions: [
        'Adjustment',
        'Payment',
        'Reimbursement',
        'Season Signup'
    ],

    attributes: [ 'action', 'value', 'checkNumber', 'description' ],

    getBalance() {
        return this.data.reduce( ( memo, datum ) => {
            if( datum.isNegative ) memo -= datum.value
            else memo += datum.value
            return memo
        }, 0 )
    },

    isNegative( row ) {
        if( row.action === 'Payment' ) return true

        if( row.action === 'Adjustment' && row.value < 0 ) return true
    },

    parse( response ) {
        return response
            .map( row => Object.assign( row, { isNegative: this.isNegative( row ) } ) )
            .sort( ( a, b ) => a.created > b.created )
    },

    resource: 'csaTransaction'

} )
