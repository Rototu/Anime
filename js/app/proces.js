var MainModule = ( () => {

   const doc = $( document );
   const c = $( '#canvas' );
   const ctx = c.get( 0 )
      .getContext( '2d' );
   const container = $("#container");

   const stars = [];
   let date = new Date();
   let scrollAcc = 0;
   let time = date.getTime();
   let bodyWidth, bodyHeight;
   let scrollAmount = 0,
      scrolling = false;
   let compatibilityTest = false,
      compatibilityMode = false;

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
         MainModule.bindHandlers();
         setTimeout( MainModule.drawCanvas, 250 );

      },

      bindHandlers: () => {

         $( window )
            .resize( MainModule.respondCanvas );

         $( "body" )
            .scroll( MainModule.drawCanvas );

         window.addEventListener( 'wheel', MainModule.scrollHorizontally, false );
         window.addEventListener( 'mousewheel', MainModule.scrollHorizontally, false );

         $( ".next-page" )
            .click( MainModule.scrollToNextPage );
         $( ".previous-page" )
            .click( MainModule.scrollToPrevPage );


      },

      scrollToPrevPage: () => {

         let scrPos, pageWidth = bodyWidth / 3;

         if ( document.body.scrollLeft > pageWidth ) {
            scrPos = pageWidth;
         } else {
            scrPos = 0;
         }

         $( "body" )
            .animate( {
               scrollLeft: scrPos
            }, {
               queue: false,
               duration: 2000,
               delay: 0,
               easing: "easeInOutCubic"
            } );

      },

      scrollToNextPage: () => {

         let scrPos, pageWidth = bodyWidth / 3;

         if ( document.body.scrollLeft < pageWidth ) {
            scrPos = pageWidth;
         } else {
            scrPos = 2 * pageWidth;
         }

         $( "body" )
            .animate( {
               scrollLeft: scrPos
            }, {
               queue: false,
               duration: 2000,
               delay: 0,
               easing: "easeInOutCubic"
            } );

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
               if ( !( window.pageXOffset || document.documentElement.scrollLeft || document.body.scrollLeft || compatibilityTest ) ) {
                  $('body').css({width: "300vw"});
                  $('container').css({width: "100%"});
                  compatibilityMode = true;
               }
               if (compatibilityMode) {
                  MainModule.drawCanvas();
               }
               compatibilityTest = true;
               scrollAmount -= scrollAcc;

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

         const imgWidth = bodyHeight * 16 / 9;
         const iterations = Math.ceil( bodyWidth / imgWidth );
         const scrPos = document.body.scrollLeft;
         const pageWidth = bodyWidth / 3;
         let pos1, pos2, pos3;
         //delete this
         console.log(imgWidth, iterations, scrPos, pageWidth);

         MainModule.fillCanvas();

         for ( let i = 0; i <= iterations; i++ ) {

            pos1 = -0.05 * scrPos + i * imgWidth;
            if ( pos1 <= scrPos + pageWidth && pos1 > scrPos - imgWidth ) {
               ctx.drawImage( stars[ 0 ], pos1, 0, imgWidth, bodyHeight );
            }

            pos2 = -0.30 * scrPos + i * imgWidth;
            if ( pos2 <= scrPos + pageWidth && pos2 > scrPos - imgWidth ) {
               ctx.drawImage( stars[ 1 ], pos2, 0, imgWidth, bodyHeight );
            }

            pos3 = -0.50 * scrPos + i * imgWidth;
            if ( pos3 <= scrPos + pageWidth && pos3 > scrPos - imgWidth ) {
               ctx.drawImage( stars[ 2 ], pos3, 0, imgWidth, bodyHeight );
            }

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
