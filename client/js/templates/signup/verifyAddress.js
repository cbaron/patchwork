module.exports = p =>
`<div>
    <div>Because you have selected home delivery, and your address could not be validated automatically, we would like you to verify your address and zip code</div>
    <form class="form-horizontal">
        <div class="form-group">
            <label class="col-sm-3 control-label">Address</label>
            <div class="col-sm-9">
                <input type="text" class="form-control" id="verifiedAddress" value="${p.address}">
            </div>
        </div>
        <div id="zipCodeFormGroup" class="form-group">
            <label class="col-sm-3 control-label">Zip Code</label>
            <div class="col-sm-9">
                <input type="text" class="form-control" id="verifiedZipCode" value="${p.zipCode}">
                <span id="zipCodeHelpBlock" class="help-block hide">Invalid Zip Code for Home Delivery</span>
            </div>
        </div>
    </form>
</div>`