var MainModule = ( function () {

   // var map => 2D array
   var myMap = new Int8Array( 1152 );
   myMap.fill( 0 );

   return {

      init: function () {

         // construnct string of html bitBoxes (16x16 boxes)
         var htmlString = "";
         htmlString += "<img id='selectedLevel' src=''/>";
         for ( i = 1; i <= 1152; i++ ) {
            htmlString += "<div class='bitBox' name='" + ( i - 1 ) + "'></div>";
         }

         // set content
         $( "#gameCreator" )
            .html( htmlString );

      },

      bindHandlers: function () {

         // bitBox checked handler
         $( ".bitBox" )
            .click( function () {
               $( this )
                  .toggleClass( "bitSelected" );
               var bit = $( this )
                  .attr( "name" );
               if ( myMap[ bit ] == 1 ) {
                  myMap[ bit ] = 0;
               } else {
                  myMap[ bit ] = 1;
               }
               console.log( ( bit % 48 ) * 16 + " " + Math.floor( bit / 48 ) * 16 );
            } );

      },

      uploadImg: function () {

         // change level image and reset bitBoxes
         $( "#selectedLevel" )
            .prop( "src", "img/game/levels/" + $( "#levelSelector" )
               .val() );
         $( ".bitBox" )
            .removeClass( "bitSelected" );
         myMap.fill( 0 );

      },

      createFileAndDownload: function ( storageObj ) {

         var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent( storageObj );
         var dlAnchorElem = document.getElementById( 'downloadAnchorElem' );
         dlAnchorElem.setAttribute( "href", dataStr );
         dlAnchorElem.setAttribute( "download", "level.js" );
         dlAnchorElem.click();

      },

      stringifyMap: function () {

         var mapString = "window.myLevelArray = [\n";
         for ( var i = 0; i < 1152; i++ ) {
            if ( i % 48 == 0 && i < 1150 && i > 1 ) mapString += "\n";
            if ( i < 1151 ) mapString += ( myMap[ i ] + ", " );
            if ( i == 1151 ) mapString += ( myMap[ i ] + "\n];" );
         }
         MainModule.createFileAndDownload( mapString );

      }

   };
} )();

$( document )
   .on( "ready", function () {
      MainModule.init();
      MainModule.bindHandlers();
   } );
