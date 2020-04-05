const Moment = require('moment');

module.exports = orders => {
  const rowData = orders.reduce(
    (
      memo,
      { id, name, created }
    ) => {
      memo.orderIds.push(id);
      memo.names.push(name);
      memo.orderDates.push(created);
      return memo;
    },
    { orderIds: [], names: [], orderDates: [] }
  );
  const orderNumberCells = rowData.orderIds.map(id =>
    `<td><div>${id}</div></td>`
  ).join('');
  const nameCells = rowData.names.map(name =>
    `<td><div>${name}</div></td>`
  ).join('');
  const deliveryDateCells = rowData.orderDates.map(date =>
    `<td><div>${Moment(date).format("YYYY-MM-DD")}</div></td>`
  ).join('');
  const shoppingItems = orders.reduce(
    (
      memo,
      { items }
    ) => {
      items.forEach(item => {
        const isAlreadyInArray = memo.find(
          ({ label, amount }) =>
            item.label === label && item.amount.amount === amount
        );
        if (!isAlreadyInArray) {
          memo.push({
            label: item.label,
            amount: item.amount.amount,
            unit: item.unit
          });
        }
      })
      return memo;
    },
    []
  );
  shoppingItems.sort((a, b) => {
    if (a.label < b.label) {
      return -1
    } else if (a.label > b.label) {
      return 1
    } else return 0
  });
  const shoppingItemRows = shoppingItems.reduce(
    (
      memo,
      { label, amount, unit }
    ) => {
      const rowName = `${label}, ${amount} ${unit}`;
      const rowCells = orders.map(order => {
        const hasLabel = order.items.find(orderItem => orderItem.label === label);
        if (!hasLabel) return `<td><div></div></td>`;
        const amountOptionMatch = order.items.find(orderItem => orderItem.amount.amount === amount);
        if (!amountOptionMatch) return `<td><div></div></td>`;
        return `<td><div class="quantity">${amountOptionMatch.quantity}</div></td>`;
      }).join('');
      const tableRow =
        `<tr>
          <td><div>${rowName}</div></td>
          ${rowCells}
        </tr>`;
      memo += tableRow;
      return memo;
    },
    ``
  );
  
  return `` +
  `<table class="order-summary-table">
    <tbody>
      <tr>
        <td><div>Order No</div></td>
        ${orderNumberCells}
      </tr>
      <tr>
        <td><div>Customer</div></td>
        ${nameCells}
      </tr>
      <tr>
        <td><div>Delivery Date</div></td>
        ${deliveryDateCells}
      </tr>
      ${shoppingItemRows}
    </tbody>
  </table>`
}