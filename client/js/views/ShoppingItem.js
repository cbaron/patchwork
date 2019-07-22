module.exports = { ...require('./__proto__'),

  events: {
    addToCartBtn: 'click',
    amountSelect: 'change',
    quantitySelect: 'change'
  },

  onAddToCartBtnClick(e) {
    const { _id, available, name, label, unit } = this.model.data;
    const selectedItem = {
      itemId: _id,
      available,
      name,
      label,
      unit,
      amount: this.selectedAmountOption,
      quantity: this.selectedQuantity,
      price: this.itemPrice
    };
    let cart = [];

    if (window.localStorage.getItem('cart')) {
      cart = JSON.parse(window.localStorage.getItem('cart'));
      if (cart.find(({ itemId }) => itemId === _id )) {
        return this.Toast.showMessage('error', `${label} already in cart.`)
      };
    };

    cart.push(selectedItem)
    window.localStorage.setItem('cart', JSON.stringify(cart));
    this.user.trigger('cartItemAdded', selectedItem);
    this.Toast.showMessage('success', `${selectedItem.label} added to your cart!`);
  },

  onAmountSelectChange(e) {
    const el = e.target;
    this.selectedAmountOption = this.model.data.amountOptions[el.selectedIndex];

    if(this.selectedAmountOption.image) {
      this.els.itemImage.setAttribute('data-src', this.Format.ImageSrc(this.selectedAmountOption.image))
      this.fadeInImage(this.els.itemImage);
    };

    this.updatePrice();
  },

  onQuantitySelectChange(e) {
    this.selectedQuantity = e.target.value;
    this.updatePrice();
  },

  postRender() {
    this.selectedAmountOption = this.model.data.amountOptions[0];
    this.selectedQuantity = this.model.data.quantityOptions[0];
    this.updatePrice();

    return this;
  },

  updatePrice() {
    const amountPrice = Number.parseFloat(this.selectedAmountOption.price);
    const quantity = Number.parseInt(this.selectedQuantity);
    
    this.itemPrice = amountPrice * quantity;
    this.els.itemPrice.textContent = this.Format.Currency.format(this.itemPrice);
  }
}