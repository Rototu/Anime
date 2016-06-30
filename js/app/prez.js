var prezModule = (function() {

   var myVar;

   return {

      init: function() {

         //startImage crossfade effect
         $("#section1").crossfade({
            threshold: 0.4
         });

         //set scrollspeed animation
         jQuery.scrollSpeed( 200, 1500, "easeOutQuad" );

         $("img").on("dragstart", function(event) { event.preventDefault(); });

         $(window).enllax();

      },

      bindHandlers() {

         $(window).on("unload", function() {
            $(window).scrollTop(0);
            $("body").hide();
         });

      },

      windowLoaded: function() {

         $("body").animate({opacity: 1}, {queue: false, duration: 1500, delay: 0, easing: "easeInOutCubic"});
         setTimeout(function() {
            $(window).scroll();
         }, 100);

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
