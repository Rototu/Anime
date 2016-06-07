//index.html controller
var MainModule = (function() {

   var imgNumber;
   var imgCounter = 0;

   return {

      //initialize parallax/scroll scripts
      init: function() {

         //on loading screen images loaded show content
         $("#loadingScreen").imagesLoaded(function () {
            $(".loadElement").fadeIn(1000);
         });

         //activate parallax and hide elements
         $("#mySite").css("opacity", 0);

         //disable scroll while loading screen is active
         $("html").css("overflow", "hidden");
         window.scrollTo(0, 0);

         //set audio volume
         $("#audio").prop("volume", 0.01);

         //set scroll scrollSpeed
         jQuery.scrollSpeed(100, 2000, 'easeOutCubic');

         //loadingBar init values
         imgNumber = $("img").length;
         console.log("number of images to be loaded: " + imgNumber);


      },

      //assign controllers/handlers for main elements
      bindHandlers: function() {

         //on hover enable parallaxAnime
         $(".container").on({
            mouseenter: function () {
               $("#scene").parallax('enable');
            },
            mouseleave: function () {
               $("#scene").parallax('disable');
            }
         });


         //loading percentage bar set
         var loadingBarWidth = $("#loadingBar").width();
         $("img").each(function() {
            $(this).imagesLoaded(function() {
               var self = this;
               imgCounter++;
               $("#loadedPercentage").animate({width: loadingBarWidth * imgCounter/imgNumber + 1}, {queue: true, duration: 200, delay: 0, easing: "linear", step: function() {
                  $("#loadedPercentage").text((Math.ceil(100 * $(this).width() / loadingBarWidth)) + "%");
                  console.log(this.src);
               }});
            });
         });

      },

      //change to website from loading screen
      windowLoaded: function() {

         //enable animeParallax
         $("#scene").parallax('enable');

         //delete setTimeout after further development !!!
         setTimeout(function() {
            $("#loadingScreen").fadeOut(500, function() {

               //enable scroll
               // $("html").css("overflow-y", "scroll");
               setTimeout(function() {
                  move("#mySite").ease("linear").set("opacity", 1).duration(3000).end();
               },500);

            });
         },3000);

      }

   };
})();

//execute functions only when DOM is ready
$(document).on("ready", function() {
   MainModule.init();
   MainModule.bindHandlers();
   $("html").imagesLoaded(function () {
      MainModule.windowLoaded();
   });
});
