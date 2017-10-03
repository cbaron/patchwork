module.exports = p => {

const shares = p.shares.map( share => {

    const selectedOptions = share.selectedOptions.map( opt =>
        `<div class="item-row">
            <div>${opt.optionName}</div>
            <div>
                <span>${opt.selectedOptionLabel}</span>
                <span>${p.unit || ''}</span>
            </div>
            <div class="price">
                <span>${opt.price}</span>
                <span>per week</span>
            </div>
        </div>`
    ).join('')

    const groupdropoff = share.selectedDelivery.groupdropoff
        ? `<div class="item-row">
            <div>Drop-off Location</div>
            <div>${share.selectedDelivery.groupdropoff}</div>
        </div>`
        : ``

    const skipDays = share.skipDays
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
            <div>
                <div>Weekly Price :</div>
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
        <form data-js="paymentForm" class="hide">
            <div class="credit-card-info">
                <label class="control-label number">Card Number</label>
                <div>
                    <input type="text" class="form-control" data-js="number" id="number">
                    <span class="glyphicon form-control-feedback hide" aria-hidden="true"></span>
                </div>
                <div>Visa, MasterCard, American Express, JCB, Discover, and Diners Club are accepted</div>
            </div>
            <div class="expiration">
                <div>
                    <label class="control-label">Exp Month</label>
                    <div>
                        <input type="number" class="form-control" data-js="exp_month" maxlength="2" size="3" placeholder="mm" id="exp_month">
                        <span class="glyphicon form-control-feedback hide" aria-hidden="true"></span>
                    </div>
                </div>
                <div>
                    <label class="control-label">Exp Year</label>
                    <div>
                        <input type="number" class="form-control" data-js="exp_year" maxlength="4" size="4" placeholder="yyyy" id="exp_year">
                        <span class="glyphicon form-control-feedback hide" aria-hidden="true"></span>
                    </div>
                </div>
            </div>
            <div>
                <label class="control-label">CVC</label>
                <div class="cvc">
                    <input type="number" class="form-control" data-js="cvc" maxlength="4" size="4" id="cvc">
                    <span class="glyphicon form-control-feedback hide" aria-hidden="true"></span>
                </div>
            </div>
        </form>
        <div class="button-row">
            <button data-js="signupBtn" class="disabled">Become a Member!</button>
        </div>
    </div>
</div>`
}