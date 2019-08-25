module.exports = { ...require('./__proto__'),

  StoreOrders: require('../models/StoreOrder'),
  StoreTransactions: require('../models/StoreTransaction'),

  Templates: {
    StoreOrderTransactionDetails: require('./templates/StoreOrderTransactionDetails')
  },

  Views: {
    addStoreTransaction() {
      return {
        model: Object.create(this.StoreTransactions).constructor( { }, {
          attributes: require('../../../models/StoreTransaction').attributes,
          data: {
            initiator: 'admin',
            orderId: this.model.data.id,
          },
          meta: {
            key: 'id',
            noPlaceholder: true
          },
        }),
        templateOpts() {
          return {};
        },
        toastSuccess: 'Transaction added.'
      }
    },
    storeOrderItems() {
      return {
        model: Object.create(this.Model).constructor({
          collection: Object.create(this.Model).constructor(),
          view: 'StoreOrderItem',
          delete: false
        })
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
        ['posted', async function(model) {
          await this.StoreTransactions.get({
            query: {
              orderId: this.model.data.id,
              sort: 'created asc'
            }
          })

          this.els.transactions.classList.remove('fd-hidden');
          this.insertTransaction(model);
          this.updateBalance();
          this.views.addStoreTransaction.hide().catch(this.Error);
        }]
      ]
    }
  },

  async handleItemChecked(checkedItem, isFilled) {
    const { id, items } = this.model.data;
    const itemIndex = items.findIndex(
      ({ itemId }) => itemId === checkedItem.itemId
    );
    const updatedItems = [
      ...items.slice(0, itemIndex),
      { ...items[itemIndex], isFilled },
      ...items.slice(itemIndex + 1)
    ];

    this.model.set('items', updatedItems);

    await this.StoreOrders.patch(id, {
      items: JSON.stringify(updatedItems)
    })
    .catch(this.Error)
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
      if (this.StoreTransactions.data.length && this.user.isAdmin()) {
        this.els.transactions.classList.remove('fd-hidden');
      };

      this.updateBalance();

      this.StoreTransactions.data.forEach(
        transaction => this.insertTransaction(transaction)
      );
    })
    .catch(this.Error)

    return this;
  },

  renderItemsPurchased() {
    this.views.storeOrderItems.clearItemViews();
    this.views.storeOrderItems.createItemViews(this.model.data.items);

    this.views.storeOrderItems.itemViews.forEach(itemView =>
      itemView.on('itemChecked', (checkedItem, isFilled) =>
        this.handleItemChecked(checkedItem, isFilled)
      )
    );
  },

  updateBalance() {
    const remainingBalance = this.StoreTransactions.data.reduce((memo, transaction) => {
      if (transaction.amount) {
        memo -= transaction.amount
      }

      return memo;
    }, this.model.data.total)

    this.els.balance.textContent = this.Currency.format(remainingBalance);
  }
}