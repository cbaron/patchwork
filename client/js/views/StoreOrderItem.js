module.exports = { ...require('./__proto__'),

  events: {
    fillItemCheckbox: 'change'
  },

  async onFillItemCheckboxChange(e) {
    console.log('checkbox changer');
    console.log(e.target);
    console.log(this.els.fillItemCheckbox.checked);
    this.model.data.isFilled = !(Boolean(this.model.data.isFilled));
    this.emit('itemChecked', this.model.data);
  },

  postRender() {
    console.log(this.model);
    this.els.fillItemCheckbox.checked = this.model.data.isFilled;
    return this;
  }

}