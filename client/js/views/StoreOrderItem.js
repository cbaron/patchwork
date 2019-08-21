module.exports = { ...require('./__proto__'),

  events: {
    fillItemCheckbox: 'change'
  },

  async onFillItemCheckboxChange(e) {
    const isFilled = this.els.fillItemCheckbox.checked;
    this.emit('itemChecked', this.model.data, isFilled);
  },

  postRender() {
    this.els.fillItemCheckbox.checked = this.model.data.isFilled;
    return this;
  }

}