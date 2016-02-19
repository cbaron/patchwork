module.exports = function(Handlebars) {

return Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

  return "<div data-js=\"container\" class=\"home-class client-view\"><h4>Fresh food from farmers you know!</h4><h3><a href=\"https://docs.google.com/forms/d/1aBjdeNcfd9Xa8XyLlM_tqg5NT_IUZVyluj4a5oC5M94/viewform\" target=\"_blank\">2016 CSA Sign-up Form!</a></h3><div data-js=\"carousel\" id=\"carousel\" class=\"carousel slide\"><div data-js=\"carouselInner\" class=\"carousel-inner\" role=\"listbox\"><div class=\"item active\"><img src=\"/static/img/"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.image : depth0)) != null ? stack1.path : stack1), depth0))
    + "\" alt=\""
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.image : depth0)) != null ? stack1.description : stack1), depth0))
    + "\"></div></div><a class=\"left carousel-control\" href=\"#carousel\" role=\"button\" data-slide=\"prev\"><span class=\"glyphicon glyphicon-chevron-left\" aria-hidden=\"true\"></span><span class=\"sr-only\">Previous</span></a><a class=\"right carousel-control\" href=\"#carousel\" role=\"button\" data-slide=\"next\"><span class=\"glyphicon glyphicon-chevron-right\" aria-hidden=\"true\"></span><span class=\"sr-only\">Next</span></a></div></div>";
},"useData":true});

};