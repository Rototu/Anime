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
   var i = 1;

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
               $("#menu"+i).css("color", "rgb(15,15,15)");
            }
         });
         $("#menuElements").on({

            //set to current state
            mouseleave: function() {

               //get el props
               blueTweenWidth = $("#menu"+i).width() + 2 * parseInt($("#menu"+i).css("padding-left"))
               blueTweenOffset = $("#menu"+i).offset().left;

               //animate
               $blueTween.animate({left: blueTweenOffset}, {queue: false, duration: 750, delay: 0, easing: "easeOutCubic"});
               $blueTween.animate({width: blueTweenWidth}, {queue: false, duration: 750, delay: 0, easing: "easeOutCubic"});
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
         var j = 1;
         $(window).scrolled(function() {

            //get props
            windowHeight = $(window).height();
            relativeTopPos = $(window).scrollTop();
            i = Math.floor( (relativeTopPos + $("#menu").height()) / windowHeight );
            if(i == 0) i=1;
            if(j != i) {

               j = i;

               //get el props
               blueTweenWidth = $("#menu"+i).width() + 2 * parseInt($("#menu"+i).css("padding-left"))
               blueTweenOffset = $("#menu"+i).offset().left;

               //animate
               $blueTween.animate({left: blueTweenOffset}, {queue: false, duration: 750, delay: 0, easing: "easeOutCubic"});
               $blueTween.animate({width: blueTweenWidth}, {queue: false, duration: 750, delay: 0, easing: "easeOutCubic"});
               $(".menuSelector").css("color", "rgb(149,149,149)");
               $("#menu"+i).css("color", "rgb(15,15,15)");

            }

            //set menu pos
            if(relativeTopPos >= windowHeight) {
               $("#menu").addClass("affix").css("top", 0);
            }
            else {
               $("#menu").removeClass("affix").css("top", windowHeight + (1 - relativeTopPos / windowHeight) * 50);
            }

         });

      },

      resizeElements: function() {

         //vars
         var ii = $("#menu"+i).offset().left;

         //functions
         if(ii != blueTweenOffset) {
            blueTweenOffset =  ii;

            //get el props
            blueTweenWidth = $("#menu"+i).width() + 2 * parseInt($("#menu"+i).css("padding-left"))
            blueTweenOffset = $("#menu"+i).offset().left;

            //animate
            $blueTween.animate({left: blueTweenOffset}, {queue: false, duration: 750, delay: 0, easing: "easeOutCubic"});
            $blueTween.animate({width: blueTweenWidth}, {queue: false, duration: 750, delay: 0, easing: "easeOutCubic"});
            $(".menuSelector").css("color", "rgb(149,149,149)");
            $("#menu"+i).css("color", "rgb(15,15,15)");

            console.log("menu resized");
         }
      }

   };
})();

//execute functions only when DOM is ready
$(document).on("ready", function() {
   ScrollModule.init();
   ScrollModule.bindHandlers();
   ScrollModule.animations();
   $(window).resize(function() {
      ScrollModule.resizeElements();
   });
});
