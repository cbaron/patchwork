module.exports = { ...require('./__proto__'),

  model: require('../models/Shopping'),

  postRender() {
    this.model.get()
    .then(() => console.log(this.model.data))
    .catch(err => console.log(err.stack || err))
  },

  requiresLogin: true

}