module.exports = {
    attributes: [
        require('./Name'),
        require('./Email'),
        {
            name: 'phonenumber',
            label: 'Phone Number',
            range: 'String',
            error: "Please enter a valid phone number.",
            validate: function( val ) { return /^\(?(\d{3})\)?[-. ]?(\d{3})[-. ]?(\d{4})$/.test( val ) }
        }, {
            name: 'address',
            label: 'Address 1',
            range: 'String',
            error: "Please enter a valid address.",
            validate: val => val !== ''
        }, {
            name: 'extraaddress',
            label: 'Address 2',
            range: 'String',
            validate: () => true
        }
    ]
}