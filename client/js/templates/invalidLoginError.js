module.exports = function(Handlebars) {

return Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<div data-js=\"invalidLoginError\" class=\"alert alert-danger\" role=\"alert\">"
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? depth0.error : depth0)) != null ? stack1.message : stack1), depth0))
    + "</div>";
},"useData":true});

};