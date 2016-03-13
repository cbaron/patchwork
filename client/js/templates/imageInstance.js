module.exports = function(Handlebars) {

return Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return "<figure>";
},"3":function(container,depth0,helpers,partials,data) {
    var helper;

  return "<figcaption>"
    + container.escapeExpression(((helper = (helper = helpers.caption || (depth0 != null ? depth0.caption : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"caption","hash":{},"data":data}) : helper)))
    + "</figcaption></figure>";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {};

  return ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.caption : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "    <img src=\""
    + container.escapeExpression(((helper = (helper = helpers.file || (depth0 != null ? depth0.file : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"file","hash":{},"data":data}) : helper)))
    + "\">    "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.caption : depth0),{"name":"if","hash":{},"fn":container.program(3, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "    ";
},"useData":true});

};