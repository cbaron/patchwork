module.exports = p => {

const shares = p.shares.map( share => {

    const selectedOptions = share.selectedOptions.map( opt =>
        `<div class="item-row">
            <div>${opt.optionName}</div>
            <div>
                <span>${opt.selectedOptionLabel}</span>
                <span>${opt.unit || ''}</span>
            </div>
            <div class="price">
                <span>${opt.price}</span>
                <span>per week</span>
            </div>
        </div>`
    ).join('')

    const seasonalAddOns = share.seasonalAddOns.map( addon =>
        `<div class="item-row">
            <div>${addon.label}</div>
            <div>
                <span>${addon.selectedOptionLabel}</span>
                <span>${addon.unit || ''}</span>
            </div>
            <div class="price">
                <span>${addon.price}</span>
            </div>
        </div>`
    ).join('')

    const seasonalTotal = share.seasonalAddOns.length
        ? `<div><div>Seasonal Items Total :</div><div>${share.seasonalOptionsTotal}</div></div>`
        : ``

    const groupdropoff = share.selectedDelivery.groupdropoff
        ? `<div class="item-row">
            <div>Drop-off Location</div>
            <div>${share.selectedDelivery.groupdropoff}</div>
        </div>`
        : ``

    const skipDays = share.skipDays.length
        ? `<div>
            <div class="section-title">Dates You Will Not Pickup</div>
            <div class="pickup-dates">${share.skipDays.join('')}</div>
        </div>`
        : ``

    return `` +
    `<div class="share-summary">
        <div>${share.shareBox}</div>
        <div>
            <div class="section-title">Share Options</div>
            ${selectedOptions}
            ${seasonalAddOns}
        </div>
        <div>
            <div class="section-title">Delivery</div>
            <div class="item-row">
                <div>Method</div>
                <div>${share.selectedDelivery.deliveryType}</div>
                <div class="price">
                    <span>${share.selectedDelivery.weeklyCost}</span>
                    <span>per week</span>
                </div>  
            </div>
            ${groupdropoff}
            <div class="item-row">
                <div>Address</div>
                <div>${share.selectedDelivery.address}</div>
            </div>
            <div class="item-row">
                <div>Pick-up Hours</div>
                <div>
                    <span>${share.selectedDelivery.dayOfWeek} </span>
                    <span>${share.selectedDelivery.starttime} - ${share.selectedDelivery.endtime}</span>
                </div>
            </div>
        </div>
        <div>
            <div class="section-title">Dates Selected for Delivery</div>
            <div class="item-row">
                <div>Number of weeks selected</div>
                <div>${share.weeksSelected}</div>
            </div>
            <div class="pickup-dates">
                ${share.selectedDates.join('')}
            </div>
        </div>
        ${skipDays}
        <div class="share-total">
            <div class="section-title">Share Total</div>
            ${seasonalTotal}
            <div>
                <div>Weekly Share Price :</div>
                <div>${share.weeklyPrice}</div>
            </div>
            <div>
                <div>Number of Weeks :</div>
                <div>${share.weeksSelected}</div>
            </div>
            <div>
                <div>Share Total :</div>
                <div>${share.total}</div>
            </div>
        </div>
    </div>`
} ).join('')

return `` +
`<div data-js="container" class="Summary ${p.containerClass}">
    <div class="summaries">
        ${shares}
    </div>
    <div data-js="grandTotal" class="grand-total"></div>
    <div class="payment">    
        <h2>Select a method of payment</h2>
        <div data-js="paymentOptions"></div>
        <form data-js="paymentForm"></form>
        <div class="button-row">
            <button data-js="signupBtn" class="hide btn-success">Become a Member!</button>
        </div>
    </div>
</div>`
}