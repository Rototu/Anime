var ImpactModule = (function () {

   return {

      init: function () {

         //disable img drag
         $("img").on("dragstart", function(event) { event.preventDefault(); });

         //init sticker
         Sticker.init('.sticker');

         //enable parallax
         $(window).enllax();

         //make sure window is not scrolled down
         $(window).scrollTop(0);

      },

      bindHandlers: function () {

         //section select
         $(".sticker").click(function() {

            //hide start wrapper
            $("#startWrapper").fadeOut(1000);

            //function to do after wrapper is hidden
            setTimeout(function() {

               //switch for each sticker by id
               switch (this.id) {

                  //if first sticker then show first section
                  case "stickerUno":
                  $("#wrapperCinema").fadeIn(1000);
                  break;

                  //id second sticker then show second section
                  case "stickerDuo":
                  $("#wrapperCultura").fadeIn(1000);
                  break;

                  //probably useless
                  default: return;

               }

               //reset scroll again
               $(window).scrollTop(0);

            }.bind(this),1000);

         });

         //#backToMain1
         $("#backToMain1").click(function() {
            $("#wrapperCinema").fadeOut(1000, function() {
               $("#startWrapper").fadeIn(1000);
            });
         });

         //#backToMain2
         $("#backToMain2").click(function() {
            $("#wrapperCultura").fadeOut(1000, function() {
               $("#startWrapper").fadeIn(1000);
            });
         });

         // clear scrollposition cache and prevent element display bugs
         $(window).on("unload", function() {
            $(window).scrollTop(0);
            $("html").hide();
         });

      }

   };
})();

$(document).on("ready", function () {
   ImpactModule.init();
   ImpactModule.bindHandlers();
});
