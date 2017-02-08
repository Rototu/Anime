var MainModule = ( () => {

   const doc = $( document );
   const c = $( '#canvas' );
   const ctx = c.get( 0 )
      .getContext( '2d' );
   const container = c.parent();

   const stars = [];
   let date = new Date();
   let scrollAcc = 0;
   let time = date.getTime();
   let bodyWidth, bodyHeight;
   let scrollAmount = 0,
      scrolling = false;

   return {

      init: () => {

         let backgroundStars = new Image,
            middleStars = new Image,
            foregroundStars = new Image;

         backgroundStars.src = 'img/proces/stars.png';
         stars.push( backgroundStars );

         middleStars.src = 'img/proces/starsMiddle.png';
         stars.push( middleStars );

         foregroundStars.src = 'img/proces/starsClose.png';
         stars.push( foregroundStars );


         MainModule.respondCanvas();
         MainModule.fillCanvas();
         MainModule.drawCanvas();
         MainModule.bindHandlers();
      },

      bindHandlers: () => {

         $( window )
            .resize( MainModule.respondCanvas );


         let lastScrollPos = 0;
         let ticking = false;
         $( "body" )
            .scroll( MainModule.drawCanvas );
         window.addEventListener( 'wheel', MainModule.scrollHorizontally, false );
         window.addEventListener( 'mousewheel', MainModule.scrollHorizontally, false );


      },

      scrollHorizontally: ( e ) => {

         if ( MainModule.timeDiff() > 100 ) {
            time = MainModule.getTime();
            MainModule.scrollAnimate( e.deltaY * 40, 4 );
         }

         e.preventDefault();

      },

      scrollAnimate: ( delta, step ) => {

         if ( ( scrollAmount > 0 && delta < 0 ) || ( scrollAmount < 0 && delta > 0 ) ) {
            scrollAmount = delta;
         } else {
            scrollAmount += delta;
         }

         time = MainModule.getTime();

         scrollAcc = Math.sign( delta ) * step;

         if ( scrollAmount != 0 && !scrolling ) {

            scrolling = true;

            let frameRender = () => {

               document.body.scrollLeft += scrollAcc;
               scrollAmount -= scrollAcc;
               // MainModule.drawCanvas();

               if ( scrollAmount != 0 && MainModule.timeDiff() < 600 ) {
                  window.requestAnimationFrame( frameRender );
               } else {
                  scrollAcc = 0;
                  scrolling = false;
               }

            }

            window.requestAnimationFrame( frameRender );

         }

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

         bodyHeight = container.height();
         bodyWidth = container.width();

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
         ctx.fillStyle = 'black';
         ctx.fill();

      }


   };
} )();

$( document )
   .on( 'ready', function () {
      MainModule.init();
   } );
