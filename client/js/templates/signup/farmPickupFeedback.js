module.exports = function(Handlebars) {

return Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div class=\"message\">On-farm pickup available "
    + alias4(((helper = (helper = helpers.dayOfWeek || (depth0 != null ? depth0.dayOfWeek : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"dayOfWeek","hash":{},"data":data}) : helper)))
    + " : "
    + alias4(((helper = (helper = helpers.starttime || (depth0 != null ? depth0.starttime : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"starttime","hash":{},"data":data}) : helper)))
    + " - "
    + alias4(((helper = (helper = helpers.endtime || (depth0 != null ? depth0.endtime : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"endtime","hash":{},"data":data}) : helper)))
    + "</div>";
},"useData":true});

};