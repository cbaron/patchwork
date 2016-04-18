module.exports = function(Handlebars) {

return Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div data-js=\"container\" class=\"dropoff col-sm-9\"><div>"
    + alias4(((helper = (helper = helpers.label || (depth0 != null ? depth0.label : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"label","hash":{},"data":data}) : helper)))
    + "</div><div>"
    + alias4(((helper = (helper = helpers.address || (depth0 != null ? depth0.address : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"address","hash":{},"data":data}) : helper)))
    + "</div><div>"
    + alias4(((helper = (helper = helpers.dayOfWeek || (depth0 != null ? depth0.dayOfWeek : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"dayOfWeek","hash":{},"data":data}) : helper)))
    + " : "
    + alias4(((helper = (helper = helpers.starttime || (depth0 != null ? depth0.starttime : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"starttime","hash":{},"data":data}) : helper)))
    + " - "
    + alias4(((helper = (helper = helpers.endtime || (depth0 != null ? depth0.endtime : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"endtime","hash":{},"data":data}) : helper)))
    + "</div></div>";
},"useData":true});

};