module.exports = function(Handlebars) {

return Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<li data-js=\"container\" class=\"payment-option col-sm-3\"><div>"
    + alias4(((helper = (helper = helpers.label || (depth0 != null ? depth0.label : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"label","hash":{},"data":data}) : helper)))
    + "</div><div>"
    + alias4(((helper = (helper = helpers.note || (depth0 != null ? depth0.note : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"note","hash":{},"data":data}) : helper)))
    + "</div></li>";
},"useData":true});

};