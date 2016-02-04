module.exports = function(Handlebars) {

return Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var alias1=container.lambda, alias2=container.escapeExpression;

  return "                <div class=\"form-group\"><label for=\""
    + alias2(alias1((depth0 != null ? depth0.name : depth0), depth0))
    + "\" class=\"col-sm-3 control-label\">"
    + alias2(alias1((depth0 != null ? depth0.label : depth0), depth0))
    + "</label><div class=\"col-sm-9\"><input type=\""
    + alias2(alias1((depth0 != null ? depth0.type : depth0), depth0))
    + "\" class=\"form-control\" data-js=\""
    + alias2(alias1((depth0 != null ? depth0.name : depth0), depth0))
    + "\"></div></div>            ";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<div data-js=\"container\" class=\"col-sm-12\"><div data-js=\"alreadyMemberHeader\" class=\"header\" style=\"display:none;\">Welcome!<span class=\"glyphicon glyphicon-ok\"></span></div><section data-js=\"memberInfo\"><div data-js=\"memberInfoHeader\" class=\"header\">Please enter your information.</div><button data-js=\"alreadyMember\" type=\"button\" class=\"btn btn-default\">Already a member?</button><form data-js=\"memberInfoFields\" class=\"form-horizontal\">            "
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.fields : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "        </form></section><section><h3>Shares</h3><ul data-js=\"shares\"></ul></section><section><h3>Share Options</h3><ul data-js=\"shareOptions\"></ul></section><section><h3>Delivery</h3><ul data-js=\"deliveryOptions\"></ul></section></div>";
},"useData":true});

};