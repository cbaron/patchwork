const MyError = function(err, additionalData) {
  return this.handle(err, additionalData);
};

Object.assign(MyError.prototype, {
  
  handle: async function(err, additionalData=null) {
    console.log(err.stack || err);
    let userAttributes;
    if (this.user.get('name')) userAttributes = {
      name: this.user.get('name'),
      email: this.user.get('email'),
      phonenumber: this.user.get('phonenumber')
    }
    const payload = {
      error: err.stack || err,
      browser: navigator.userAgent,
      user: userAttributes,
      additionalData
    };
    const response = await this.Xhr({
        data: JSON.stringify(payload),
        method: "post",
        resource: "client-errors"
    });
  },

  user: require('./models/User'),
  Xhr: require('./Xhr'),

})

module.exports = MyError;
