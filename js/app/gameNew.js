use strict;

const GameModule = ( function () {

   let myMap = new Int8Array( 1152 );
   let $player = $( "#mainChar" );
   let $solids = $( ".solids" );


   return {

      init: () => {

      },

      charControls: () => {

      },

      setSpeechBubblePos: () => {

      },

      speechBubbleControl: () => {

      },

      animateSprite: () => {

      },

      timer: () => {

      },

      getNextSpriteFrame: ( currentFrame, numberOfFrames ) => {

         if ( currentFrame < numberOfFrames - 1 ) {
            return currentFrame + 1;
         }

         if ( currentFrame == numberOfFrames - 1 ) {
            return 0;
         }

      },

      setSpriteFrame: ( spriteObj, frame, width, height, orientation ) => {

         let width = spriteObj.width();
         let height = spriteObj.height();

         spriteObj.css( "background-position", `${( -frame ) * width}px ${( -orientation ) * height}px` );

      },

      getObjCenterPos: ( obj ) => {

         let data = obj.get( 0 )
            .getBoundingClientRect();

         return {
            xCenterPos: data.left + data.width / 2,
            yCenterPos: data.top + data.height / 2
         };

      },

      getDistanceBetweenObjects: ( obj1, obj2 ) => {

         let obj1Position = GameModule.getObjCenterPos( obj1 );
         let obj2Position = GameModule.getObjCenterPos( obj2 );

         return Math.hypot(
            ( obj1Position.xCenterPos - obj2Position.xCenterPos ),
            ( obj1Position.yCenterPos - obj2Position.yCenterPos )
         );
      },

      startSpriteAnimation: () => {

      },

      disableSprite: () => {

      },

      changeSpriteOrientation: ( spriteObj, orientation, frame ) => {

         switch ( orientation ) {
         case "up":
            setSpriteFrame( spriteObj, frame, width, height, 3 );
            break;

         case "down":
            setSpriteFrame( spriteObj, frame, width, height, 0 );
            break;

         case "left":
            setSpriteFrame( spriteObj, frame, width, height, 1 );
            break;

         case "right":
            setSpriteFrame( spriteObj, frame, width, height, 2 );
            break;

         default:
            return;
         }

      },

      setRandomSpriteOption: ( obj, numberOfOptions ) => {

         let randomOption = Math.floor( Math.random() * ( numberOfOptions ) );

         obj.css( "background-position", `${( -randomOption ) * size}px 0` );

      },

      renderFrame: () => {

      },

      insertObjIntoMap: ( obj, xPos, yPos, objValue ) => {

         let {
            width,
            height
         } = GameModule.getBlockSizeOfEl( obj );

         for ( let line = yPos; line < yPos + height; line++ ) {
            for ( let column = xPos; column < xPos + width; column++ ) {
               myMap.set( line, column, objValue );
            }
         }

         obj.mapPosX = xPos;
         obj.mapPosY = yPos;

         obj.css( {
            left: xPos * 16,
            top: yPos * 16
         } );

      },

      deleteObjFromMap: ( obj ) => {

         let {
            width,
            height
         } = GameModule.getBlockSizeOfEl( obj );

         let xPos = $el.mapPosX;
         let yPos = $el.mapPosY;

         for ( let line = yPos; line < yPos + height; line++ ) {
            for ( let column = xPos; column < xPos + width; column++ ) {
               myMap.set( line, column, 0 );
            }
         }

      },

      getBlockSizeOfEl: ( obj ) => {

         let width = $el.width() / 16;
         let height = $el.height() / 16;

         return {
            width,
            height
         };

      },

      levelDebugger: () => {

         return {

            showMap: () => {

               let myLog = "";

               for ( let line = yPos; line < yPos + height; line++ ) {
                  for ( let column = xpos; column < xPos + width; column++ ) {
                     myLog += myMap.get( line, column ) + " ";
                  }
                  myLog += '\n';
               }

               console.log( myLog );

            }

         };

      },

      arrayTo2DLevel: ( level ) => {

         let levelData = LevelModule.getLevel( level );

         for ( let boxNr = 0; boxNr < 1152; boxNr++ ) {
            myMap[ boxNr ] = levelData[ boxNr ];
         }

      },

      setLevelArrayPrototype: () => {

         Int8Array.prototype.get = function ( line, column ) {
            return this[ ( line * this.nrOfColumns ) + column ];
         };

         Int8Array.prototype.set = function ( line, column, value ) {
            this[ ( line * this.nrOfColumns ) + column ] = value;
            return this[ ( line * this.nrOfColumns ) + column ];
         };

         Int8Array.prototype.setNrOfColumns = function ( nrOfColumns ) {
            this.nrOfColumns = nrOfColumns;
         };

         myMap.setNrOfColumns( 48 );

      },

      testForPosInMapBoundaries: ( xPos, yPos ) => {

         if ( xPos >= 0 && yPos >= 0 && xPos < 48 && yPos < 24 ) {
            return true;
         }

         return false;

      },

      testForFreeSpaceInMap: () => {

         let {
            width,
            height
         } = GameModule.getBlockSizeOfEl( obj );

         for ( let line = yPos; line < yPos + height; line++ ) {
            for ( let column = xpos; column < xPos + width; column++ ) {
               if ( myMap.get( line, column ) > 0 ) {
                  return false;
               }
            }
         }

         return true;

      },

      moveSolidToDirection: () => {

      },

      resizeHandler: () => {

      },

      npcClickHandler: () => {

      },

      moveToLevel: () => {

      },

   };
} )();

$( "html" )
   .imagesLoaded( function () {

   } );
