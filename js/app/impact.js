var ImpactModule = (function () {

   return {

      init: function () {

         //disable img drag
         $("img").on("dragstart", function(event) { event.preventDefault(); });

         //init sticker
         Sticker.init('.sticker');

         //enable parallax
         $(window).enllax();

      },

      bindHandlers: function () {

         //hide titleBox
         $(".sticker").click(function() {

            $("#box").fadeOut(1000);

            setTimeout(function() {

               switch (this.id) {
                  case "stickerUno":
                  $("#impactCinema").show().animate({opacity: 1}, {queue: false, duration: 1000, delay: 0, easing: "easeInOutCubic"});
                  break;

                  case "stickerDuo":
                  $("#impactCultura").show().animate({opacity: 1}, {queue: false, duration: 1000, delay: 0, easing: "easeInOutCubic"});
                  break;

                  default: return;
               }

            }.bind(this),1500);

         });

      }

   };
})();

$(document).on("ready", function () {
   ImpactModule.init();
   ImpactModule.bindHandlers();
});
