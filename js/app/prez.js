var prezModule = ( function () {

   var myVar;
   var scrollStarted = false;

   return {

      init: function () {

         //startImage crossfade effect
         $( "#section1" )
            .crossfade( {
               threshold: 0.3
            } );

         //disable img drag
         $( "img" )
            .on( "dragstart", function ( event ) {
               event.preventDefault();
            } );

         //enable parallax
         $( window )
            .enllax();

         // parallax video settings and init
         $( "#my-video" )
            .backgroundVideo( {
               $outerWrap: $( "#section3" ),
               preventContextMenu: true,
               parallaxOptions: {
                  effect: 5
               }
            } );

      },

      bindHandlers() {

         $( window )
            .on( "unload", function () {
               $( window )
                  .scrollTop( 0 );
               $( "body" )
                  .hide();
            } );

         $( "#next" )
            .click( function () {
               $( "html, body" )
                  .animate( {
                     scrollTop: $( document )
                        .height()
                  }, {
                     queue: false,
                     duration: 40000,
                     delay: 0,
                     easing: "linear"
                  } );
               scrollStarted = true;
               setTimeout( function () {
                  scrollStarted = false;
               }, 200 );
            } );

         $( "html, body" )
            .click( function () {
               if ( !scrollStarted ) $( this )
                  .stop();
            } );

      },

      windowLoaded: function () {

         $( "body" )
            .animate( {
               opacity: 1
            }, {
               queue: false,
               duration: 1500,
               delay: 0,
               easing: "easeInOutCubic"
            } );
         setTimeout( function () {

            //reset scroll
            $( window )
               .scroll();
            $( window )
               .scrollTop( 0 );

            //set scrollspeed animation
            jQuery.scrollSpeed( 200, 1500, "easeOutQuad" );

         }, 150 );

      }

   };

} )();

// execute functions only when DOM is ready
$( document )
   .on( "ready", function () {
      prezModule.init();
      prezModule.bindHandlers();
      $( "html" )
         .imagesLoaded( function () {
            prezModule.windowLoaded();
         } );
   } );
