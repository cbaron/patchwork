module.exports = function(Handlebars) {

return Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div><div>Because you have selected home delivery, and your address could not be validated automatically, we would like you to verify your address and zip code</div><form class=\"form-horizontal\"><div class=\"form-group\"><label class=\"col-sm-3 control-label\">Address</label><div class=\"col-sm-9\"><input type=\"text\" class=\"form-control\" id=\"verifiedAddress\" value=\""
    + alias4(((helper = (helper = helpers.address || (depth0 != null ? depth0.address : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"address","hash":{},"data":data}) : helper)))
    + "\"></div></div><div class=\"form-group\"><label class=\"col-sm-3 control-label\">Zip Code</label><div class=\"col-sm-9\"><input type=\"text\" class=\"form-control\" id=\"verifiedZipCode\" value=\""
    + alias4(((helper = (helper = helpers.zipCode || (depth0 != null ? depth0.zipCode : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"zipCode","hash":{},"data":data}) : helper)))
    + "\"></div></div></form></div>";
},"useData":true});

};