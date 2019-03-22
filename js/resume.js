(function($) {
    "use strict"; // Start of use strict

    // Smooth scrolling using jQuery easing
    $('a.js-scroll-trigger[href*="#"]:not([href="#"])').click(function() {
      if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
        var target = $(this.hash);
        target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
        if (target.length) {
          $('html, body').animate({
            scrollTop: (target.offset().top)
          }, 1000, "easeInOutExpo");
          return false;
        }
      }
    });

  // Closes responsive menu when a scroll trigger link is clicked
  $('.js-scroll-trigger').click(function() {
    $('.navbar-collapse').collapse('hide');
  });

  // Activate scrollspy to add active class to navbar items on scroll
  $('body').scrollspy({
    target: '#sideNav'
  });

})(jQuery); // End of use strict
// jQuery(document).ready(function(){
//   var $window = $(window);
//   var $elem = $(".animation")

//   function isScrolledIntoView($elem, $window) {
//     var docViewTop = $window.scrollTop();
//     var docViewBottom = docViewTop + $window.height();

//     var elemTop = $elem.offset().top;
//     var elemBottom = elemTop + $elem.height();

//     return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
//   }


//   $(document).on("scroll", function () {
//     if (isScrolledIntoView($elem, $window)) {

//       var delay = 500;
//       $(".progress-bar").each(function(i){
//         $(this).delay( delay*i ).animate( { width: $(this).attr('aria-valuenow') + '%' }, delay );

//         $(this).prop('Counter',0).animate({
//           Counter: $(this).text()
//         }, {
//           duration: delay,
//           easing: 'swing',
//           step: function (now) {
//             $(this).text(Math.ceil(now)+'%');
//           }
//         });
//       });

//       $elem.addClass("animate")
//     }
//   });
// });

var $window = $(window);
var $elem = $(".animation");
var $gotOutOfFrame = false;

function isScrolledIntoView($elem, $window) {
  var docViewTop = $window.scrollTop();
  var docViewBottom = docViewTop + $window.height();

  var elemTop = $elem.offset().top;
  var elemBottom = elemTop + $elem.height();

  return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop) && $gotOutOfFrame);
}

function isScrolledOutView($elem, $window) {
  var docViewTop = $window.scrollTop();
  var docViewBottom = docViewTop + $window.height();

  var elemTop = $elem.offset().top;
  var elemBottom = elemTop + $elem.height();

  return ((elemBottom > docViewBottom) && (elemTop > docViewTop));
}

$(document).on("scroll", function() {
  if (isScrolledIntoView($elem, $window)) {
    $gotOutOfFrame = false;
    $elem.addClass("animate");

    var delay = 500;
    $(".progress-bar").each(function(i){
      $(this).delay( delay*i ).animate( { width: $(this).attr('aria-valuenow') + '%' }, delay );

      $(this).prop('Counter',0).animate({
        Counter: $(this).text()
      }, {
        duration: delay,
        easing: 'swing',
        step: function (now) {
          $(this).text(Math.ceil(now)+'%');
        }
      });
    });
  }
  if (isScrolledOutView($elem, $window)) {
   $gotOutOfFrame = true;

 }
});

