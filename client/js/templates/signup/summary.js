module.exports = function(Handlebars) {

return Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.lambda, alias5=container.escapeExpression;

  return "            <div class=\"share-label-wrapper\">"
    + ((stack1 = ((helper = (helper = helpers.shareBox || (depth0 != null ? depth0.shareBox : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"shareBox","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</div><div class=\"share-options-summary\"><div class=\"section-title\">Share Options :</div>                "
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.selectedOptions : depth0),{"name":"each","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "            </div><div class=\"delivery-summary\"><div class=\"section-title\">Delivery :</div><div class=\"row\"><div class=\"delivery-method\"><span class=\"col-sm-3 item-label\">Method :  </span><span class=\"col-sm-5 text-center\">"
    + alias5(alias4(((stack1 = (depth0 != null ? depth0.selectedDelivery : depth0)) != null ? stack1.deliveryType : stack1), depth0))
    + "</span></div><div class=\"price\"><span class=\"col-sm-2\">$"
    + alias5(alias4(((stack1 = (depth0 != null ? depth0.selectedDelivery : depth0)) != null ? stack1.weeklyCost : stack1), depth0))
    + "</span><span class=\"col-sm-2\">per week</span></div></div>                "
    + ((stack1 = helpers["if"].call(alias1,((stack1 = (depth0 != null ? depth0.selectedDelivery : depth0)) != null ? stack1.groupdropoff : stack1),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                <div class=\"row\"><div class=\"dropoff-address\"><div class=\"col-sm-3 item-label\">Address :  </div><div class=\"delivery-address col-sm-5 text-center\">"
    + alias5(alias4(((stack1 = (depth0 != null ? depth0.selectedDelivery : depth0)) != null ? stack1.address : stack1), depth0))
    + "</div></div></div><div class=\"row\"><div class=\"pick-up\"><div class=\"col-sm-3 item-label\">Pick-up Hours :  </div><div class=\"col-sm-5 text-center\"><span>"
    + alias5(alias4(((stack1 = (depth0 != null ? depth0.selectedDelivery : depth0)) != null ? stack1.dayOfWeek : stack1), depth0))
    + " </span><span>"
    + alias5(alias4(((stack1 = (depth0 != null ? depth0.selectedDelivery : depth0)) != null ? stack1.starttime : stack1), depth0))
    + " - "
    + alias5(alias4(((stack1 = (depth0 != null ? depth0.selectedDelivery : depth0)) != null ? stack1.endtime : stack1), depth0))
    + "</span></div></div></div></div><div class=\"total\"><div class=\"row\"><div class=\"price\"><span class=\"col-sm-8\">Weekly Price :  </span><span class=\"col-sm-2\">$"
    + alias5(((helper = (helper = helpers.weeklyPrice || (depth0 != null ? depth0.weeklyPrice : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"weeklyPrice","hash":{},"data":data}) : helper)))
    + "</span><span class=\"col-sm-2\">per week</span></div></div></div><div data-js=\"datesSelected-"
    + alias5(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" class=\"selected-weeks\"><div class=\"section-title\">Dates Selected for Delivery :</div>                    "
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.datesSelected : depth0),{"name":"each","hash":{},"fn":container.program(7, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "            </div><div class=\"total row\"><div class=\"col-sm-8\">Number of weeks selected :  </div><span class=\"weeks-selected col-sm-2\">"
    + alias5(((helper = (helper = helpers.weeksSelected || (depth0 != null ? depth0.weeksSelected : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"weeksSelected","hash":{},"data":data}) : helper)))
    + "</span><span class=\"col-sm-2\">weeks</span></div>            "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.skipWeeks : depth0),{"name":"if","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "            <div class=\"total share-total row\"><span class=\"col-sm-offset-4 col-sm-4\">Share Total :  </span><span class=\"col-sm-2\">"
    + alias5(((helper = (helper = helpers.total || (depth0 != null ? depth0.total : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"total","hash":{},"data":data}) : helper)))
    + "</span></div>        ";
},"2":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "                        <div class=\"row\"><div class=\"selected-options\"><div class=\"shareoptionlabel\"><span class=\"col-sm-3 item-label\">"
    + alias4(((helper = (helper = helpers.optionName || (depth0 != null ? depth0.optionName : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"optionName","hash":{},"data":data}) : helper)))
    + " :  </span><span class=\"col-sm-5 text-center\"><span>"
    + alias4(((helper = (helper = helpers.selectedOptionLabel || (depth0 != null ? depth0.selectedOptionLabel : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"selectedOptionLabel","hash":{},"data":data}) : helper)))
    + "</span>                                    "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.unit : depth0),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                                    </span></div><div class=\"price\"><span class=\"col-sm-2\">"
    + alias4(((helper = (helper = helpers.price || (depth0 != null ? depth0.price : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"price","hash":{},"data":data}) : helper)))
    + "</span><span class=\"col-sm-2\">per week</span></div></div></div>                ";
},"3":function(container,depth0,helpers,partials,data) {
    var helper;

  return "                                        <span>"
    + container.escapeExpression(((helper = (helper = helpers.unit || (depth0 != null ? depth0.unit : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"unit","hash":{},"data":data}) : helper)))
    + "</span>                                    ";
},"5":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "                    <div class=\"row\"><div class=\"dropoff-location\"><span class=\"col-sm-3 item-label\">Drop-off Location :  </span><span class=\"col-sm-5 text-center\">"
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.selectedDelivery : depth0)) != null ? stack1.groupdropoff : stack1), depth0))
    + "</span></div></div>                ";
},"7":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "                            <div class=\"date\"><span>"
    + alias4(((helper = (helper = helpers.monthNum || (depth0 != null ? depth0.monthNum : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"monthNum","hash":{},"data":data}) : helper)))
    + "/</span><span>"
    + alias4(((helper = (helper = helpers.dayOfMonth || (depth0 != null ? depth0.dayOfMonth : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"dayOfMonth","hash":{},"data":data}) : helper)))
    + ",</span></div>                    ";
},"9":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "                <div class=\"absent-dates\"><div class=\"section-title\">Dates Absent :</div>                        "
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.skipWeeks : depth0),{"name":"each","hash":{},"fn":container.program(10, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                    </div></div>            ";
},"10":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "                            <div class=\"date\"><span>"
    + alias4(((helper = (helper = helpers.dayOfMonth || (depth0 != null ? depth0.dayOfMonth : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"dayOfMonth","hash":{},"data":data}) : helper)))
    + "-"
    + alias4(((helper = (helper = helpers.month || (depth0 != null ? depth0.month : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"month","hash":{},"data":data}) : helper)))
    + ",</span></div>                        ";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<div data-js=\"container\" class=\"summary col-xs-10 col-xs-offset-1 col-sm-10 col-sm-offset-1\"><div class=\"share-summary\"><div class=\"header\">Summary of Shares</div>        "
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.shares : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "    </div><div data-js=\"grandTotal\" class=\"grand-total text-center row\"></div><div class=\"payment\"><div class=\"header\">Select a method of payment</div><div data-js=\"paymentOptions\"></div><form data-js=\"paymentForm\" class=\"hide form-horizontal\"><div class=\"credit-card-info form-group\"><label class=\"col-sm-3 control-label number\">Card Number</label><div class=\"col-sm-9\"><input type=\"text\" class=\"form-control\" data-js=\"number\" id=\"number\"><span class=\"glyphicon form-control-feedback hide\" aria-hidden=\"true\"></span><span class=\"accepted-cards\">Visa, MasterCard, American Express, JCB, Discover, and Diners Club are accepted</span></div></div><div class=\"form-group\"><label class=\"col-sm-3 control-label\">Expiration</label><div class=\"col-sm-9 expiration\"><input type=\"number\" class=\"form-control\" data-js=\"exp_month\" maxlength=\"2\" size=\"3\" placeholder=\"mm\" id=\"exp_month\"><span class=\"glyphicon form-control-feedback hide\" aria-hidden=\"true\"></span><span>&nbsp;/&nbsp;</span><input type=\"number\" class=\"form-control\" data-js=\"exp_year\" maxlength=\"4\" size=\"4\" placeholder=\"yyyy\" id=\"exp_year\"><span class=\"glyphicon form-control-feedback hide\" aria-hidden=\"true\"></span></div></div><div class=\"form-group\"><label class=\"col-sm-3 control-label\">CVC</label><div class=\"col-sm-9 cvc\"><input type=\"number\" class=\"form-control\" data-js=\"cvc\" maxlength=\"3\" size=\"4\" id=\"cvc\"><span class=\"glyphicon form-control-feedback hide\" aria-hidden=\"true\"></span></div></div></form><div class=\"text-center\"><button data-js=\"signupBtn\" class=\"btn text-center disabled\">Become a Member!</button></div></div></div>";
},"useData":true});

};