var Base = require('./__proto__'),
    ShoppingPayment = function() { return Base.apply( this, arguments ) }

Object.assign( ShoppingPayment.prototype, Base.prototype, {

    SendGrid: require('../lib/SendGrid'),

    Stripe: require('../lib/stripe'),

    executePayment() {
      return this.Stripe.charge({
        amount: Math.floor(this.total * 100),
        description: `Payment for full price of shopping transaction.`,
        metadata: { memberid: this.user.id, name: this.user.name, email: this.user.email },
        receipt_email: this.user.email,
        source: {
          exp_month: this.body.ccMonth,
          exp_year: this.body.ccYear,
          number: this.body.ccNo,
          object: 'card',
          cvc: this.body.cvc
        },
        statement_descriptor: 'PW shopping payment'
      })
      .catch(failedPayment => {
        console.log(this.format(
          '%s Failed payment : %s -- body -- %s',
          new Date(),
          failedPayment.stack || failedPayment,
          JSON.stringify(this.body)
        ));

        return this.respond({
          stopChain: true,
          code: 200,
          body: {
            error: 'Failed payment. Please try again.'
          }
        })
      })     
    },

    notifyCustomer() {
      console.log('notify customer');
      const email = this.user.email;
      const secondaryEmail = this.user.secondaryEmail;
      const emailTo = [email];

      if( secondaryEmail && email !== secondaryEmail ) {
        emailTo.push(secondaryEmail)
      }
      return Promise.resolve();
      /*return this.SendGrid.send( {
          to: process.env.NODE_ENV === 'production' ? emailTo : process.env.TEST_EMAIL,
          from: 'Patchwork Gardens <eat.patchworkgardens@gmail.com>',
          subject: `Patchwork Gardens Payment Receipt`,
          html: this.Templates.EmailBase({
              emailBody: this.Templates.PaymentReceipt({
                  name: this.user.name,
                  shareLabel: this.body.share.label,
                  total: this.body.total
              })
          })
      } )
      .catch( e => Promise.resolve( console.log( 'Failed to send payment details to customer.' ) ) )*/
    },

    async POST() {
      await this.slurpBody()
      console.log('shopping purchase');
      console.log(this.body);
      console.log(this.user);
      if (!this.user.id) throw Error("401")

      if (this.body.isPayingWithCreditCard) {
        await this.validateCreditInfo();
        await this.executePayment();
      };

      await this.notifyCustomer()
      this.respond({ body: {} })
    },

    Templates: {
        EmailBase: require('../templates/EmailBase'),
        ShoppingReceipt: require('../templates/ShoppingReceipt')
    },

    validateCreditInfo() {
      this.hasCCInfo = Boolean(this.body.ccNo && this.body.ccMonth && this.body.ccYear && this.body.cvc)

      if (!this.hasCCInfo) return this.respond({
        stopChain: true,
        code: 200,
        body: {
          error: 'Credit card information is required.'
        }
      });
      
      this.total = Number.parseFloat(this.body.total)

      return Promise.resolve()
    },

})

module.exports = ShoppingPayment