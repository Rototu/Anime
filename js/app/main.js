// index.html controller
var MainModule = (function() {

   // image loading vars
   var imgNumber;
   var imgCounter = 0;

   // loading bar
   var loadingBarWidth = $("#loadingBar").width();
   var $loadPerc = $("#loadedPercentage");

   // scroll to top until page has loaded
   var scrollTopInterval = setInterval(function() {
      window.scrollTo(0, 0);
      $("html, body").scrollTop(0);
   }, 10);

   return {

      // initialize parallax/scroll scripts
      init: function() {

         // on loading screen images loaded show content
         $("#loadingScreen").imagesLoaded(function () {
            $(".loadElement").fadeIn(1000);
         });

         // activate parallax and hide elements
         $("#mySite").css("opacity", 0);
         $(window).enllax();

         // set audio volume
         $("#audio").prop("volume", 0.01);

         // loadingBar init values
         imgNumber = $("img").length;
         console.log("number of images to be loaded: " + imgNumber);

         // disable image drag
         $("img").on("dragstart", function(event) { event.preventDefault(); });

         // init image grid
         $grid = $(".grid").masonry({
            itemSelector : ".grid-item",
            percentPosition : true,
            columnWidth : ".grid-sizer",
            transitionDuration : 0,
         });

         // timeline options
         var timelineOptions = {
            scale_factor: 1.5,
            timenav_height_percentage: 15,
            language: "ro"
         };

         // init timeline
         timeline = new TL.Timeline("timeline-embed",
         "https:// docs.google.com/spreadsheets/d/16GQkR4ugEoxGKNvxdJY732Zs4OUD5bIx5SDh0rp3yFc/pubhtml",
         timelineOptions);

         // set scroll scrollSpeed
         jQuery.scrollSpeed( 200, 800, "linear" );

      },

      // assign controllers/handlers for main elements
      bindHandlers: function() {

         // on hover enable parallaxAnime
         $(".container").on({
            mouseenter: function () {
               $("#scene").parallax("enable");
            },
            mouseleave: function () {
               $("#scene").parallax("disable");
            }
         });


         // loading bar handler, metering percentage of loaded images in page
         $("img").each(function() {

            // set initial this var to "self"
            var self = this;

            // when current image has finished loading
            $(this).imagesLoaded(function() {

               // increment counter of loaded images
               imgCounter++;

               // when animation done
               var loadDone = function() {
                  var myPercentage = (Math.round(100 * $loadPerc.width() / loadingBarWidth));
                  if(myPercentage >= 95) myPercentage = 100; // pure 100% value
                  $loadPerc.text(myPercentage + "%");
               };

               // animation step handler
               var loadStep = function() {
                  var myPercentage = (Math.round(100 * $loadPerc.width() / loadingBarWidth));
                  if(myPercentage == 101 || myPercentage == 99) myPercentage = 100; // pure 100% value
                  $("#loadedPercentage").text(myPercentage + "%");
               };

               // animation options
               var loadWidth = { width: loadingBarWidth * imgCounter / imgNumber + 1 };
               var loadOptions = { queue: true, duration: 20, delay: 0, easing: "linear", step: loadStep, done: loadDone };

               // animate loadingBar
               $("#loadedPercentage").animate(loadWidth, loadOptions);

            });

            // resize handler
            $(window).resize(function() {

               // resize loadingBar
               loadingBarWidth = $("#loadingBar").width();
               $("#loadedPercentage").stop().css("width", loadingBarWidth * imgCounter/imgNumber + 1);

            });

            // clear scrollposition cache and prevent element display bugs
            $(window).on("unload", function() {
               $(window).scrollTop(0);
               $("#mySite").hide();
            });

         });

      },

      // change to website from loading screen
      windowLoaded: function() {

         // enable animeParallax
         $("#scene").parallax("enable");

         // layout image grid
         $grid.masonry("layout");

         // 1500ms delay until starting to show page
         setTimeout(function() {

            // hide loadingScreen
            $("#loadingScreen").fadeOut(500, function() {

               // show page
               $("#mySite").animate({opacity: 1}, {queue: false, duration: 1500, delay: 500, easing: "easeOutCubic"});

               // enable scrolling
               clearInterval(scrollTopInterval);

            });

         }, 5000);

      }

   };
})();

// execute functions only when DOM is ready
$(document).on("ready", function() {
   MainModule.init();
   MainModule.bindHandlers();
   $("html").imagesLoaded(function () {
      MainModule.windowLoaded();
   });
});
