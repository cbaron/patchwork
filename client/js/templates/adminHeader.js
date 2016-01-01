module.exports = function(Handlebars) {

return Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper;

  return "<nav data-js=\"container\" class=\"admin-header\"><div class=\"clearfix hidden-xs\"><div class=\"logo-container\"><img src=\""
    + container.escapeExpression(((helper = (helper = helpers.logo || (depth0 != null ? depth0.logo : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"logo","hash":{},"data":data}) : helper)))
    + "\"/></div><div data-js=\"userPanel\" class=\"pull-right hide\"><span data-js=\"name\"></span><span data-js=\"profileBtn\" class=\"glyphicon glyphicon-user\"></span></div></div></nav>";
},"useData":true});

};