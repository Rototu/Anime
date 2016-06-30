var prezModule = (function() {

   var myVar;

   return {

      init: function() {

         //startImage crossfade effect
         $("#section1").crossfade({
            threshold: 0.4
         });

         //disable img drag
         $("img").on("dragstart", function(event) { event.preventDefault(); });

         //enable parallax
         $(window).enllax();

         // parallax video settings and init
         $("#my-video").backgroundVideo({
            $outerWrap: $("#section4"),
            preventContextMenu: true,
            parallaxOptions: {
               effect: 2
            }
         });

      },

      bindHandlers() {

         $(window).on("unload", function() {
            $(window).scrollTop(0);
            $("body").hide();
         });

         $("#next").click(function() {
            $("html, body").animate({ scrollTop: $(document).height() }, {queue: false, duration: 60000, delay: 0, easing: "linear"});
         });

      },

      windowLoaded: function() {

         $("body").animate({opacity: 1}, {queue: false, duration: 1500, delay: 0, easing: "easeInOutCubic"});
         setTimeout(function() {

            //reset scroll
            $(window).scroll();
            $(window).scrollTop(0);

            //set scrollspeed animation
            jQuery.scrollSpeed( 200, 1500, "easeOutQuad" );

         }, 150);

      }

   };

})();

// execute functions only when DOM is ready
$(document).on("ready", function() {
   prezModule.init();
   prezModule.bindHandlers();
   $("html").imagesLoaded(function () {
      prezModule.windowLoaded();
   });
});
