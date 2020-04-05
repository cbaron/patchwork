module.exports = p => {
  return `` +
  `<div class="section">
    <div class="section-heading">
      <h1>Manage Orders</h1>
    </div>
    <div class="centered-row">
      <label>Filter Orders By:</label>
      <select data-js="filterSelect">
        <option disabled selected value>Choose Option</option>
        <option value="summary">Summary of Orders</option>
        <option value="all">All Orders</option>
        <option value="open">Open Orders</option>
        <option value="filled">Filled Orders</option>
        <option value="cancelled">Cancelled Orders</option>
      </select>
      <button data-js="submitQueryBtn" class="btn-yellow">Submit</button>
    </div>
    <div class="centered-row fd-hidden" data-js="dateSearch">
      <div>
        <label>From:</label>
        <input type="text" data-js="from" />
      </div>
      <div>
        <label>To:</label>
        <input type="text" data-js="to" />
      </div>
    </div>
    <div data-view="viewList" data-name="orderDetails"></div>
    <div data-js="orderSummaryTable"></div>
  </div>`
}