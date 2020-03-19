var Base = require('./__proto__'),
    ShoppingPayment = function() { return Base.apply( this, arguments ) }

Object.assign( ShoppingPayment.prototype, Base.prototype, {

    SgMail: require('@sendgrid/mail'),

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

    async notifyCustomer() {
      const email = this.user.email;
      const secondaryEmail = this.user.secondaryEmail;
      const emailTo = [email];

      if( secondaryEmail && email.toLowerCase() !== secondaryEmail.toLowerCase() ) {
        emailTo.push(secondaryEmail)
      }

      this.SgMail.setApiKey(process.env.SENDGRID_API_KEY);

      await this.SgMail.send({
        to: process.env.NODE_ENV === 'production' ? emailTo : process.env.TEST_EMAIL,
        bcc: 'eat.patchworkgardens@gmail.com',
        from: 'Patchwork Gardens <eat.patchworkgardens@gmail.com>',
        subject: `Your Patchwork Gardens Store Order`,
        html: this.Templates.EmailBase({
          emailBody: this.Templates.ShoppingReceipt({
            name: this.user.name,
            items: this.body.items,
            total: this.body.total,
            isPayingWithCreditCard: this.body.isPayingWithCreditCard
          })
        })
      })
      .catch(error => {
        console.log(`Failed to send confirmation email to customer: ${error.toString()}`);
        const { message, code, response } = error;
        console.log(message);
        console.log(code);
        console.log(response);
        console.log(error.stack);
        return Promise.resolve();
      })
    },

    async POST() {
      await this.slurpBody()

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