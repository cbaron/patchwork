module.exports = new ( require('backbone').Model.extend( {
    defaults: { state: '{}' },
    urlRoot: "/user"
} ) )()
