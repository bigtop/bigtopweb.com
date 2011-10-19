$(function() {
  
  // int
  var nextHeadingId = 1;
  
  // jQuery -> string
  function headingId(elem) {
    var ans = elem.attr("id");
    
    if(!ans) {
      ans = "_heading" + (nextHeadingId++);
      elem.attr("id", ans);
    }
    
    return ans;
  }
  
  // Add nav items for the headings on the page:
  
  var nav = $("nav");
  var navLocal = $("<ul></ul>").appendTo(nav);
  
  $("h2,h3,h4,h5,h6").each(function() {
    var self = $(this);
    var id   = headingId(self);
    var text = self.text();
    
    navLocal.append("<li><a href=\"#" + id + "\">" + text + "</a></li>");
  });
  
  // Colour the nav items in IE:
  
  $("ul", nav).each(function() {
    $("a", this).each(function(index) {
      $(this).addClass("nav" + (index % 5 + 2));
    });
  });
  
});