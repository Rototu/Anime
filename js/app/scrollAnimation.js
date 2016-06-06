//scrollTimeout for scroll event
(function($) {
   var uniqueCntr = 0;
   $.fn.scrolled = function (waitTime, fn) {
      if (typeof waitTime === "function") {
         fn = waitTime;
         waitTime = 10;
      }
      var tag = "scrollTimer" + uniqueCntr++;
      this.scroll(function () {
         var self = $(this);
         var timer = self.data(tag);
         if (timer) {
            clearTimeout(timer);
         }
         timer = setTimeout(function () {
            self.removeData(tag);
            fn.call(self[0]);
         }, waitTime);
         self.data(tag, timer);
      });
   }
})(jQuery);

//scroll animation controller
var ScrollModule = (function() {

   var $blueTween = $("#blueTween");
   var blueTweenWidth;
   var blueTweenOffset;
   var windowHeight;
   var relativeTopPos;
   var i = 0;

   return {

      //initialize scroll scripts
      init: function() {

         //select first menuElement
         $("#menu1").css("color", "rgb(15,15,15)");
         blueTweenWidth = $("#menu1").width() + 2 * parseInt($("#menu1").css("padding-left"));
         $blueTween.width(blueTweenWidth);

      },

      //assign controllers/handlers for main elements
      bindHandlers: function() {

         //on menuHover
         $(".menuSelector").on({
            mouseenter: function() {

               //set to init state
               $(".menuSelector").css("color", "rgb(149,149,149)");

               //get element props
               blueTweenWidth = $(this).width() + 2 * parseInt($(this).css("padding-left"));
               blueTweenOffset = $(this).offset().left;

               //animate
               $(this).css("color", "rgb(15,15,15)");
               $blueTween.animate({width: blueTweenWidth}, {queue: false, duration: 750, delay: 0, easing: "easeOutCubic"});
               $blueTween.animate({left: blueTweenOffset}, {queue: false, duration: 750, delay: 0, easing: "easeOutCubic"});

            },
            mouseleave: function() {
               //deselect element
               $(this).css("color", "rgb(149,149,149)");
               $("#menu1").css("color", "rgb(15,15,15)");
            }
         });
         $("#menuElements").on({
            //set to current state
            mouseleave: function() {
               $blueTween.animate({left: $("#menu1").offset().left}, {queue: false, duration: 750, delay: 0, easing: "easeOutCubic"});
               $blueTween.animate({width: $("#menu1").width() + 2 * parseInt($("#menu1").css("padding-left"))}, {queue: false, duration: 750, delay: 0, easing: "easeOutCubic"});
            }
         });

         //buttonScroll function
         $("#scrollUp").click(function() {
            console.log(i);
            $("html, body").stop().animate({scrollTop: (i-1)*windowHeight}, {queue: false, duration: 1000, delay: 0, easing: "easeInOutCubic"});
         });
         $("#scrollDown").click(function() {
            console.log(i);
            $("html, body").stop().animate({scrollTop: (i+1)*windowHeight}, {queue: false, duration: 1000, delay: 0, easing: "easeInOutCubic"});
         });

      },

      //onScrolling animations
      animations: function() {


         //on window scroll
         var menuPos = $("#menu").position().top;
         $(window).scrolled(function() {

            //get props
            windowHeight = $(window).height();
            relativeTopPos = $(window).scrollTop();
            i = Math.floor( relativeTopPos / windowHeight );

            //set menu pos
            if(relativeTopPos >= windowHeight) {
               $("#menu").addClass("affix").css("top", 0);
            }
            else {
               $("#menu").removeClass("affix").css("top", windowHeight + (1 - relativeTopPos / windowHeight) * 50);
            }

         });

      }

   };
})();

//execute functions only when DOM is ready
$(document).on("ready", function() {
   ScrollModule.init();
   ScrollModule.bindHandlers();
   ScrollModule.animations();
});
