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
   var $prezTxt = $("#prezentareTxt");
   var prezTxtWidth = $prezTxt.width();
   var prezTxtHeight = $prezTxt.height();

   return {

      //initialize scroll scripts
      init: function() {

         //select first menuElement
         $("#menu1").css("color", "rgb(15,15,15)");
         blueTweenWidth = $("#menu1").width() + 2 * parseInt($("#menu1").css("padding-left"));
         $blueTween.width(blueTweenWidth);
         
         //set parallax font size
         prezTxtWidth = $prezTxt.width();
         $prezTxt.css("font-size", prezTxtWidth / 15);

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
            var mySect = Math.floor((relativeTopPos + 10) / windowHeight);
            console.log(mySect); 
            var scrollValue = (mySect - 1) * windowHeight - $("#menu").height();
            if((relativeTopPos + 10) / windowHeight >= 1.1 && (relativeTopPos + 10) / windowHeight < 3) scrollValue = $(window).height();
            else if(mySect == 1) scrollValue = 0;
            $("html, body").stop().animate({scrollTop: scrollValue}, {queue: false, duration: 1000, delay: 0, easing: "easeInOutCubic"});
         });
         $("#scrollDown").click(function() {
            var mySect = Math.floor( (relativeTopPos + $("#menu").height()) / windowHeight ); 
            console.log(mySect); 
            var scrollValue = (mySect + 1) * windowHeight - $("#menu").height();
            if(mySect == 0) scrollValue = 2 * $(window).height() - $("#menu").height();
            $("html, body").stop().animate({scrollTop: scrollValue}, {queue: false, duration: 1000, delay: 0, easing: "easeInOutCubic"});
         });

         //menuSelector clicked move to page
         $(".menuSelector").click(function() {
            var id = this.id;
            var mySect = id.substr(id.length - 1);
            var scrollValue = $(".prez" + mySect).position().top - $("#menu").height();
            if( mySect == 1 ) scrollValue = windowHeight;
            $("html, body").stop().animate({scrollTop: scrollValue}, {queue: false, duration: 1000, delay: 0, easing: "easeInOutCubic"});
         });

      },

      //onScrolling animations
      animations: function() {


         //on window scroll
         var menuPos = $("#menu").position().top;
         var j = 1;

         $(window).scroll(function() {
            scrollAnimation();
         });

         var scrollAnimation = function() {

            //get props
            windowHeight = $(window).height();
            relativeTopPos = $(window).scrollTop();
            if(relativeTopPos < 3 * windowHeight - $("#menu").height()) {
               i = 1;
            }
            else if(relativeTopPos < 4 * windowHeight - $("#menu").height()) {
               i = 2;
            }

            //set selected menu button
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
            if(relativeTopPos <= windowHeight) {
               $prezTxt.removeClass("affix");
               $("#prezentareImg").removeClass("affix").css("left", ((relativeTopPos / windowHeight * 10) - 10)  + "vw").css("height", ((relativeTopPos / windowHeight * 20) + 60)  + "vh");
               $("#menu").removeClass("affix").css("top", windowHeight + (1 - relativeTopPos / windowHeight) * 50);
            }
            if(relativeTopPos >= windowHeight && relativeTopPos < 2 * windowHeight) {
               $("#menu").addClass("affix").css("top", 0);
               $("#prezentareImg").addClass("affix").removeClass("bottomSticky");
               $prezTxt.addClass("affix").removeClass("bottomSticky");
               var scale = relativeTopPos / windowHeight;
               $prezTxt.css({
                  transform: "scale(" + scale + ")"
               });
               // $prezTxt.css("width", (30 + 10 * (relativeTopPos - windowHeight) / windowHeight) + "vw");
               // prezTxtWidth = $prezTxt.width();
               // $prezTxt.css("font-size", prezTxtWidth / 15);
            }
            if(relativeTopPos >= 2 * windowHeight) {
               $("#prezentareImg").removeClass("affix").addClass("bottomSticky");
               $prezTxt.removeClass("affix").addClass("bottomSticky");
            }

         }

      },

      resizeElements: function() {

         //vars
         var ii = $("#menu"+i).offset().left;
         var windowHeight = $(window).height();

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
