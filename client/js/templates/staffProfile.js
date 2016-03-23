module.exports = function(Handlebars) {

return Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div class=\"bio clearfix\"><img src=\"/file/"
    + alias4(((helper = (helper = helpers.tableName || (depth0 != null ? depth0.tableName : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"tableName","hash":{},"data":data}) : helper)))
    + "/image/"
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "\" alt=\"Staff photo\"><div class=\"inner\"><h3>"
    + alias4(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data}) : helper)))
    + "</h3><div>"
    + alias4(((helper = (helper = helpers.profile || (depth0 != null ? depth0.profile : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"profile","hash":{},"data":data}) : helper)))
    + "</div></div></div><hr>";
},"useData":true});

};