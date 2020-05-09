const Base = require('./__proto__');
const ClientErrors = function() {
  return Base.apply(this, arguments)
}

Object.assign(ClientErrors.prototype, Base.prototype, {
  async POST() {
    await this.slurpBody();
    const userString = this.body.user
      ? JSON.stringify(this.body.user)
      : 'guest';
    const additionalDataString = this.body.additionalData
      ? 'Data: ' + JSON.stringify(this.body.additionalData)
      : '';

    console.log(
      'CLIENT ERROR: ' + new Date().toISOString() + '\n' +
      this.body.error + '\n' +
      'Browser: ' + this.body.browser + '\n' +
      'User: ' + userString + '\n' +
      additionalDataString + '\n'
    );
    return this.respond({ body: {} });
  }
});

module.exports = ClientErrors;