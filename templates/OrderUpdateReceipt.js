const Currency = new Intl.NumberFormat( 'en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2
} );

const bold = `font-weight: bold;`
const alignCenter = `text-align: center;`
const alignRight = `text-align: right;`
const tableStyles = `border-collapse: collapse; width: 100%;`
const border = `border-bottom: 1px solid #ccc;`
const listStyle = `display: list-item; list-style-type: disc; list-style-position: inside;`
const spanPadding = `padding: 0 .3rem;`
const tdPadding = `padding: .5rem 0;`

module.exports = p => {
    const newBalance = p.previousBalance + p.adjustment.value;

    const weeks = p.adjustment.weeks
    const weeksAdded = weeks.addedDates.length
        ? `<tr style="${border} margin-bottom: .5rem;">
             <td style="${tdPadding}">
                <span style="${bold}">Weeks Added: </span>
                    ${weeks.addedDates.map(date => `<span style="${spanPadding}">${date}</span>`).join(', ')}
            </td>
             <td style="${alignRight} ${bold}">${Currency.format(weeks.addedPrice)}</td>
           </tr>`
        : ``

    const weeksRemoved = weeks.removedDates.length
        ? `<tr style="${border} margin-bottom: .5rem;">
             <td style="${tdPadding}">
                <span style="${bold}">Weeks Removed: </span>
                    ${weeks.removedDates.map(date => `<span style="${spanPadding}">${date}</span>`).join(', ')}
            </td>
             <td style="${alignRight} ${bold}">${Currency.format(weeks.removedPrice)}</td>
           </tr>`
        : ``

    const options = p.adjustment.options;
    const optionChanges = options.changes.map( opt =>
        `<tr>
            <td style="${listStyle} padding: .15rem .5rem;">${opt.label}: ${opt.oldValue} to ${opt.newValue}</td>
        </tr>`
    ).join('');

    const optionsSummary = options.changes.length ?
        `<table style="${tableStyles} ${border} margin-bottom: 1rem;">
            <tbody>
                <tr style="${bold} margin-bottom: .5rem;">Share/Delivery Options:</tr>
                ${optionChanges}
                <br />
                <tr>
                    <td style="padding-bottom: .5rem;">Total Options Price Adjustment:</td>
                    <td style="${alignRight} ${bold}">${Currency.format(options.weeklyPriceAdjustment * options.weeksAffected)}</td>
                </tr>
            </tbody>
        </table>` : ``

    const paymentMessage = newBalance > 0
        ? `Please send payment at your earliest convenience to the address below. You may also log in to your account and pay online via credit card.`
        : `If your overall balance with Patchwork is now negative, we will mail a check to you in the near future.`

return `` +
`<p>Hello ${p.name},</p>
<p>Your ${p.shareLabel} CSA order with Patchwork Gardens has been adjusted. Here are the details:</p>
<table style="${tableStyles} margin-top: 2rem; margin-bottom: 1rem;">
    <tbody>
        <tr style="${bold} font-size: .85rem;">
            <td>ORDER CHANGE</td>
            <td style="text-align: right;">PRICE ADJUSTMENT</td>
        </tr>
    </tbody>
</table>
<table style="${tableStyles} margin-bottom: 1rem;">
    <tbody>
        ${weeksAdded}
        ${weeksRemoved}
    </tbody>
</table>
${optionsSummary}
<p style="margin: 1.5rem 0;">You currently have an outstanding balance of ${Currency.format(p.previousBalance)} on this share. With the ${p.adjustment.value > 0 ? 'new charges' : 'price reduction'}
of ${Currency.format( Math.abs(p.adjustment.value ) )} from the above changes, your new balance comes to:</p>
<p style="margin-bottom: 2rem; padding: .25rem; background-color: #aa0000; color: white; font-weight: bold; font-size: 1.2rem; text-align: center;">New Share Balance: ${Currency.format( newBalance )}</p>
<p style="text-align: center;">${paymentMessage}</p>
<p style="margin-top: 2rem; font-size: 1.3rem; color: #aa0000; text-align: center;">Thank you!</p>`
}