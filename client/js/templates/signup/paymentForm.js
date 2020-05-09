module.exports = () =>
`<div class="credit-card-info">
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
</div>`