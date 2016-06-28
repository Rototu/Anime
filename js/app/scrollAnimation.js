//  scroll function optimization
(function($) {
   var uniqueCntr = 0;
   $.fn.scrolled = function (waitTime, fn) {
      if (typeof waitTime === "function") {
         fn = waitTime;
         waitTime = 5;
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

// scroll animation controller
var ScrollModule = (function() {

   //  menu slider vars
   var $blueTween = $("#blueTween");
   var blueTweenWidth;
   var blueTweenOffset;

   //  scroll and window wars
   var elFixed = false;
   var elBottom = false;
   var windowHeight;
   var relativeTopPos;
   var section = [];
   var i = 1;
   var j = 1;

   // parallax vars
   var $prezTxt = $("#prezentareTxt");
   var prezTxtWidth = $prezTxt.width();
   var prezTxtHeight = $prezTxt.height();
   var imgGridList = $(".grid-item");

   return {

      // initialize scroll scripts
      init: function() {

         // select first menuElement
         $("#menu1").css("color", "rgb(15,15,15)");
         blueTweenWidth = $("#menu1").width() + 2 * parseInt($("#menu1").css("padding-left"));
         $blueTween.width(blueTweenWidth);

         // set parallax font size
         prezTxtWidth = $prezTxt.width();
         $prezTxt.css("font-size", prezTxtWidth / 15);

         // scroll init to top
         window.scrollTo(0, 0);
         $("html, body").scrollTop(0);

      },

      // assign controllers/handlers for main elements
      bindHandlers: function() {

         // mouseover event handler for menu elements
         $(".menuSelector").on({

            // on mouseenter temporal select
            mouseenter: function() {

               // set to init state
               $(".menuSelector").css("color", "rgb(149,149,149)");

               // get element props
               blueTweenWidth = $(this).width() + 2 * parseInt($(this).css("padding-left"));
               blueTweenOffset = $(this).offset().left;

               // animate
               $(this).css("color", "rgb(15,15,15)");
               $blueTween.animate({width: blueTweenWidth}, {queue: false, duration: 750, delay: 0, easing: "easeOutCubic"});
               $blueTween.animate({left: blueTweenOffset}, {queue: false, duration: 750, delay: 0, easing: "easeOutCubic"});

            },

            // on mouseleave deselect and switch to original selected element
            mouseleave: function() {
               // deselect element
               $(this).css("color", "rgb(149,149,149)");
               $("#menu"+i).css("color", "rgb(15,15,15)");
            }

         });

         // set permanent select when mouse leaves menu
         $("#menuElements").on({

            // set to current state
            mouseleave: function() {

               // get el props
               blueTweenWidth = $("#menu" + i).width() + 2 * parseInt($("#menu"+i).css("padding-left"))
               blueTweenOffset = $("#menu" + i).offset().left;

               // animate
               $blueTween.animate({left: blueTweenOffset}, {queue: false, duration: 750, delay: 0, easing: "easeOutCubic"});
               $blueTween.animate({width: blueTweenWidth}, {queue: false, duration: 750, delay: 0, easing: "easeOutCubic"});
            }
         });

         // menuSelector clicked move to page
         $(".menuSelector").click(function() {

            // get selected section index
            var id = this.id;
            var mySect = id.substr(id.length - 1);

            // get scrollvalue from array by index
            var scrollValue = section[mySect] + 10;

            // animate scroll
            $("html, body").stop().animate({scrollTop: scrollValue}, {queue: false, duration: 3000, delay: 0, easing: "easeInOutCubic"});

         });

      },

      // parallax page controller and scroll event handler
      animations: function() {

         // jScrollability plugin, handles elements only when they enter the viewport
         $.jScrollability([

            // image grid scroll handler
            {
               "selector": ".grid",
               "start": "parent",
               "end": "parent",
               "fn": function($el,pcnt) {

                  // get image list for animating
                  var $img = $(".grid-item");

                  // set percentage of shown elements, 1.5 is a "delay" for when elements should be shown
                  // 1.5 ==> 50% delay
                  var point = Math.floor(($img.length * 1.5 + 1) * pcnt);

                  // handler for each element of grid image list
                  $img.each(function(i,el) {

                     // verify if img index included in included in the percentage of elements that must be shown or not
                     // 1/2 ==> for the 50% delay
                     if (i < point - ($img.length + 1) / 2) {
                        $(el).css({opacity: 1});
                     } else {
                        $(el).css({opacity: 0});
                     }

                  });

               }
            },

            // timeline scroll handler
            {
               "selector": "#timeline-embed",
               "start": "window",
               "end": "window",
               "fn": function($el,pcnt) {

                  // max opacity 0.97, 0.1 ==> 10% delay for animation
                  $el.css("opacity", Math.min(pcnt + 0.1, 0.95));

               }
            },

            // video overlay scroll handler
            {
               "selector": "#video-overlay",
               "start": "window",
               "end": "window",
               "fn": function($el,pcnt) {
                  $el.css("opacity", Math.max(pcnt - 0.1, 0));
               }
            },

            // info pos scroll handler
            {
               "selector": "#info",
               "start": "self",
               "end": "self",
               "fn": function($el,pcnt) {
                  $el.css({
                     left: ((-5) * (1 - pcnt) + 2) + "vw",
                     opacity: pcnt
                  });
               }
            }

            // // game opacity scroll handler
            // {
            //    "selector": "#game",
            //    "start": "window",
            //    "end": "window",
            //    "fn": function($el,pcnt) {
            //       $el.css("opacity", pcnt + 0.2);
            //    }
            // }

         ]);

         // window scroll handler
         $(window).scrolled(function() {
            scrollAnimation();
         });

         var scrollAnimation = function() {

            // init vars
            var prezTxtTop;
            var menuPos = $("#menu").position().top;

            // get props
            windowHeight = $(window).height();
            relativeTopPos = $(window).scrollTop();

            // set current section var
            for (k = 1; k <= section.length-1; k++) {
               if(relativeTopPos >= section[k]) {
                  i = k;
               }
               else break;
            }

            // if current section changed
            if(j != i) {

               // set current section backup var
               j = i;

               // get props of menuelement corresponding to current section
               blueTweenWidth = $("#menu" + i).width() + 2 * parseInt($("#menu" + i).css("padding-left"))
               blueTweenOffset = $("#menu" + i).offset().left;

               // set current menuelement
               $blueTween.animate({left: blueTweenOffset}, {queue: false, duration: 750, delay: 0, easing: "easeOutCubic"});
               $blueTween.animate({width: blueTweenWidth}, {queue: false, duration: 750, delay: 0, easing: "easeOutCubic"});
               $(".menuSelector").css("color", "rgb(149,149,149)");
               $("#menu" + i).css("color", "rgb(15,15,15)");

            }

            // if in section 0 (animeParallax)
            if(relativeTopPos <= windowHeight) {

               if(elFixed) {
                  // prezTxt class control
                  $prezTxt.removeClass("affix");
                  $("#prezentareImg").removeClass("affix");
                  $("#menu").removeClass("affix");
                  elFixed = false;
                  elBottom = false;
               }



               // prezImg class control and parallax effect
               $("#prezentareImg") .css("left", ((relativeTopPos / windowHeight * 10) - 25)  + "vw")
               .css("height", ((relativeTopPos / windowHeight * 20) + 60)  + "vh");

               // menu class control and parallax effect
               $("#menu").css("top", windowHeight + (1 - relativeTopPos / windowHeight) * 50);
               $("#menu, #menuFill").css("opacity", relativeTopPos / windowHeight);
               $("#menuFill").css("height", $("#menu").position().top - windowHeight);

            }

            // if in section 1 (prezentare) && section 2 (istoric) not on screen
            if(relativeTopPos >= windowHeight && relativeTopPos < 2 * windowHeight) {


               if(!elFixed){

                  // menu class control
                  $("#menu").addClass("affix").css("top", 0);

                  // prezTxt class control
                  $prezTxt.addClass("affix").removeClass("bottomSticky");

                  // prezImg class control
                  $("#prezentareImg").addClass("affix").removeClass("bottomSticky");

                  elFixed = true;
                  elBottom = false;

               }

               // prezTxt parallax effect
               var scale = 0.705 + 0.25 * (relativeTopPos / windowHeight - 1);
               $prezTxt.css({
                  transform: "scale(" + scale + ") translateY(-50%)",
                  right: "50px"
                  // color: "rgb("+ (relativeTopPos / windowHeight) + "," + (relativeTopPos / windowHeight) + "," + (relativeTopPos / windowHeight) + ")"
               });

            }

            // if entering section 2 (istoric)
            if(relativeTopPos >= 2 * windowHeight && !elBottom) {

               // prezImg class control
               $("#prezentareImg").removeClass("affix").addClass("bottomSticky");

               // prezTxt class control
               $prezTxt.removeClass("affix").addClass("bottomSticky");

               elBottom = true;
               elFixed = false;

            }

         }

         // parallax video settings and init
         $("#my-video").backgroundVideo({
            $outerWrap: $("#impact"),
            preventContextMenu: true,
            parallaxOptions: {
               effect: 1.7
            }
         });

      },

      // resize event handler
      resizeElements: function() {

         // resizable vars
         var ii = $("#menu" + i).offset().left;
         windowHeight = $(window).height();

         // update list of section heights
         ScrollModule.getSectionPos();

         // update masonry grid
         $grid.masonry("layout");

         // if @media changed menu selector
         if(ii != blueTweenOffset) {

            // get current menuelement props
            blueTweenWidth = $("#menu" + i).width() + 2 * parseInt($("#menu" + i).css("padding-left"));
            blueTweenOffset =  ii;

            // animate to new current values
            $blueTween.animate({left: blueTweenOffset}, {queue: false, duration: 750, delay: 0, easing: "easeOutCubic"});
            $blueTween.animate({width: blueTweenWidth}, {queue: false, duration: 750, delay: 0, easing: "easeOutCubic"});
            $(".menuSelector").css("color", "rgb(149,149,149)");
            $("#menu" + i).css("color", "rgb(15,15,15)");

         }
      },

      // update section heights
      getSectionPos: function() {

         setTimeout(function() {
            // push section heights in var;
            section[0] = 0;
            $(".section").each(function(i, el) {
               var sectionPos = $(el).position().top - $("#menu").height();
               if( i == 0 ) sectionPos += $("#menu").height();
               section[i+1] = sectionPos;
            });
            console.log(section);
         }, 1700)

      }

   };
})();

// execute functions only when DOM is ready
$(document).on("ready", function() {

   // initialize elements
   ScrollModule.init();

   // set event handlers
   ScrollModule.bindHandlers();

   // start parallax animation handlers
   ScrollModule.animations();

   // resize event handler
   $(window).resize(function() {
      ScrollModule.resizeElements();
   });

   // set section height list
   $("html").imagesLoaded(function() {
      setTimeout(ScrollModule.getSectionPos(), 500);
   })
});
