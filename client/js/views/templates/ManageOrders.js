module.exports = p => {
  return `` +
  `<div class="section">
    <div class="section-heading">
      <h1>Manage Orders</h1>
    </div>
    <div class="select-row">
      <div>
        <label>Filter Orders By:</label>
        <select data-js="filterSelect">
          <option disabled selected value>Choose Option</option>
          <option value="all">All Orders</option>
          <option value="open">Open Orders</option>
          <option value="filled">Filled Orders</option>
          <option value="cancelled">Cancelled Orders</option>
        </select>
      </div>
      <button data-js="submitQueryBtn" class="btn-yellow">Submit</button>
    </div>
    <div data-view="viewList" data-name="orderDetails"></div>
  </div>`
}