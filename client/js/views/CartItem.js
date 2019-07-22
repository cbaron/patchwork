module.exports = { ...require('./__proto__'),

  ModalView: require('./modal'),

  events: {
    ex: 'click'
  },

  onExClick(e) {
    const { itemId, label } = this.model.data;
    this.showDeleteModal(itemId, label);
  },

  showDeleteModal(itemId, label) {
    this.ModalView.show({
      title: `Delete ${label} from cart?`,
      confirmText: 'Delete'
    })
    .on('submit', () => {
      this.ModalView.hide();
      this.user.removeCartItem(itemId);
      this.delete().catch(this.Error);
    })
  }

}