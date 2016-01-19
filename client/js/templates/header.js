module.exports = function(Handlebars) {

return Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var alias1=container.lambda, alias2=container.escapeExpression;

  return "                        <li data-id=\""
    + alias2(alias1((depth0 != null ? depth0.name : depth0), depth0))
    + "\" data-js="
    + alias2(alias1((depth0 != null ? depth0.name : depth0), depth0))
    + ">"
    + alias2(alias1((depth0 != null ? depth0.label : depth0), depth0))
    + "</li>                    ";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

  return "<div data-js=\"container\" class=\"header-class\"><nav class=\"navbar navbar-default><div class=\"container-fluid\"><div class=\"row navbar-header\"><button type=\"button\" class=\"navbar-toggle collapsed\" data-toggle=\"collapse\" data-target=\"#bs-example-navbar-collapse-1\" aria-expanded=\"false\"><span class=\"sr-only\">Toggle navigation</span><span class=\"icon-bar\"></span><span class=\"icon-bar\"></span><span class=\"icon-bar\"></span></button></div><div class=\"collapse navbar-collapse\"><ul class=\"nav navbar-nav\">                    "
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.fields : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                </ul></div><div id=\"headerTitle\" data-js=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.home : depth0)) != null ? stack1.name : stack1), depth0))
    + "\" data-id=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.home : depth0)) != null ? stack1.name : stack1), depth0))
    + "\"><h1 class=\"site-title\"><span class=\"site-title-span\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.home : depth0)) != null ? stack1.label : stack1), depth0))
    + "</span></h1></div></div></nav></div>";
},"useData":true});

};