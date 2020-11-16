module.exports = Object.assign( {}, require('./__proto__'), {

  ShareSkipDates: require('../models/ShareSkipDate'),

  events: {
    dates: 'click',
    saveBtn: 'click',
    seasonSelection: 'change',
  },

  clear() {
    this.els.dates.innerHTML = ''
    this.addedSkipDates = [];
    this.deletedSkipDates = [];
    this.dates = [];
  },

  determineDates(share) {
    const selectedSeasonSkipDates = this.ShareSkipDates.data.filter(date => date.shareId === share.id);
    const endDate = this.Moment(share.enddate);
    let deliveryDate = this.Moment(share.startdate);

    while(endDate.diff(deliveryDate, 'days') >= 0 ) {
      const isSkipDate = selectedSeasonSkipDates.find(seasonSkipDate =>
        new Date(seasonSkipDate.date).getTime() === new Date(deliveryDate).getTime()  
      );
      this.dates.push( {
        date: this.Moment(deliveryDate),
        selected: !isSkipDate
      });
      deliveryDate.add( 1, 'days' )
    }
  },

  getSeasonOptions() {
    this.Shares.data.forEach(share => {
      this.slurpTemplate({
        template: `<option value="${share.name}">${share.label}</option>`,
        insertion: { el: this.els.seasonSelection }
      })
    });
  },

  onDatesClick(e) {
    const el = e.target.closest('li');
    const date = el.getAttribute('data-date');
    if (el.classList.contains('unselectable')) return;
    const targetArray = el.classList.contains('selected')
      ? this.addedSkipDates
      : this.deletedSkipDates;
    const addedSkipDatesIndex = this.addedSkipDates.indexOf(date);
    const deletedSkipDatesIndex = this.deletedSkipDates.indexOf(date);

    if (addedSkipDatesIndex !== -1) {
      this.addedSkipDates.splice(addedSkipDatesIndex, 1);
    } else if (deletedSkipDatesIndex !== -1) {
      this.deletedSkipDates.splice(deletedSkipDatesIndex, 1);
    } else {
      targetArray.push(date);
    }

    el.classList.toggle('selected')
  },

  async onSaveBtnClick() {
    const postPayloads = this.addedSkipDates.map(date => ({
      date,
      shareId: this.shareId
    }));
    const idsToDelete = this.deletedSkipDates.map(date => {
      const match = this.ShareSkipDates.data.find(sd =>
        new Date(sd.date).getTime() === new Date(this.Moment(date)).getTime()
      );
      return match.id
    })
    if (postPayloads.length) {
      await Promise.all(postPayloads.map(payload =>
        this.ShareSkipDates.post(payload)
      ))
      .catch(e => {
        console.log('Failed to save share skip dates: ' + e)
      })
    }
    if (idsToDelete.length) {
      await Promise.all(idsToDelete.map(id =>
        this.ShareSkipDates.delete(id)
      ))
      .catch(e => {
        console.log('Failed to delete skip date: ' + e)
      })
    }
    this.Toast.showMessage('success', 'Changes saved');
    this.addedSkipDates = [];
    this.deletedSkipDates = [];
  },

  onSeasonSelectionChange(e) {
    this.clear();
    const selectedSeason = this.Shares.data.find(({ name }) => name === e.target.value);
    this.shareId = selectedSeason.id;
    this.determineDates(selectedSeason);
    this.renderDates();
  },

  postRender() {
    this.Shares = Object.create(this.Model, { resource: { value: 'share' } });
    Promise.all([
      this.ShareSkipDates.get(),
      this.Shares.get()
    ])
    .then(() => this.getSeasonOptions())
    .catch(this.Error);
    return this;
  },

  renderDates() {
    this.dates.forEach(
      date => this.slurpTemplate({
        template: this.templates.date({ ...date, isAdmin: true }),
        insertion: { el: this.els.dates } 
      })
    )
    return this
  },

  templates: {
    date: require('./templates/DeliveryDate'),
  },

});