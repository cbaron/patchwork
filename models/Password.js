module.exports = {
    name: 'password',
    label: 'Password',
    range: 'Password',
    error: "Password must be at least six characters.",
    validate: function( val ) { return val.length > 5 }
}