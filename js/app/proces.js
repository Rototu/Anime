var MainModule = ( () => {

   const doc = $( document );
   const c = $( '#canvas' );
   const ctx = c.get( 0 )
      .getContext( '2d' );
   const container = $( c )
      .parent();

   const stars = [];
   let date = new Date();
   let scrollAcc = 0;
   let time = date.getTime();
   let bodyWidth, bodyHeight;

   return {

      init: () => {

         let backgroundStars = new Image,
            middleStars = new Image,
            foregroundStars = new Image;

         backgroundStars.src = "img/proces/stars.png";
         stars.push( backgroundStars );

         middleStars.src = "img/proces/starsMiddle.png";
         stars.push( middleStars );

         foregroundStars.src = "img/proces/starsClose.png";
         stars.push( foregroundStars );


         MainModule.respondCanvas();
         MainModule.fillCanvas();
         MainModule.drawCanvas();
         MainModule.bindHandlers();

      },

      bindHandlers: () => {

         $( window )
            .resize( MainModule.respondCanvas );

         $( "body" )
            .scroll( MainModule.drawCanvas );

         window.addEventListener( "wheel", MainModule.scrollHorizontally, false );


      },

      scrollHorizontally: ( e ) => {

         if ( MainModule.timeDiff() > 100 ) {
            time = MainModule.getTime();
            const scrollValue = document.body.scrollLeft + 20 * e.deltaY;
            $( document.body )
               .animate( {
                  scrollLeft: scrollValue
               }, {
                  queue: false,
                  duration: 1000,
                  delay: 0,
                  easing: "easeInOutCubic",
                  step: MainModule.drawCanvas
               } );
         }

         e.preventDefault();

      },

      getTime: () => {

         const d = new Date();
         const newTime = d.getTime();
         return newTime;

      },

      timeDiff: () => {

         const newTime = MainModule.getTime();
         return newTime - time;

      },

      respondCanvas: () => {

         bodyHeight = $( container )
            .height();
         bodyWidth = $( container )
            .width();

         c.attr( 'width', bodyWidth );
         c.attr( 'height', bodyHeight );

         MainModule.drawCanvas();

      },

      drawCanvas: () => {

         MainModule.fillCanvas();

         const imgWidth = bodyHeight * 16 / 9;
         const iterations = Math.ceil( bodyWidth / imgWidth );
         const scrPos = document.body.scrollLeft;

         for ( let i = 0; i <= iterations; i++ ) {
            ctx.drawImage( stars[ 0 ], -0.05 * scrPos + i * imgWidth, 0, imgWidth, bodyHeight );
            ctx.drawImage( stars[ 1 ], -0.30 * scrPos + i * imgWidth, 0, imgWidth, bodyHeight );
            ctx.drawImage( stars[ 2 ], -0.50 * scrPos + i * imgWidth, 0, imgWidth, bodyHeight );
         }

      },

      fillCanvas: () => {

         ctx.beginPath();
         ctx.rect( 0, 0, bodyWidth, bodyHeight );
         ctx.fillStyle = "black";
         ctx.fill();

      }


   };
} )();

$( document )
   .on( "ready", function () {
      MainModule.init();
   } );
