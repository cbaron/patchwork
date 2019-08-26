const Currency = new Intl.NumberFormat( 'en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2
} )

module.exports = p => {
  const orderSummary = p.items.map(item => {
    return `` +
    `<tr>
      <td>${item.label} (${item.amount.amount} ${item.unit} X ${item.quantity})</td>
      <td align="right">${Currency.format(item.price)}</td>
    </tr>`
  }).join('');
  const paymentMessage = p.isPayingWithCreditCard
    ? `We have received your credit card payment.`
    : `Please send payment at your earliest convenience to the address below.`

  return `` +
  `<table style="margin: 0 auto;">
    <tbody>
      <tr>
        <td style="padding-bottom: 10px;">Hello, ${p.name}</td>
      </tr>
      <tr>
        <td style="padding-bottom: 20px;">
          Thank you for your purchase from the Patchwork store! Here is a summary for your records:
        </td>
      </tr>
      <tr>
        <td style="font-weight: bold;">ITEM</td>
        <td style="font-weight: bold;" align="right">PRICE</td>
      </tr>
      ${orderSummary}
    </tbody>
  </table>
  <p style="margin-bottom: 2rem; padding: .25rem; background-color: #aa0000; color: white; font-weight: bold; font-size: 1.2rem; text-align: center;">Order Total: ${Currency.format(p.total)}</p>
  <p style="text-align: center;">${paymentMessage}</p>
  <p style="text-align: center;">
    If currently available, your order will be included with your next CSA box. 
    Otherwise, we will schedule delivery for a future date. If you are not currently receiving a box, 
    then you may pick up your order at the farm on Thursday between 4 - 7PM. 
    We will be in touch shortly to confirm delivery or pick-up for your order.
  </p>
  <p style="margin-top: 2rem; font-size: 1.3rem; color: #aa0000; text-align: center;">Thank you!</p>`
}