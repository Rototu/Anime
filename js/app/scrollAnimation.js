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
            if($('body').scrollTop() > i * windowHeight) i++;
            var scrollValue = (i-1)*windowHeight - $("#menu").height();
            if( i >= 2 && scrollValue < $(window).height() ) scrollValue = $(window).height();
            $("html, body").stop().animate({scrollTop: scrollValue}, {queue: false, duration: 1000, delay: 0, easing: "easeInOutCubic"});
         });
         $("#scrollDown").click(function() {
            console.log(i);
            if($('body').scrollTop() < windowHeight) i = 0;
            var scrollValue = (i+1)*windowHeight - $("#menu").height();
            if($('body').scrollTop() < windowHeight) scrollValue += $("#menu").height();
            $("html, body").stop().animate({scrollTop: scrollValue}, {queue: false, duration: 1000, delay: 0, easing: "easeInOutCubic"});
         });

         //menuSelector clicked move to page
         $(".menuSelector").click(function() {
            var id = this.id;
            var mySect = id.substr(id.length - 1);
            var scrollValue = mySect*windowHeight - $("#menu").height();
            $("html, body").stop().animate({scrollTop: scrollValue}, {queue: false, duration: 1000, delay: 0, easing: "easeInOutCubic"});
         });

      },

      //onScrolling animations
      animations: function() {


         //on window scroll
         var menuPos = $("#menu").position().top;
         var j = 1;

         $('body').scroll(function() {
            scrollAnimation();
         });

         var scrollAnimation = function() {

            //get props
            windowHeight = $('body').height();
            relativeTopPos = $('body').scrollTop();
            i = Math.floor( (relativeTopPos + $("#menu").height()) / windowHeight );

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
            if(relativeTopPos >= windowHeight) {
               console.log("menu fixed");
               $("#menu").addClass("affix").css("top", 0);
               $("#prezentareImg").addClass("affix").removeClass("bottomSticky");
            }
            if(relativeTopPos >= 2*windowHeight) {
               console.log("img sticked to bottom");
               $("#prezentareImg").removeClass("affix").addClass("bottomSticky");
            }
            if(relativeTopPos <= windowHeight) {
               console.log("animating " + relativeTopPos + " " + windowHeight);
               $("#prezentareImg").removeClass("affix").css("left", ((relativeTopPos / windowHeight * 10) - 10)  + "vw").css("height", ((relativeTopPos / windowHeight * 20) + 60)  + "vh");
               $("#menu").removeClass("affix").css("top", windowHeight + (1 - relativeTopPos / windowHeight) * 50);
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
