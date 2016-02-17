module.exports = function(Handlebars) {

return Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression, alias5=container.lambda;

  return "        <div class=\"share-label\"><div class=\"text-center\">"
    + alias4(((helper = (helper = helpers.label || (depth0 != null ? depth0.label : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"label","hash":{},"data":data}) : helper)))
    + "</div><div class=\"text-center\"><span>"
    + alias4(((helper = (helper = helpers.humanStartdate || (depth0 != null ? depth0.humanStartdate : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"humanStartdate","hash":{},"data":data}) : helper)))
    + "</span><span>-</span><span>"
    + alias4(((helper = (helper = helpers.humanEnddate || (depth0 != null ? depth0.humanEnddate : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"humanEnddate","hash":{},"data":data}) : helper)))
    + "</span></div><div class=\"text-center\">"
    + alias4(((helper = (helper = helpers.duration || (depth0 != null ? depth0.duration : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"duration","hash":{},"data":data}) : helper)))
    + " weeks</div></div><div class=\"section-title\">Share Options:</div>        "
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.selectedOptions : depth0),{"name":"each","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "        <div class=\"total\">Total :  $"
    + alias4(((helper = (helper = helpers.shareOptionsTotalString || (depth0 != null ? depth0.shareOptionsTotalString : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"shareOptionsTotalString","hash":{},"data":data}) : helper)))
    + "</div><div class=\"\"><div class=\"section-title\">Delivery:</div><span class=\"item-label\">Method: </span><span>"
    + alias4(alias5(((stack1 = (depth0 != null ? depth0.selectedDelivery : depth0)) != null ? stack1.name : stack1), depth0))
    + "</span><span>"
    + alias4(alias5(((stack1 = (depth0 != null ? depth0.selectedDelivery : depth0)) != null ? stack1.address : stack1), depth0))
    + "</span><div class=\"total\">Total :  $"
    + alias4(alias5(((stack1 = (depth0 != null ? depth0.selectedDelivery : depth0)) != null ? stack1.totalCostString : stack1), depth0))
    + " at $"
    + alias4(alias5(((stack1 = (depth0 != null ? depth0.selectedDelivery : depth0)) != null ? stack1.weeklyCostString : stack1), depth0))
    + " / week</div></div><div class=\"\"><div class=\"section-title\">Dates Unavailable for Share:</div><div class=\"skip-weeks item-label\">            "
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.skipWeeks : depth0),{"name":"each","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "            </div><div class=\"total\">Price Reduction:  $</div></div><div class=\"share-total text-center\"><span>Share Total :  </span><span>"
    + alias4(((helper = (helper = helpers.total || (depth0 != null ? depth0.total : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"total","hash":{},"data":data}) : helper)))
    + "</span></div>    ";
},"2":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "            <div class=\"selected-options\"><span class=\"item-label\">"
    + alias4(((helper = (helper = helpers.shareoptionlabel || (depth0 != null ? depth0.shareoptionlabel : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"shareoptionlabel","hash":{},"data":data}) : helper)))
    + " :  </span><span>"
    + alias4(((helper = (helper = helpers.optionName || (depth0 != null ? depth0.optionName : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"optionName","hash":{},"data":data}) : helper)))
    + "</span><div class=\"price\">Price :  $"
    + alias4(((helper = (helper = helpers.totalOptionCostString || (depth0 != null ? depth0.totalOptionCostString : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"totalOptionCostString","hash":{},"data":data}) : helper)))
    + " at "
    + alias4(((helper = (helper = helpers.price || (depth0 != null ? depth0.price : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"price","hash":{},"data":data}) : helper)))
    + " / week</div></div>        ";
},"4":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "                                <span>"
    + alias4(((helper = (helper = helpers.month || (depth0 != null ? depth0.month : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"month","hash":{},"data":data}) : helper)))
    + "</span><span>"
    + alias4(((helper = (helper = helpers.dayOfMonth || (depth0 != null ? depth0.dayOfMonth : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"dayOfMonth","hash":{},"data":data}) : helper)))
    + "</span>            ";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {};

  return "<div data-js=\"container\" class=\"summary col-xs-10 col-xs-offset-1 col-sm-8 col-sm-offset-2\"><div class=\"header\">Summary of Shares</div>    "
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.shares : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "    <div class=\"payment row\"><div class=\"header\">Select a method of payment</div><div class=\"col-sm-12\" data-js=\"paymentOptions\"></div><form data-js=\"paymentForm\" class=\"hide form-horizontal\"><div class=\"form-group\"><label class=\"col-sm-3 control-label\">Card Number</label><div class=\"col-sm-9\"><input type=\"text\" class=\"form-control\" data-js=\"number\" id=\"number\"><span class=\"glyphicon form-control-feedback hide\" aria-hidden=\"true\"></span><span>Visa, MasterCard, American Express, JCB, Discover, and Diners Club are accepted</span></div></div><div class=\"form-group\"><label class=\"col-sm-3 control-label\">Expiration</label><div class=\"col-sm-9 expiration\"><input type=\"number\" class=\"form-control\" data-js=\"exp_month\" maxlength=\"2\" size=\"3\" placeholder=\"mm\" id=\"exp_month\"><span class=\"glyphicon form-control-feedback hide\" aria-hidden=\"true\"></span><span>&nbsp;/&nbsp;</span><input type=\"number\" class=\"form-control\" data-js=\"exp_year\" maxlength=\"4\" size=\"4\" placeholder=\"yyyy\" id=\"exp_year\"><span class=\"glyphicon form-control-feedback hide\" aria-hidden=\"true\"></span></div></div><div class=\"form-group\"><label class=\"col-sm-3 control-label\">CVC</label><div class=\"col-sm-9 cvc\"><input type=\"number\" class=\"form-control\" data-js=\"cvc\" maxlength=\"3\" size=\"4\" id=\"cvc\"><span class=\"glyphicon form-control-feedback hide\" aria-hidden=\"true\"></span></div></div></form><div class=\"text-center\"><button data-js=\"signupBtn\" class=\"btn text-center disabled\">Become a Member!</button></div></div><div class=\"grand-total text-center row\"><span>Grand Total : </span><span>"
    + container.escapeExpression(((helper = (helper = helpers.grandTotal || (depth0 != null ? depth0.grandTotal : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"grandTotal","hash":{},"data":data}) : helper)))
    + "</span></div></div>";
},"useData":true});

};