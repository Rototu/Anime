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
   var imgGridList = $(".grid-item");
   var section = [];

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

         //scroll init to top
         // window.scrollTo(0, 0);
         // $("html, body").scrollTop(0);

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
         // $("#scrollUp").click(function() {
         //    var mySect = Math.floor((relativeTopPos + 10) / windowHeight);
         //    console.log(mySect);
         //    var scrollValue = (mySect - 1) * windowHeight - $("#menu").height();
         //    if((relativeTopPos + 10) / windowHeight >= 1.1 && (relativeTopPos + 10) / windowHeight < 3) scrollValue = $(window).height();
         //    else if(mySect == 1) scrollValue = 0;
         //    $("html, body").stop().animate({scrollTop: scrollValue}, {queue: false, duration: 1000, delay: 0, easing: "easeInOutCubic"});
         // });
         // $("#scrollDown").click(function() {
         //    var mySect = Math.floor( (relativeTopPos + $("#menu").height()) / windowHeight );
         //    console.log(mySect);
         //    var scrollValue = (mySect + 1) * windowHeight - $("#menu").height();
         //    if(mySect == 0) scrollValue = 2 * $(window).height() - $("#menu").height();
         //    $("html, body").stop().animate({scrollTop: scrollValue}, {queue: false, duration: 1000, delay: 0, easing: "easeInOutCubic"});
         // });

         //menuSelector clicked move to page
         $(".menuSelector").click(function() {
            var id = this.id;
            var mySect = id.substr(id.length - 1);
            var scrollValue = section[mySect];
            $("html, body").stop().animate({scrollTop: scrollValue}, {queue: false, duration: 1000, delay: 0, easing: "easeInOutCubic"});
         });

      },

      //onScrolling animations
      animations: function() {


         //init vars
         var prezTxtTop;
         var menuPos = $("#menu").position().top;
         var j = 1;

         //jScrollability
         $.jScrollability([
            {
                'selector': '.grid',
                'start': 'parent',
                'end': 'parent',
                'fn': function($el,pcnt) {
                    var $img = $('.grid-item');
                    var point = Math.floor(($img.length+1) * pcnt);
                    $img.each(function(i,el) {
                        var $myEl = $(el);
                        if (i < point - 10) {
                            $myEl.css({opacity: 1});
                        } else {
                            $myEl.css({opacity: 0});
                        }
                    });
                }
            }
        ]);

         //window scroll handler
         $(window).scroll(function() {
            scrollAnimation();
         });

         var scrollAnimation = function() {

            //get props
            windowHeight = $(window).height();
            relativeTopPos = $(window).scrollTop();
            if(relativeTopPos >= section[1]) i = 1;
            if(relativeTopPos >= section[2]) i = 2;
            if(relativeTopPos >= section[3]) i = 3;

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
               prezTxtTop = $prezTxt.css("top");
            }
            if(relativeTopPos >= windowHeight && relativeTopPos < 2 * windowHeight) {
               $("#menu").addClass("affix").css("top", 0);
               $("#prezentareImg").addClass("affix").removeClass("bottomSticky");
               $prezTxt.addClass("affix").removeClass("bottomSticky");
               var scale = 0.705 + 0.25 * (relativeTopPos / windowHeight - 1);
               $prezTxt.css({
                  transform: "scale(" + scale + ")",
                  right: "50px"
               });
            }
            if(relativeTopPos >= 2 * windowHeight) {
               $("#prezentareImg").removeClass("affix").addClass("bottomSticky");
               $prezTxt.removeClass("affix").addClass("bottomSticky");
            }

            //debug

         }

      },

      resizeElements: function() {

         //vars
         var ii = $("#menu"+i).offset().left;
         var windowHeight = $(window).height();

         //functions
         ScrollModule.getSectionPos();
         $grid.masonry('layout');
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
      },

      getSectionPos: function() {

         setTimeout(function() {
            //push section heights in var;
            section[0] = 0;
            $(".section").each(function(i, el) {
               var sectionPos = $(el).position().top - $("#menu").height();
               if( i == 0 ) sectionPos += $("#menu").height();
               section[i+1] = sectionPos;
            });
            console.log(section);
         },5000)

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
   $(window).on("load", function() {
      ScrollModule.getSectionPos();
   })
});
