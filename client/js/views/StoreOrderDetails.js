module.exports = { ...require('./__proto__'),

  StoreOrders: require('../models/StoreOrder'),
  StoreTransactions: require('../models/StoreTransaction'),

  Templates: {
    StoreOrderTransactionDetails: require('./templates/StoreOrderTransactionDetails'),
    StoreOrderItem: require('./templates/StoreOrderItem')
  },

  Views: {
    addStoreTransaction() {
      return {
        model: Object.create( this.Model ).constructor( { }, {
          attributes: require('../../../models/StoreTransaction').attributes,
          data: {
            initiator: 'admin',
            orderId: this.model.data.id,
          },
          meta: {
            key: 'id',
            noPlaceholder: true
          },
          resource: 'storeTransaction'
        }),
        templateOpts() {
          return {};
        },
        toastSuccess: 'Transaction added.'
      }
    }
  },

  events: {
    addStoreTransactionBtn: 'click',
    cancelOrderBtn: 'click',
    fillOrderBtn: 'click',
    views: {
      addStoreTransaction: [
        ['cleared', function() {
          this.views.addStoreTransaction.model.set('orderId', this.model.data.id);
          this.views.addStoreTransaction.model.set('initiator', 'admin');
        }],
        ['posted', function(model) {
          this.StoreTransactions.data.push(model);
          this.els.transactions.classList.remove('fd-hidden');
          this.insertTransaction(model);
          this.updateBalance();
          this.views.addStoreTransaction.hide().catch(this.Error);
        }]
      ]
    }
  },

  insertTransaction(transaction) {
    this.slurpTemplate({
      insertion: { el: this.els.transactions },
      template: this.Templates.StoreOrderTransactionDetails(transaction)
    })
  },

  onAddStoreTransactionBtnClick() {
    this.views.addStoreTransaction.show().catch(this.Error);
  },

  async onCancelOrderBtnClick() {
    const { id, isCancelled } = this.model.data;

    try {
      const response = await this.StoreOrders.patch(id, {
        isCancelled: Boolean(!isCancelled)
      });

      this.model.data = response;
      const status = response.isCancelled ? 'Cancelled' : response.isFilled ? 'Filled' : 'Open';
      const headingClass = response.isCancelled ? 'cancelled' : response.isFilled ? 'filled' : '';
      const btnText = response.isCancelled ? 'Undo Cancellation' : 'Cancel Order';
      this.els.orderHeading.classList.remove('filled', 'cancelled');
      if (headingClass) this.els.orderHeading.classList.add(headingClass);
      this.els.status.textContent = status;
      this.els.cancelOrderBtn.textContent = btnText;
    } catch(err) {
      this.Error(err)
    }
  },

  async onFillOrderBtnClick() {
    const { id, isFilled } = this.model.data;

    try {
      const response = await this.StoreOrders.patch(id, {
        isFilled: Boolean(!isFilled)
      });

      this.model.data = response;
      const status = response.isCancelled ? 'Cancelled' : response.isFilled ? 'Filled' : 'Open';
      const headingClass = response.isCancelled ? 'cancelled' : response.isFilled ? 'filled' : '';
      const btnText = response.isFilled ? 'Mark as Unfilled' : 'Mark as Filled';
      this.els.orderHeading.classList.remove('filled', 'cancelled');
      if (headingClass) this.els.orderHeading.classList.add(headingClass);
      this.els.status.textContent = status;
      this.els.fillOrderBtn.textContent = btnText;
    } catch(err) {
      this.Error(err)
    }
  },

  postRender() {
    this.renderItemsPurchased();

    this.StoreTransactions.get({
      query: {
        orderId: this.model.data.id,
        sort: 'created asc'
      }
    })
    .then(() => {
      if (this.StoreTransactions.data.length) this.els.transactions.classList.remove('fd-hidden');
      this.updateBalance();

      this.StoreTransactions.data.forEach(
        transaction => this.insertTransaction(transaction)
      );
    })
    .catch(this.Error)

    return this;
  },

  renderItemsPurchased() {
    this.model.data.items.forEach(item =>
      this.slurpTemplate({
        insertion: { el: this.els.itemsList },
        template: this.Templates.StoreOrderItem(item)
      })
    )
  },

  updateBalance() {
    const remainingBalance = this.StoreTransactions.data.reduce((memo, transaction) => {
      if (transaction.action === 'payment') {
        memo -= transaction.amount
      } else if (transaction.action === 'refund') {
        memo += transaction.amount
      }

      return memo;
    }, this.model.data.total)

    this.els.balance.textContent = this.Currency.format(remainingBalance);
  }
}