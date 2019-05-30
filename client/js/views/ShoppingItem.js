module.exports = { ...require('./__proto__'),

  events: {
    addToCartBtn: 'click',
    amountSelect: 'change',
    quantitySelect: 'change'
  },

  onAddToCartBtnClick(e) {
    console.log('onaddtocartclick')
    console.log(this.model)
    const cart = this.user.get('cart') || [];
    const { _id, name, label, unit } = this.model.data;
    const selectedItem = {
      itemId: _id,
      name,
      label,
      unit,
      amount: this.selectedAmountOption,
      quantity: this.selectedQuantity,
      price: this.itemPrice
    };
    console.log(selectedItem);
    
    this.user.set('cart',)
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