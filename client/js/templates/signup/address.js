module.exports = function(Handlebars) {

return Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div data-js=\"container\" class=\"address\">"
    + alias4(((helper = (helper = helpers.streetNumber || (depth0 != null ? depth0.streetNumber : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"streetNumber","hash":{},"data":data}) : helper)))
    + " "
    + alias4(((helper = (helper = helpers.street || (depth0 != null ? depth0.street : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"street","hash":{},"data":data}) : helper)))
    + " "
    + alias4(((helper = (helper = helpers.city || (depth0 != null ? depth0.city : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"city","hash":{},"data":data}) : helper)))
    + ", "
    + alias4(((helper = (helper = helpers.stateAbbr || (depth0 != null ? depth0.stateAbbr : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"stateAbbr","hash":{},"data":data}) : helper)))
    + " "
    + alias4(((helper = (helper = helpers.postalCode || (depth0 != null ? depth0.postalCode : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"postalCode","hash":{},"data":data}) : helper)))
    + "</div>";
},"useData":true});

};