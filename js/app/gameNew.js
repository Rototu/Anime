"use strict";

let GameModule = ( function () {

   let myMap = new Int8Array( 1152 );

   let $player = $( "#mainChar" );
   let $solids = $( ".solids" );
   let images = {};

   let canvas = document.getElementById( "game-canvas" );
   let context = canvas.getContext( "2d" );
   context.imageSmoothingEnabled = false;
   context.mozImageSmoothingEnabled = false;

   let start = null;
   let shouldAnimate = true;
   let spriteAnimate = true;
   let pressedKey = null;

   let playerX = 0;
   let playerY = 0;

   return {

      test: () => {

         GameModule.addCanvasImageObj( "level1", "img/game/levels/level1.png", 384, 768 );
         GameModule.addCanvasImageObj( "kirito", "img/game/sprites/zero.png", 32, 32, 3 );
         GameModule.setCanvasBackground( images[ "level1" ] );
         GameModule.setCanvasImageObjPos( images[ "kirito" ], 32, 16 * 10 );
         GameModule.animateSprite( images[ "kirito" ] );
         GameModule.playerControls();

      },

      init: () => {

      },

      playerControls: () => {

         $( document )
            .keydown( ( key ) => {

               switch ( key.which ) {

               case 37:
                  if ( pressedKey == null ) {
                     window.requestAnimationFrame( GameModule.timer );
                     GameModule.changeSpriteOrientation( images[ "kirito" ], "left" );
                     playerX = images[ "kirito" ].xPos;
                     playerY = images[ "kirito" ].yPos;
                  }
                  pressedKey = 37;
                  break;

               case 38:
                  if ( pressedKey == null ) {
                     window.requestAnimationFrame( GameModule.timer );
                     GameModule.changeSpriteOrientation( images[ "kirito" ], "up" );
                     playerX = images[ "kirito" ].xPos;
                     playerY = images[ "kirito" ].yPos;
                  }
                  pressedKey = 38;
                  break;

               case 39:
                  if ( pressedKey == null ) {
                     window.requestAnimationFrame( GameModule.timer );
                     GameModule.changeSpriteOrientation( images[ "kirito" ], "right" );
                     playerX = images[ "kirito" ].xPos;
                     playerY = images[ "kirito" ].yPos;
                  }
                  pressedKey = 39;
                  break;

               case 40:
                  if ( pressedKey == null ) {
                     window.requestAnimationFrame( GameModule.timer );
                     GameModule.changeSpriteOrientation( images[ "kirito" ], "down" );
                     playerX = images[ "kirito" ].xPos;
                     playerY = images[ "kirito" ].yPos;
                  }
                  pressedKey = 40;
                  break;

               default:
                  return;

               }

            } );

         // $( document )
         //    .keyup( ( key ) => {
         //
         //       // test if released key coincides with the first pressed key
         //       if ( pressedKey == key.which ) {
         //          pressedKey = null;
         //       }
         //
         //    } );

      },

      setSpeechBubblePos: () => {

      },

      speechBubbleControl: () => {

      },

      animateSprite: ( spriteObj ) => {

         GameModule.setSpriteFrame( spriteObj );
         GameModule.getNextSpriteFrame( spriteObj );

      },

      timer: ( timeStamp ) => {

         if ( !start ) {
            start = timeStamp;
         }
         let progress = timeStamp - start;

         if ( progress * 16 / 400 <= 16 ) {

            GameModule.setCanvasBackground( images[ "level1" ] );

            if ( progress % 200 <= 40 && spriteAnimate ) {
               GameModule.animateSprite( images[ "kirito" ] );
               spriteAnimate = false;
            }

            if ( progress % 200 >= 50 && !spriteAnimate ) {
               spriteAnimate = true;
            }

            GameModule.moveSprite( images[ "kirito" ], Math.min( progress * 16 / 400, 16 ) );
            GameModule.setSpriteFrame( images[ "kirito" ] );
            window.requestAnimationFrame( GameModule.timer );

         } else {
            start = null;
            pressedKey = null;
         }

      },

      getNextSpriteFrame: ( spriteObj ) => {

         if ( spriteObj.currentFrame < spriteObj.framesNumber - 1 ) {
            spriteObj.currentFrame += 1;
         } else {
            spriteObj.currentFrame = 0;
         }

      },

      setSpriteFrame: ( spriteObj ) => {

         let xPosImage = spriteObj.currentFrame * spriteObj.width;
         let yPosImage = spriteObj.orientation * spriteObj.height;

         GameModule.drawCanvasImageObj( spriteObj, xPosImage, yPosImage );

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

      moveSprite: ( spriteObj, dist ) => {

         dist = parseInt( dist );

         switch ( spriteObj.orientation ) {

         case 0:
            spriteObj.yPos = playerY + dist;
            break;

         case 1:
            spriteObj.xPos = playerX - dist;
            break;

         case 2:
            spriteObj.xPos = playerX + dist;
            break;

         case 3:
            spriteObj.yPos = playerY - dist;
            break;

         default:
            return;

         }

      },

      changeSpriteOrientation: ( spriteObj, orientation ) => {

         switch ( orientation ) {

         case "up":
            spriteObj.orientation = 3;
            break;

         case "down":
            spriteObj.orientation = 0;
            break;

         case "left":
            spriteObj.orientation = 1;
            break;

         case "right":
            spriteObj.orientation = 2;
            break;

         default:
            return;

         }

         GameModule.animateSprite( spriteObj );

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

      setCanvasImageObjPos: ( obj, xPos, yPos ) => {

         obj.xPos = xPos;
         obj.yPos = yPos;

      },

      setCanvasBackground: ( obj ) => {

         GameModule.drawCanvasImageObj( obj, 0, 0, 0, 0 );

      },

      addCanvasImageObj: ( name, imageUrl, objHeight, objWidth, frameTotal ) => {

         let image = new Image();
         image.src = imageUrl;

         let obj = {
            image,
            name,
            height: objHeight,
            width: objWidth,
            loaded: false,
            xPos: 0,
            yPos: 0
         };

         if ( frameTotal ) {
            obj.framesNumber = frameTotal;
            obj.currentFrame = 0;
            obj.orientation = 0;
         }

         images[ name ] = obj;

      },

      drawCanvasImageObj: ( obj, xPosImage, yPosImage ) => {

         if ( obj.loaded == false ) {
            obj.image.addEventListener( "load", () => {
               context.drawImage( obj.image, xPosImage, yPosImage, obj.width, obj.height, obj.xPos, obj.yPos, obj.width, obj.height );
            }, false );
            obj.loaded = true;
         } else {
            context.drawImage( obj.image, xPosImage, yPosImage, obj.width, obj.height, obj.xPos, obj.yPos, obj.width, obj.height );
         }

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
      GameModule.test();
   } );
