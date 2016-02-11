module.exports = function(Handlebars) {

return Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper;

  return "<li data-js=\"container\" class=\"col-xs-12\"><div class=\"row\"><div class=\"col-sm-3\">"
    + container.escapeExpression(((helper = (helper = helpers.label || (depth0 != null ? depth0.label : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"label","hash":{},"data":data}) : helper)))
    + "</div><div class=\"col-sm-9\"><div class=\"row\" data-js=\"dates\"></div></div></div></li>";
},"useData":true});

};