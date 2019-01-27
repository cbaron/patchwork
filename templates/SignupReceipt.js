const subheadingStyles = `font-size: 1.05rem; font-weight: bold;`
const alignRight = `text-align: right;`
const tableStyles = `border-collapse: collapse; width: 100%;`
const trStyles = `border-bottom: 1px solid #ccc;`
const tdStyles = `padding: .5rem;`

module.exports = p => {
    const shares = p.shares.map( share => {
        const skipDays = share.skipDays.length
            ? `<p>You have opted out of produce for the following dates: ${share.skipDays.map(
                    day => `<span style="margin: 0 .25rem; color: #aa0000;">${day.slice(5)}</span>`
                ).join('')}</p>`
            : ``;

        const groupdropoff = share.selectedDelivery.groupdropoff
            ? `<tr style="${trStyles}">
                <td style="${tdStyles}">Dropoff Location:</td>
                <td style="${tdStyles} ${alignRight}">${share.selectedDelivery.groupdropoff}</td>
              </tr>`
            : ``;

        const delivery = `` +
            `<table style="${tableStyles}">
                <tbody>
                    <tr style="${trStyles}">
                        <td style="${tdStyles}">Method: ${share.selectedDelivery.deliveryType}</td>
                        <td style="${tdStyles} ${alignRight}">${share.selectedDelivery.weeklyCost} per week</td>
                    </tr>
                    ${groupdropoff}
                    <tr style="${trStyles}">
                        <td style="${tdStyles}">Address: </td>
                        <td style="${tdStyles} ${alignRight}">${share.selectedDelivery.address}</td>
                    </tr>
                    <tr style="${trStyles}">
                        <td style="${tdStyles}">Pick-up Hours: </td>
                        <td style="${tdStyles} ${alignRight}">${share.selectedDelivery.dayOfWeek} ${share.selectedDelivery.starttime} - ${share.selectedDelivery.endtime}</td>
                    </tr>
                </tbody>
            </table>`;

        const seasonalAddOns = share.seasonalAddOns.map( addon =>
            `<tr style="${trStyles}">
                <td style="${tdStyles}">${addon.label}: ${addon.selectedOptionLabel} ${addon.unit || ''}</td>
                <td style="${tdStyles} ${alignRight}">${addon.price}</td>
            </tr>`
        ).join('');

        const shareOptionRows = share.selectedOptions.map( opt =>
            `<tr style="${trStyles}">
                <td style="${tdStyles}">${opt.optionName}: ${opt.selectedOptionLabel} ${opt.unit || ''}</td>
                <td style="${tdStyles} ${alignRight}">${opt.price} per week</td>
            </tr>`
        ).join('');

        const shareOptions = `` +
            `<table style="${tableStyles}">
                <tbody>
                    ${shareOptionRows}
                    ${seasonalAddOns}
                </tbody>
            </table>`


        return `` +
        `<p style="margin-top: 3rem; font-size: 1.2rem; font-weight: bold; color: #aa0000; text-align: center;">${share.label}</p>
        <p>${share.description}</p>
        ${skipDays}
        <p style="${subheadingStyles}">Share Options</p>
        ${shareOptions}
        <p style="${subheadingStyles}">Delivery</p>
        ${delivery}
        <p style="margin: 1rem 0; font-weight: bold; text-align: center;">Share Total: ${share.formattedTotal}</p>`
    } ).join('');

    const foodOmission = p.foodOmission ? `<p style="margin-top: 2rem;">Vegetable to never receive: ${p.foodOmission}</p>`: ``;
    const grandTotal = `<span style="font-weight: bold; font-size: 1.2rem;">$${p.total}</span>`;
    const paymentMessage = Object.keys( p.payment ).length
        ? `We have received your online payment. If there is a problem with the transaction, we will be in touch.`
        : `Please send payment at your earliest convenience to: <br /><br />Patchwork Gardens<br />9057 W Third St<br />Dayton, OH 45417<br /><br />You may also log in to your account and pay online via credit card.`

return `` +
`<p>Hello ${p.name},</p>
<p>Thanks for signing up for our CSA program. Here is a summary for your records:</p>
${shares}
${foodOmission}
<p style="margin: 2rem 0; padding: 1rem; border-bottom: 1px solid #aa0000; border-top: 1px solid #aa0000; font-weight: bold; font-size: 1.2rem; text-align: center;">Grand Total: $${p.total}</p>
<p style="text-align: center;">${paymentMessage}</p>
<p style="margin-top: 2rem; font-size: 1.3rem; color: #aa0000; text-align: center;">Thank you!</p>`
}