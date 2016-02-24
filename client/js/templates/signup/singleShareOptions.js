module.exports = function(Handlebars) {

return Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper;

  return "<li data-js=\"container\" class=\"col-xs-12\"><div data-js=\"row\" class=\"single-share row\"><div data-js=\"shareBox\" class=\"vcenter col-sm-3\"></div><div data-js=\"options\" class=\"option vcenter col-sm-9\"></div></div><div class=\"price weekly-share-total-"
    + container.escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"id","hash":{},"data":data}) : helper)))
    + "\"></div></li>";
},"useData":true});

};