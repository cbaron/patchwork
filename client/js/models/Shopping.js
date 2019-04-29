module.exports = { ...require('./__proto__'),

    parse( response ) {
      console.log(response)
      return response
    },

    resource: 'ShoppingItems'

}