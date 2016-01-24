module.exports = function(Handlebars) {

return Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<!DOCTYPE html><html><head><link rel=\"stylesheet\" type=\"text/css\" href=\"/static/css/bootstrap.min.css\"><link rel=\"stylesheet\" type=\"text/css\" href=\"/static/css/bootstrap-datetimepicker.min.css\"><link rel=\"stylesheet\" type=\"text/css\" href=\"/static/css/typeahead.css\"><link rel=\"stylesheet\" type=\"text/css\" href=\"/static/css/bundle.css\"><meta charset=\"UTF-8\"><meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"><script src=\"/static/js/bundle.js\"></script><script src=\"/static/js/bootstrap-typeahead.js\"></script><title>"
    + alias4(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"title","hash":{},"data":data}) : helper)))
    + "</title></head><body class=\""
    + alias4(((helper = (helper = helpers.bodyClass || (depth0 != null ? depth0.bodyClass : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"bodyClass","hash":{},"data":data}) : helper)))
    + "\"><div class=\"container-fluid\"><div class=\"row\" id=\"content\"></div></div></body></html>";
},"useData":true});

};