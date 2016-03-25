module.exports = function(Handlebars) {

return Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var alias1=container.lambda, alias2=container.escapeExpression;

  return "                <li data-id=\""
    + alias2(alias1((depth0 != null ? depth0.name : depth0), depth0))
    + "\" data-js=\""
    + alias2(alias1((depth0 != null ? depth0.name : depth0), depth0))
    + "\">"
    + alias2(alias1((depth0 != null ? depth0.label : depth0), depth0))
    + "</li>            ";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

  return "<nav data-js=\"container\" class=\"row header navbar navbar-default\"><div class=\"navbar-header\"><button data-js=\"hamburger\" type=\"button\" class=\"navbar-toggle collapsed\" data-toggle=\"collapse\" data-target=\"#mobile-menu\" aria-expanded=\"false\"><span class=\"sr-only\">Toggle navigation</span><span class=\"icon-bar\"></span><span class=\"icon-bar\"></span><span class=\"icon-bar\"></span></button></div><div data-js=\"navbarCollapse\" class=\"collapse navbar-collapse\" id=\"mobile-menu\"><ul data-js=\"navLinks\" class=\"nav navbar-nav\"><li data-id=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.home : depth0)) != null ? stack1.name : stack1), depth0))
    + "\" data-js=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.home : depth0)) != null ? stack1.name : stack1), depth0))
    + "\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.home : depth0)) != null ? stack1.label : stack1), depth0))
    + "</li>            "
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.fields : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "        </ul></div><div class=\"header-title\" data-js=\"headerTitle\" data-id=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.home : depth0)) != null ? stack1.name : stack1), depth0))
    + "\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.home : depth0)) != null ? stack1.label : stack1), depth0))
    + "</div></nav>";
},"useData":true});

};