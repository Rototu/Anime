//index.html controller
var MainModule = (function() {

   var imgNumber;
   var imgCounter = 0;
   var loadingBarWidth;
   var timelineOptions = {
      scale_factor: 1.5,
      timenav_height_percentage: 15,
      language: 'ro'
   };
   var scrollTopInterval;

   return {

      //initialize parallax/scroll scripts
      init: function() {

         //on loading screen images loaded show content
         $("#loadingScreen").imagesLoaded(function () {
            $(".loadElement").fadeIn(1000);
         });

         //activate parallax and hide elements
         $("#mySite").css("opacity", 0);
         $(window).enllax();

         //set audio volume
         $("#audio").prop("volume", 0.01);

         //loadingBar init values
         imgNumber = $("img").length;
         console.log("number of images to be loaded: " + imgNumber);

         //disable image drag
         $('img').on('dragstart', function(event) { event.preventDefault(); });

         //init image grid
         $grid = $('.grid').masonry({
            itemSelector : '.grid-item',
            percentPosition : true,
            columnWidth : '.grid-sizer',
            transitionDuration : 0,
         });

         //init timeline
         timeline = new TL.Timeline('timeline-embed',
         'https://docs.google.com/spreadsheets/d/16GQkR4ugEoxGKNvxdJY732Zs4OUD5bIx5SDh0rp3yFc/pubhtml',
         timelineOptions);
         
         //make sure scroll is top
         scrollTopInterval = setInterval(function() {
            window.scrollTo(0, 0);
            $("html, body").scrollTop(0);
         },10);

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

         // resize loading bar
         $(window).resize(function() {
            loadingBarWidth = $("#loadingBar").width();
            $("#loadedPercentage").stop().css("width", loadingBarWidth * imgCounter/imgNumber + 1);
         });

         // scroll to top before exiting page
         $(window).on('unload', function() {
            $(window).scrollTop(0);
         });
         $(window).on('beforeunload', function() {
            $(window).scrollTop(0);
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
                  $grid.masonry('layout');
                  move("#mySite").ease("linear").set("opacity", 1).duration(3000).end();
                  //set scroll scrollSpeed
                  jQuery.scrollSpeed( $(window).height() / 2, 1000, 'linear' );
                  clearInterval(scrollTopInterval);
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
