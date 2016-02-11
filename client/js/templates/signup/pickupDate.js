module.exports = function(Handlebars) {

return Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div data-js=\"container\" class=\"col-xs-4 col-sm-2 pickup-date\"><div>"
    + alias4(((helper = (helper = helpers.dayOfWeek || (depth0 != null ? depth0.dayOfWeek : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"dayOfWeek","hash":{},"data":data}) : helper)))
    + "</div><div>"
    + alias4(((helper = (helper = helpers.month || (depth0 != null ? depth0.month : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"month","hash":{},"data":data}) : helper)))
    + "</div><div>"
    + alias4(((helper = (helper = helpers.dayOfMonth || (depth0 != null ? depth0.dayOfMonth : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"dayOfMonth","hash":{},"data":data}) : helper)))
    + "</div></div>";
},"useData":true});

};