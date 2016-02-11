module.exports = function(Handlebars) {

return Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression, alias5=container.lambda;

  return "        <div class=\"row\">"
    + alias4(((helper = (helper = helpers.label || (depth0 != null ? depth0.label : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"label","hash":{},"data":data}) : helper)))
    + "</div><div class=\"row text-center\"><span>"
    + alias4(((helper = (helper = helpers.humanStartDate || (depth0 != null ? depth0.humanStartDate : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"humanStartDate","hash":{},"data":data}) : helper)))
    + "</span><span>-</span><span>"
    + alias4(((helper = (helper = helpers.humanEndDate || (depth0 != null ? depth0.humanEndDate : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"humanEndDate","hash":{},"data":data}) : helper)))
    + "</span></div>        "
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.selectedOptions : depth0),{"name":"each","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "        <div class=\"row\"><span>Delivery Method : </span><span>"
    + alias4(alias5(((stack1 = (depth0 != null ? depth0.selectedDelivery : depth0)) != null ? stack1.label : stack1), depth0))
    + "</span><span>"
    + alias4(alias5(((stack1 = (depth0 != null ? depth0.selectedDelivery : depth0)) != null ? stack1.address : stack1), depth0))
    + "</span></div><div class=\"row\"><span>Skipping Pickup</span>            "
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.skipWeeks : depth0),{"name":"each","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "         </div><div class=\"row\"><span>Total</span><span>"
    + alias4(((helper = (helper = helpers.total || (depth0 != null ? depth0.total : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"total","hash":{},"data":data}) : helper)))
    + "</span></div>    ";
},"2":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "            <div class=\"row\"><span>"
    + alias4(((helper = (helper = helpers.shareoptionlabel || (depth0 != null ? depth0.shareoptionlabel : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"shareoptionlabel","hash":{},"data":data}) : helper)))
    + "</span><span>"
    + alias4(((helper = (helper = helpers.label || (depth0 != null ? depth0.label : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"label","hash":{},"data":data}) : helper)))
    + "</span><span>"
    + alias4(((helper = (helper = helpers.value || (depth0 != null ? depth0.value : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"value","hash":{},"data":data}) : helper)))
    + "</span></div>        ";
},"4":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "                <span>"
    + alias4(((helper = (helper = helpers.month || (depth0 != null ? depth0.month : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"month","hash":{},"data":data}) : helper)))
    + "</span><span>"
    + alias4(((helper = (helper = helpers.dayOfMonth || (depth0 != null ? depth0.dayOfMonth : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"dayOfMonth","hash":{},"data":data}) : helper)))
    + "</span>             ";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {};

  return "<div class=\"summary col-xs-10 col-xs-offset-1 col-sm-8 col-sm-offset-2\">    "
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.shares : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "    <div class=\"row\"><span>Grand Total : </span><span>"
    + container.escapeExpression(((helper = (helper = helpers.grandTotal || (depth0 != null ? depth0.grandTotal : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"grandTotal","hash":{},"data":data}) : helper)))
    + "</span></div></div>";
},"useData":true});

};