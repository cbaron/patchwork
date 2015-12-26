module.exports = function(Handlebars) {

return Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper;

  return "<!DOCTYPE html><html><head><link rel=\"stylesheet\" type=\"text/css\" href=\"/static/css/bootstrap.min.css\"><link rel=\"stylesheet\" type=\"text/css\" href=\"/static/css/bootstrap-datetimepicker.min.css\"><link rel=\"stylesheet\" type=\"text/css\" href=\"/static/css/bundle.css\"><meta charset=\"UTF-8\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"><script src=\"/static/js/bundle.js\"></script><title>"
    + container.escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"title","hash":{},"data":data}) : helper)))
    + "</title></head><body><div class=\"container-fluid\"><div class=\"row\" id=\"content\"></div></div></body></html>";
},"useData":true});

};