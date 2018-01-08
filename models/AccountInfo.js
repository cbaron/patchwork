module.exports = {
    attributes: [
        require('./Name'),
        {
            name: 'email',
            label: 'Email',
            range: 'Email',
            error: "Please enter a valid email address.",
            validate: function( val ) { return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test( val ) }
        }, {
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
            validate: () => true
        }, {
            name: 'extraaddress',
            label: 'Address 2',
            range: 'String',
            validate: () => true
        }
    ]
}

/*, {
            name: 'omission',
            label: 'Opt-out Vegetable',
            range: 'select',
            info: true,
            validate: () => true
        }
        require('./Password'),
        {
            name: 'repeatpassword',
            label: 'Repeat Password',
            range: 'Password',
            error: "Passwords must match.",
            validate: () => true
        }
        */