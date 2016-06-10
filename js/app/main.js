//index.html controller
var MainModule = (function() {

   var imgNumber;
   var imgCounter = 0;
   var loadingBarWidth;

   return {

      //initialize parallax/scroll scripts
      init: function() {

         //on loading screen images loaded show content
         $("#loadingScreen").imagesLoaded(function () {
            $(".loadElement").fadeIn(1000);
         });

         //activate parallax and hide elements
         $("#mySite").css("opacity", 0);
         $(window).enllax({
            type: 'background',
            ratio: 1,
            direction: 'vertical'
         });

         //disable scroll while loading screen is active
         $("body").css("overflow-x", "hidden");

         //set audio volume
         $("#audio").prop("volume", 0.01);

         //set scroll scrollSpeed
         jQuery.scrollSpeed( $(window).height() / 4, 2000, 'linear' );

         //loadingBar init values
         imgNumber = $("img").length;
         console.log("number of images to be loaded: " + imgNumber);

         //disable image drag
         $('img').on('dragstart', function(event) { event.preventDefault(); });

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
         $("img").each(function() {
            var self = this;
            $(this).imagesLoaded(function() {
               loadingBarWidth = $("#loadingBar").width();
               imgCounter++;
               console.log(self.src + " has loaded.");
               $("#loadedPercentage").animate({width: loadingBarWidth * imgCounter/imgNumber + 1}, {queue: false, duration: 200, delay: 0, easing: "linear", done: function() {
                  var myPercentage = (Math.round(100 * $(this).width() / loadingBarWidth));
                  if(myPercentage == 101 || myPercentage == 99) myPercentage = 100; //pure 100% value
                  $("#loadedPercentage").text(myPercentage + "%");
               }});
            });
         });

         $(window).resize(function() {
            loadingBarWidth = $("#loadingBar").width();
            $("#loadedPercentage").stop().css("width", loadingBarWidth * imgCounter/imgNumber + 1);
         });

      },

      //change to website from loading screen
      windowLoaded: function() {

         //enable animeParallax
         $("#scene").parallax('enable');

         //delete setTimeout after further development !!!
         setTimeout(function() {
            $("html, body").stop().animate({scrollTop: 0, scrollLeft: 0}, {queue: false, duration: 0, delay: 0, easing: "easeInOutCubic"});
            $("#loadingScreen").fadeOut(500, function() {

               //enable scroll
               $("body").css("overflow-y", "scroll");
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
