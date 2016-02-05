module.exports = function(Handlebars) {

return Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var alias1=container.lambda, alias2=container.escapeExpression;

  return "                    <div class=\"form-group\"><label for=\""
    + alias2(alias1((depth0 != null ? depth0.name : depth0), depth0))
    + "\" class=\"col-sm-3 control-label\">"
    + alias2(alias1((depth0 != null ? depth0.label : depth0), depth0))
    + "</label><div class=\"col-sm-9\"><input type=\""
    + alias2(alias1((depth0 != null ? depth0.type : depth0), depth0))
    + "\" class=\"form-control\" data-js=\""
    + alias2(alias1((depth0 != null ? depth0.name : depth0), depth0))
    + "\"></div></div>                ";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<div data-js=\"container\" class=\"col-sm-12\"><div class=\"row intro\"><div class=\"col-sm-8 col-sm-offset-2\">Suspendisse dui dui, lobortis a diam sed, malesuada mollis sem. Aenean lacinia eleifend magna, nec convallis quam consequat at. Phasellus non faucibus nibh. Sed non eleifend justo, eget blandit lectus. Nulla erat erat, suscipit sit amet dictum vel, maximus eget nisi. Nam massa erat, ultricies in nisl vel, maximus vulputate velit. Morbi vestibulum tempor enim eget vehicula. Cras tempus rutrum lacus, ac accumsan tortor commodo eget. Integer dapibus, diam eu pulvinar facilisis, nisi arcu finibus quam, sed consequat nunc lorem vel ante. Nunc at mauris eu nisi ornare sagittis eu ut nibh. Nunc ligula elit, mattis vel venenatis sit amet, venenatis sit amet dolor. Vestibulum dapibus eros ac eros ullamcorper, finibus ornare sem dapibus. Donec porttitor erat turpis, nec auctor ipsum eleifend vel. Vivamus consectetur porttitor ante vitae cursus. Pellentesque ac urna eros.</div></div><section class=\"row\" data-js=\"memberInfo\"><div class=\"col-sm-12 text-center\" data-js=\"memberInfoHeader\"><span class=\"header\">Please enter your information.</span><button data-js=\"alreadyMember\" type=\"button\" class=\"btn btn-link\">Already a member?</button></div><div class=\"col-sm-6 col-sm-offset-3\"><form data-js=\"memberInfoFields\" class=\"form-horizontal\">                "
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.fields : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "            </form></div></section><section class=\"row\"><h3>Shares</h3><ul data-js=\"shares\"></ul></section><section class=\"row\"><h3>Share Options</h3><ul data-js=\"shareOptions\"></ul></section><section class=\"row\"><h3>Delivery</h3><ul data-js=\"deliveryOptions\"></ul></section></div>";
},"useData":true});

};