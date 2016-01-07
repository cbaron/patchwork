module.exports = function(Handlebars) {

return Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    var alias1=container.lambda, alias2=container.escapeExpression;

  return "                        <th class=\"w"
    + alias2(alias1((depth0 != null ? depth0.width : depth0), depth0))
    + "\" data-sort=\""
    + alias2(alias1((depth0 != null ? depth0.name : depth0), depth0))
    + "\">"
    + alias2(alias1((depth0 != null ? depth0.label : depth0), depth0))
    + "</th>                    ";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<div data-js=\"container\" class=\"col-sm-10 col-sm-offset-1 resource\"><div class=\"sub-heading\"><span data-js=\"subHeading\"></span><button data-js=\"createBtn\" class=\"btn btn-primary\"><span class=\"glyphicon glyphicon-plus\"></span></button></div><div class=\"row mytable\"><table data-js=\"table\"><thead data-js=\"header\"><tr class=\"clearfix\">                    "
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.fields : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "                </tr></thead><tbody data-js=\"body\"></tbody></table></div></div>";
},"useData":true});

};