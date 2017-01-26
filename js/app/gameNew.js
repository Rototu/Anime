"use strict";

let GameModule = ( () => {

   let myMap = new Int8Array( 1152 );

   let $game = $( "#game" );
   let images = {};
   let npcs = [];
   let playerData = {
      coins: 0,
      key: false,
      lChallengeCompleted: false,
      specialScreen: false
   };

   let canvas = document.getElementById( "character-canvas" );
   let context = canvas.getContext( "2d" );
   context.imageSmoothingEnabled = false;
   context.mozImageSmoothingEnabled = false;

   let background = document.getElementById( "background-canvas" );
   let backgroundContext = background.getContext( "2d" );
   backgroundContext.imageSmoothingEnabled = false;
   backgroundContext.mozImageSmoothingEnabled = false;

   let foreground = document.getElementById( "foreground-canvas" );
   let foregroundContext = foreground.getContext( "2d" );
   foregroundContext.imageSmoothingEnabled = false;
   foregroundContext.mozImageSmoothingEnabled = false;

   let portrait = document.getElementById( "portrait-canvas" );
   let portraitContext = portrait.getContext( "2d" );
   portraitContext.imageSmoothingEnabled = false;
   portraitContext.mozImageSmoothingEnabled = false;

   let start = null,
      globalStart = null;

   let shouldAnimate = false,
      spriteAnimate = true,
      sheepAnimate = true,
      crowAnimate = true;

   let pressedKey = 0,
      listeningToKeyboard = true;

   let playerX = 0,
      playerY = 0;

   let currentLevel = 1;
   let musicBg = [];

   return {

      test: () => {

         listeningToKeyboard = false;
         $( "#screen-transition" )
            .prop( "src", "img/game/white.png" )
            .fadeIn( 1000, () => {

               GameModule.setLevelArrayPrototype();
               GameModule.arrayTo2DLevel( currentLevel );
               GameModule.getNpcs( currentLevel );

               GameModule.imageInsertion();

               GameModule.setCanvasBackground( images[ "background" + currentLevel ] );
               GameModule.setCanvasForeground( images[ "foreground" + currentLevel ] );

               GameModule.drawCanvasImageObj( images[ "miyazaki" ], 0, 0, foregroundContext );
               GameModule.setSpriteFrame( images[ "kirito" ], context );
               GameModule.setSpriteFrame( images[ "crow" ], foregroundContext );

               playerX = 32;
               playerY = 160;

               GameModule.playerControls();
               GameModule.canvasMouseHandler();
               window.requestAnimationFrame( GameModule.timer );

               setTimeout( () => {
                  $( "#screen-transition" )
                     .fadeOut( 1000, () => {
                        listeningToKeyboard = true;
                        GameModule.loadAudio();
                        GameModule.loopAudio( Math.floor( Math.random() * ( 7 ) ) );
                     } )
               }, 500 );
            } );

      },

      init: () => {},

      imageInsertion: () => {

         GameModule.addCanvasImageObj( "background1", "img/game/levels/level1.png", 384, 768 );
         GameModule.addCanvasImageObj( "foreground1", "img/game/levels/level1Overlay.png", 384, 768 );

         GameModule.addCanvasImageObj( "kirito", "img/game/sprites/kirito.png", 32, 32, 3 );
         GameModule.addCanvasImageObj( "crow", "img/game/sprites/crow.png", 32, 32, 12 );
         GameModule.addCanvasImageObj( "miyazaki", "img/game/sprites/miyazaki.png", 32, 32 );
         GameModule.addCanvasImageObj( "miyazakiPortrait", "img/game/misc/miyazakiportrait.png", 200, 200 );

         GameModule.setCanvasImageObjPos( images[ "kirito" ], 32, 160 );
         GameModule.setCanvasImageObjPos( images[ "miyazaki" ], 416, 224 );
         GameModule.setCanvasImageObjPos( images[ "crow" ], 368, 134 );

      },

      loadAudio: () => {

         let song1 = new Audio( 'sounds/fmaop3.mp3' ),
            song2 = new Audio( 'sounds/killlakillop1.mp3' ),
            song3 = new Audio( 'sounds/narutoop3.mp3' ),
            song4 = new Audio( 'sounds/steinsgate.mp3' ),
            song5 = new Audio( 'sounds/shigatsuop2.mp3' ),
            song6 = new Audio( 'sounds/baccano.mp3' ),
            song7 = new Audio( 'sounds/durarara.mp3' ),
            song8 = new Audio( 'sounds/geassOp1.mp3' );

         musicBg = [
            song1,
            song2,
            song3,
            song4,
            song5,
            song6,
            song7,
            song8
         ];

      },

      loopAudio: ( i ) => {

         let currentSong = musicBg[ i ];
         currentSong.volume = 0.10;
         currentSong.play();
         currentSong.onended = () => {
            if ( i < 7 ) {
               i++;
            } else {
               i = 0;
            }
            GameModule.loopAudio( i );
         };

      },

      playerControls: () => {

         let player = images[ "kirito" ];

         $( document )
            .keydown( ( key ) => {

               if ( pressedKey == 0 && shouldAnimate == false && listeningToKeyboard == true ) {

                  switch ( key.which ) {

                     case 37:
                        GameModule.changeSpriteOrientation( player, "left" );
                        pressedKey = 37;
                        break;

                     case 38:
                        GameModule.changeSpriteOrientation( player, "up" );
                        pressedKey = 38;
                        break;

                     case 39:
                        GameModule.changeSpriteOrientation( player, "right" );
                        pressedKey = 39;
                        break;

                     case 40:
                        GameModule.changeSpriteOrientation( player, "down" );
                        pressedKey = 40;
                        break;

                     case 27:
                        $( "#alert" )
                           .fadeOut( 500, () => {} );
                        break;

                     case 13:
                        GameModule.alertTextDisplay( [ "" ] );
                        $( "#alert" )
                           .fadeOut( 500, () => {} );
                        break;

                     default:
                        return;

                  }

               }

            } );

         $( document )
            .keyup( ( key ) => {

               // test for arrow key
               if ( key.which == 37 || key.which == 38 || key.which == 39 || key.which == 40 ) {
                  pressedKey = 0;
               }

            } );

      },

      alertTextDisplay: ( stringArray ) => {
         $( "#speech-bubble" )
            .typed( {
               strings: stringArray,
               typeSpeed: 30,
               backSpeed: -50,
               backDelay: 1000,
               callback: () => {}
            } );
      },

      timer: ( timeStamp ) => {

         let globalProgress;
         globalProgress = timeStamp - globalStart;

         if ( !globalStart ) {
            globalStart = timeStamp;
            globalProgress = timeStamp - globalStart;
         }

         let player = images[ "kirito" ];

         if ( pressedKey || shouldAnimate ) {

            shouldAnimate = true;
            let progress = timeStamp - start;

            if ( !start ) {
               start = timeStamp;
               progress = timeStamp - start;
            }

            if ( progress * 16 / 160 <= 16 ) {

               if ( progress % 100 <= 45 && spriteAnimate ) {
                  GameModule.getNextSpriteFrame( player );
                  spriteAnimate = false;
               }

               if ( progress % 100 >= 50 && !spriteAnimate ) {
                  spriteAnimate = true;
               }

               GameModule.moveSprite( player, Math.min( progress * 16 / 160, 16 ) );
               context.clearRect( 0, 0, canvas.width, canvas.height );
               GameModule.setSpriteFrame( player, context );

            } else {

               GameModule.moveSprite( player, 16 );

               playerX = 16 * parseInt( player.xPos / 16 );
               playerY = 16 * parseInt( player.yPos / 16 );

               start = null;
               shouldAnimate = false;

            }

         } else {
            start = null;
         }
         switch ( currentLevel ) {

            case 1:
               if ( globalProgress % 300 <= 100 && crowAnimate ) {
                  GameModule.getNextSpriteFrame( images[ "crow" ] );
                  crowAnimate = false;
                  GameModule.setCanvasForeground( images[ "foreground" + currentLevel ] );
                  GameModule.drawCanvasImageObj( images[ "miyazaki" ], 0, 0, foregroundContext );
                  GameModule.setSpriteFrame( images[ "crow" ], foregroundContext );
               }
               if ( globalProgress % 300 >= 100 && !crowAnimate ) {
                  crowAnimate = true;
               }
               break;

            case 2:
               if ( globalProgress % 400 <= 100 && sheepAnimate ) {
                  let sheep = images[ "sheep" ];
                  GameModule.getNextSpriteFrame( sheep );
                  sheepAnimate = false;
                  GameModule.setCanvasBackground( images[ "background" + currentLevel ] );
                  GameModule.setSpriteFrame( sheep, backgroundContext );
                  if ( sheep.framesNumber == 6 && sheep.currentFrame == 5 ) {
                     sheep.orientation = 1;
                     sheep.framesNumber = 5;
                  } else if ( sheep.framesNumber == 5 && sheep.currentFrame == 4 ) {
                     sheep.orientation = 2;
                     sheep.framesNumber = 4;
                  } else if ( sheep.orientation == 2 ) {
                     sheep.xPos = 8 * ( 35 + sheep.currentFrame );
                     if ( sheep.currentFrame == 3 ) {
                        sheep.orientation = 3;
                        sheep.framesNumber = 4;
                     }
                  } else if ( sheep.orientation == 3 ) {
                     sheep.xPos = 8 * ( 37 - sheep.currentFrame );
                     if ( sheep.currentFrame == 3 ) {
                        sheep.orientation = 4;
                        sheep.framesNumber = 3;
                     }
                  } else if ( sheep.framesNumber == 3 && sheep.currentFrame == 2 ) {
                     sheep.orientation = 0;
                     sheep.framesNumber = 6;
                  }
               }
               if ( globalProgress % 400 >= 100 && !sheepAnimate ) {
                  sheepAnimate = true;
               }
               break;

            case 3:
               if ( globalProgress % 400 < 100 && sheepAnimate ) {
                  sheepAnimate = false;
                  let asuna = images[ "asuna" ];
                  GameModule.getNextSpriteFrame( asuna );
                  sheepAnimate = false;
                  GameModule.setCanvasBackground( images[ "background" + currentLevel ] );
                  GameModule.setSpriteFrame( asuna, backgroundContext );
               } else if ( globalProgress % 400 >= 100 && !sheepAnimate ) {
                  sheepAnimate = true;
               }
               break;

            default:

         }

         requestAnimationFrame( GameModule.timer )

      },

      getNextSpriteFrame: ( spriteObj ) => {

         if ( spriteObj.currentFrame < spriteObj.framesNumber - 1 ) {
            spriteObj.currentFrame += 1;
         } else {
            spriteObj.currentFrame = 0;
         }

      },

      setSpriteFrame: ( spriteObj, spriteContext ) => {

         let xPosImage = spriteObj.currentFrame * spriteObj.width;
         let yPosImage = spriteObj.orientation * spriteObj.height;

         GameModule.drawCanvasImageObj( spriteObj, xPosImage, yPosImage, spriteContext );

      },

      getObjCenterPos: ( obj ) => {

         return {
            xCenterPos: obj.xPos + obj.width / 2,
            yCenterPos: obj.yPos + obj.height / 2
         };

      },

      getDistanceBetweenObjects: ( obj1, obj2 ) => {

         let obj1Position = GameModule.getObjCenterPos( obj1 );
         let obj2Position = GameModule.getObjCenterPos( obj2 );

         return Math.hypot( ( obj1Position.xCenterPos - obj2Position.xCenterPos ), ( obj1Position.yCenterPos - obj2Position.yCenterPos ) );
      },

      moveSprite: ( spriteObj, dist ) => {

         let player = images[ "kirito" ];

         dist = parseInt( dist );

         switch ( spriteObj.orientation ) {

            case 0:
               if ( GameModule.testForFreeSpaceInMap( player.xPos, playerY + 16, 32, 32 ) ) {
                  spriteObj.yPos = playerY + dist;
               }
               break;

            case 1:
               if ( GameModule.testForFreeSpaceInMap( playerX - 16, player.yPos, 32, 32 ) ) {
                  spriteObj.xPos = playerX - dist;
               }
               break;

            case 2:
               if ( GameModule.testForFreeSpaceInMap( playerX + 16, player.yPos, 32, 32 ) ) {
                  spriteObj.xPos = playerX + dist;
               }
               break;

            case 3:
               if ( GameModule.testForFreeSpaceInMap( player.xPos, playerY - 16, 32, 32 ) ) {
                  spriteObj.yPos = playerY - dist;
               }
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

         GameModule.setSpriteFrame( spriteObj, context );

      },

      setRandomSpriteOption: ( obj, numberOfOptions ) => {

         let randomOption = Math.floor( Math.random() * ( numberOfOptions ) );

         obj.css( "background-position", `${ (-randomOption) * size}px 0` );

      },

      renderFrame: () => {},

      insertObjIntoMap: ( obj, xPos, yPos, objValue ) => {

         let {
            width,
            height
         } = GameModule.objSizeToBlockSize( obj );

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
         } = GameModule.objSizeToBlockSize( obj );

         let xPos = $el.mapPosX;
         let yPos = $el.mapPosY;

         for ( let line = yPos; line < yPos + height; line++ ) {
            for ( let column = xPos; column < xPos + width; column++ ) {
               myMap.set( line, column, 0 );
            }
         }

      },

      objSizeToBlockSize: ( obj ) => {

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

               console.log( myMap );

            }

         };

      },

      arrayTo2DLevel: ( levelNumber ) => {

         let levelData = LevelModule.getLevel( levelNumber - 1 );

         for ( let boxNr = 0; boxNr < 1152; boxNr++ ) {
            myMap[ boxNr ] = levelData[ boxNr ];
         }

      },

      getNpcs: ( levelNumber ) => {

         npcs = null;
         npcs = LevelModule.getNpcs( levelNumber - 1 );

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

         if ( xPos >= 0 && yPos >= 0 && xPos < 48 * 16 && yPos < 24 * 16 ) {
            return true;
         }

         return false;

      },

      testForFreeSpaceInMap: ( xPos, yPos, height, width ) => {

         if ( !GameModule.testForPosInMapBoundaries( xPos, yPos ) ) {
            return false;
         }

         for ( let line = yPos / 16; line < ( yPos + height ) / 16; line++ ) {
            for ( let column = xPos / 16; column < ( xPos + width ) / 16; column++ ) {
               if ( myMap.get( line, column ) < 0 ) {
                  GameModule.moveToLevel( -myMap.get( line, column ) );
                  return false;
               }
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

         if ( obj.loaded == false ) {
            obj
               .image
               .addEventListener( "load", () => {
                  backgroundContext.clearRect( 0, 0, 768, 384 );
                  backgroundContext.drawImage( obj.image, 0, 0, obj.width, obj.height, obj.xPos, obj.yPos, obj.width, obj.height );
               }, false );
            obj.loaded = true;
         } else {
            backgroundContext.clearRect( 0, 0, 768, 384 );
            backgroundContext.drawImage( obj.image, 0, 0, obj.width, obj.height, obj.xPos, obj.yPos, obj.width, obj.height );
         }

      },

      setCanvasForeground: ( obj ) => {

         if ( obj.loaded == false ) {
            obj
               .image
               .addEventListener( "load", () => {
                  foregroundContext.clearRect( 0, 0, 768, 384 );
                  foregroundContext.drawImage( obj.image, 0, 0, obj.width, obj.height, obj.xPos, obj.yPos, obj.width, obj.height );
               }, false );
            obj.loaded = true;
         } else {
            foregroundContext.clearRect( 0, 0, 768, 384 );
            foregroundContext.drawImage( obj.image, 0, 0, obj.width, obj.height, obj.xPos, obj.yPos, obj.width, obj.height );
         }

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

      drawCanvasImageObj: ( obj, xPosImage, yPosImage, canvasContext ) => {

         // failure safety
         canvasContext.drawImage( obj.image, xPosImage, yPosImage, obj.width, obj.height, obj.xPos, obj.yPos, obj.width, obj.height );

         if ( obj.loaded == false ) {
            obj
               .image
               .addEventListener( "load", () => {
                  canvasContext.drawImage( obj.image, xPosImage, yPosImage, obj.width, obj.height, obj.xPos, obj.yPos, obj.width, obj.height );
               }, false );
            obj.loaded = true;
         } else {
            canvasContext.drawImage( obj.image, xPosImage, yPosImage, obj.width, obj.height, obj.xPos, obj.yPos, obj.width, obj.height );
         }

      },

      canvasMouseHandler: () => {

         let offset = $game.offset();

         $game.mousemove( ( mouse ) => {

               let mouseLeft = parseInt( ( mouse.pageX - offset.left ) / 16 );
               let mouseTop = parseInt( ( mouse.pageY - offset.top ) / 16 );

               if ( !playerData.specialScreen ) {
                  if ( myMap.get( mouseTop, mouseLeft ) >= 2 ) {
                     $game.css( {
                        cursor: `url('img/game/cursors/pointing_hand.cur'), pointer`
                     } );
                  } else {
                     $game.css( {
                        cursor: `url('img/game/cursors/left_ptr.cur'), default`
                     } );
                  }
               }

            } )
            .click( ( mouse ) => {

               let mouseLeft = parseInt( ( mouse.pageX - offset.left ) / 16 );
               let mouseTop = parseInt( ( mouse.pageY - offset.top ) / 16 );

               if ( myMap.get( mouseTop, mouseLeft ) >= 2 && !playerData.specialScreen ) {
                  GameModule.gameAction( myMap.get( mouseTop, mouseLeft ) );
               }

            } );

      },

      miyazaki: () => {

         if ( GameModule.getDistanceBetweenObjects( images[ "miyazaki" ], images[ "kirito" ] ) < 48 ) {

            switch ( currentLevel ) {

               case 1:
                  let stringArray = [
                     "Servus, bine ai venit în frumoasa lume a anime-urilor!",
                     "Aici o să poți învăța într-un mod interactiv despre tot ce ține de lumea aceasta.",
                     "Pentru început, ca să ajungi în orașul central, urcă în barca de mai jos! </br> ^1000 (Apasă ESC pentru a închide un dialog)"
                  ];
                  GameModule.drawCanvasImageObj( images[ "miyazakiPortrait" ], 0, 0, portraitContext );
                  $( "#alert" )
                     .fadeIn( 500, () => {
                        GameModule.alertTextDisplay( stringArray );
                     } );
                  break;

               default:
                  break;

            }

         }
      },

      fadeInText: ( text, x, y ) => {
         let alpha = 0;
         let interval = setInterval( () => {
            foregroundContext.fillStyle = "rgba(0, 0, 0, " + alpha + ")";
            foregroundContext.fillText( text, x, y );
            alpha += 0.05;
            if ( alpha > 1 ) {
               clearInterval( interval );
            }
         }, 50 );
      },

      fadeInImage: ( image ) => {
         let alpha = 0,
            interval = setInterval( () => {
               foregroundContext.globalAlpha = alpha;
               GameModule.drawCanvasImageObj( image, 0, 0, foregroundContext );
               alpha += 0.05;
               if ( alpha > 1 ) {
                  clearInterval( interval );
               }
            }, 60 );
      },


      challengeL: () => {

         let myGame = document.getElementById( "game" );

         if ( GameModule.getDistanceBetweenObjects( images[ "L" ], images[ "kirito" ] ) < 48 && !playerData.lChallengeCompleted ) {

            GameModule.addCanvasImageObj( "lChallenge", "img/game/levels/lChallenge.png", 384, 768 );
            GameModule.setCanvasForeground( images[ "lChallenge" ] );
            foregroundContext.font = "32px sans-serif";
            playerData.specialScreen = true;

            let frame1 = () => {

               setTimeout( () => {
                  GameModule.fadeInText( "Kon'nichiwa!", 24 * 16, 10 * 16 );
               }, 1000 );

               setTimeout( () => {
                  GameModule.fadeInText( "Eu sunt ", 26 * 16, 12 * 16 );
               }, 2500 );

               setTimeout( () => {
                  GameModule.addCanvasImageObj( "lLogo", "img/game/misc/lLogo.png", 384, 768 );
                  GameModule.setCanvasImageObjPos( images[ "lLogo" ], 26 * 16, 12 * 16 );
                  GameModule.fadeInImage( images[ "lLogo" ] );
               }, 4000 );

               setTimeout( () => {
                  frame2();
               }, 5500 );

            }

            let frame2 = () => {

               foregroundContext.globalAlpha = 1;
               foregroundContext.font = "20px sans-serif";
               foregroundContext.clearRect( 0, 0, canvas.width, canvas.height );
               GameModule.setCanvasForeground( images[ "lChallenge" ] );

               setTimeout( () => {
                  GameModule.fadeInText( "Dacă îmi spui care este numele meu,", 18 * 16, 10 * 16 - 8 );
               }, 1750 );

               setTimeout( () => {
                  GameModule.fadeInText( "Am să îţi dau ceva de care ai nevoie.", 18 * 16, 11 * 16 );
               }, 3250 );

               setTimeout( () => {
                  GameModule.addCanvasImageObj( "lOpt1", "img/game/misc/lOpt1.png", 32, 352 );
                  GameModule.addCanvasImageObj( "lOpt2", "img/game/misc/lOpt2.png", 32, 352 );
                  GameModule.addCanvasImageObj( "lOpt3", "img/game/misc/lOpt3.png", 32, 352 );
                  GameModule.setCanvasImageObjPos( images[ "lOpt1" ], 18 * 16, 12 * 16 );
                  GameModule.setCanvasImageObjPos( images[ "lOpt2" ], 18 * 16, 14 * 16 );
                  GameModule.setCanvasImageObjPos( images[ "lOpt3" ], 18 * 16, 16 * 16 );
                  GameModule.fadeInImage( images[ "lOpt1" ] );
                  GameModule.fadeInImage( images[ "lOpt2" ] );
                  GameModule.fadeInImage( images[ "lOpt3" ] );
                  challenge();
               }, 5000 );

            }

            let lQuizHandler = ( event ) => {

               let offset = $game.offset();
               let mouseLeft = parseInt( ( event.pageX - offset.left ) / 16 );
               let mouseTop = parseInt( ( event.pageY - offset.top ) / 16 );

               if ( mouseLeft >= 18 && mouseLeft < 28 && mouseTop >= 12 && mouseTop < 18 ) {

                  if ( mouseTop < 14 ) {

                     infoMiyazaki( wrongAnswer );

                  } else if ( mouseTop < 16 ) {

                     infoMiyazaki( wrongAnswer );

                  } else {

                     infoMiyazaki( rightAnswer );

                  }

                  myGame.removeEventListener( "mousemove", lQuizHover, false );
                  myGame.removeEventListener( "click", lQuizHandler, false );
               }

            }

            let lQuizHover = ( event ) => {

               let offset = $game.offset();
               let mouseLeft = parseInt( ( event.pageX - offset.left ) / 16 );
               let mouseTop = parseInt( ( event.pageY - offset.top ) / 16 );

               if ( mouseLeft >= 18 && mouseLeft < 28 && mouseTop >= 12 && mouseTop < 18 ) {
                  $game.css( {
                     cursor: `url('img/game/cursors/pointing_hand.cur'), pointer`
                  } );
               } else {
                  $game.css( {
                     cursor: `url('img/game/cursors/left_ptr.cur'), default`
                  } );
               }

            }

            let rightAnswer = [
               "Corect! Eu sunt L Lawliet, cunoscut însă ca fiind doar L de majoritatea lumii.",
               "În anime-ul Death Note, unul dintre cele mai populare titluri recente, am rolul de detectiv.",
               "Duşmanul meu este Light, un tânăr care m-ar putea omorî ştiindu-mi doar numele complet. ",
               "Uite-ţi recompensa, vei avea nevoie de ea mai jos! (ESC)"
            ];

            let wrongAnswer = [
               "Greşit! Numele meu este L Lawliet, dar foarte puţină lume ştie acest lucru. ^500 Public mi se spune doar L.",
               "În anime-ul Death Note, unul dintre cele mai populare titluri recente, am rolul de detectiv.",
               "Duşmanul meu este Light, un tânăr care m-ar putea omorî ştiindu-mi doar numele complet. ",
               "Pentru efortul tău am să îţi dau totuşi recompensa... Vei avea nevoie de ea în căsuţa de mai jos! (ESC)"
            ];

            let infoMiyazaki = ( answer ) => {


               GameModule.setCanvasForeground( images[ "foreground" + 2 ] );
               document.addEventListener( "keypress", rewardPlayer, false );
               portraitContext.clearRect( 0, 0, portrait.width, portrait.height );
               GameModule.addCanvasImageObj( "lPortrait", "img/game/misc/lPortrait.png", 200, 200 );
               GameModule.drawCanvasImageObj( images[ "lPortrait" ], 0, 0, portraitContext );
               playerData.specialScreen = false;

               $( "#alert" )
                  .fadeIn( 500, () => {
                     GameModule.alertTextDisplay( answer );
                  } );

            }

            let rewardPlayer = ( event ) => {
               let char = event.which || event.keyCode;
               if ( char == 27 ) {

                  myGame.removeEventListener( "click", rewardPlayer, false );
                  playerData.lChallengeCompleted = true;
                  GameModule.drawCanvasImageObj( images[ "L" ], 0, 0, foregroundContext );

                  setTimeout( () => {
                     GameModule.addCanvasImageObj( "reward01", "img/game/misc/reward01.png", 384, 768 );
                     GameModule.setCanvasImageObjPos( images[ "reward01" ], 334, 152 );
                     GameModule.fadeInImage( images[ "reward01" ] );
                     playerData.coins += 24;
                  }, 1000 );

                  setTimeout( () => {
                     GameModule.setCanvasForeground( images[ "foreground" + 2 ] );
                     GameModule.drawCanvasImageObj( images[ "L" ], 0, 0, foregroundContext );
                  }, 2500 );

               }
            }

            let challenge = () => {
               myGame.addEventListener( "click", lQuizHandler, false );
               myGame.addEventListener( "mousemove", lQuizHover, false );
            }


            frame1();

         }

      },

      asuna: () => {
         if ( GameModule.getDistanceBetweenObjects( images[ "asuna" ], images[ "kirito" ] ) < 48 ) {
            console.log( "Asuna" );
         }
      },

      gameAction: ( id ) => {

         let obj = npcs.filter( ( obj ) => {
            return obj.id === id;
         } )[ 0 ];

         switch ( obj.name ) {

            case "miyazaki":
               GameModule.miyazaki();
               break;

            case "L":
               GameModule.challengeL();
               break;

            case "asuna":
               GameModule.asuna();
               break;

            case "piano":
               let pianoEffect = new Audio( 'sounds/piano.mp3' );
               pianoEffect.volume = 0.05;
               pianoEffect.play();

            default:
               break;

         }

      },

      addCoins: ( amount ) => {
         playerData.coins += amount;
      },

      moveToLevel: ( nextLevel ) => {
         let player = images[ "kirito" ];
         switch ( nextLevel ) {
            case 2:

               pressedKey = false;
               shouldAnimate = false;
               GameModule.setCanvasImageObjPos( player, playerX, playerY );

               if ( currentLevel == 1 ) {

                  listeningToKeyboard = false;
                  playerX = 44 * 16;
                  playerY = 32;
                  GameModule.setCanvasImageObjPos( images[ "kirito" ], playerX, playerY, context );
                  GameModule.changeSpriteOrientation( images[ "kirito" ], "left" );

                  $( "#screen-transition" )
                     .prop( "src", "img/game/gifs/kiriwave.gif" )
                     .fadeIn( 1500, () => {

                        setTimeout( () => {
                           $( "#screen-transition" )
                              .fadeOut( 1500, () => {
                                 listeningToKeyboard = true;
                              } )
                        }, 3000 );

                     } );

               } else {

                  listeningToKeyboard = false;
                  playerX = 4 * 16;
                  playerY = 19 * 16;
                  GameModule.setCanvasImageObjPos( images[ "kirito" ], playerX, playerY, context );
                  GameModule.changeSpriteOrientation( images[ "kirito" ], "left" );
                  setTimeout( () => {
                     listeningToKeyboard = true
                  }, 200 );

               }

               currentLevel = 2;
               GameModule.arrayTo2DLevel( 2 );
               GameModule.getNpcs( 2 );
               context.clearRect( 0, 0, canvas.width, canvas.height );
               foregroundContext.clearRect( 0, 0, canvas.width, canvas.height );
               backgroundContext.clearRect( 0, 0, canvas.width, canvas.height );
               GameModule.addCanvasImageObj( "background2", "img/game/levels/level2.png", 384, 768 );
               GameModule.addCanvasImageObj( "foreground2", "img/game/levels/level2Overlay.png", 384, 768 );
               GameModule.addCanvasImageObj( "sheep", "img/game/sprites/sheep.png", 32, 32, 6 );
               GameModule.addCanvasImageObj( "L", "img/game/sprites/Lchar.png", 32, 32 );
               GameModule.setCanvasImageObjPos( images[ "sheep" ], 17 * 16, 14 * 16 );
               GameModule.setCanvasImageObjPos( images[ "L" ], 7 * 16, 5 * 16 );
               GameModule.setCanvasBackground( images[ "background" + 2 ] );
               GameModule.setCanvasForeground( images[ "foreground" + 2 ] );
               GameModule.drawCanvasImageObj( images[ "L" ], 0, 0, foregroundContext );
               GameModule.setSpriteFrame( images[ "kirito" ], context );
               GameModule.setSpriteFrame( images[ "sheep" ], backgroundContext );

               break;

            case 3:
               if ( playerData.coins == 24 ) {
                  pressedKey = false;
                  shouldAnimate = false;
                  GameModule.setCanvasImageObjPos( player, playerX, playerY );
                  listeningToKeyboard = false;
                  playerData.coins -= 16;
                  currentLevel = 3;
                  GameModule.arrayTo2DLevel( 3 );
                  GameModule.getNpcs( 3 );
                  playerX = 368;
                  playerY = 288;
                  GameModule.setCanvasImageObjPos( images[ "kirito" ], playerX, playerY, context );
                  GameModule.changeSpriteOrientation( images[ "kirito" ], "left" );
                  context.clearRect( 0, 0, canvas.width, canvas.height );
                  foregroundContext.clearRect( 0, 0, canvas.width, canvas.height );
                  backgroundContext.clearRect( 0, 0, canvas.width, canvas.height );
                  GameModule.addCanvasImageObj( "background3", "img/game/levels/level3.png", 384, 768 );
                  GameModule.addCanvasImageObj( "foreground3", "img/game/levels/level3Overlay.png", 384, 768 );
                  GameModule.addCanvasImageObj( "asuna", "img/game/sprites/asunafix.png", 32, 32, 2 );
                  GameModule.setCanvasBackground( images[ "background" + 3 ] );
                  GameModule.setCanvasForeground( images[ "foreground" + 3 ] );
                  GameModule.setCanvasImageObjPos( images[ "asuna" ], 16 * 16, 240 );
                  GameModule.setSpriteFrame( images[ "kirito" ], context );
                  GameModule.setSpriteFrame( images[ "asuna" ], backgroundContext );
                  sheepAnimate = true;

                  listeningToKeyboard = true;
               } else {

                  GameModule.addCanvasImageObj( "tax01", "img/game/misc/tax01.png", 384, 768 );
                  GameModule.setCanvasImageObjPos( images[ "tax01" ], 334, 152 );
                  GameModule.fadeInImage( images[ "tax01" ] );

                  setTimeout( () => {
                     GameModule.setCanvasForeground( images[ "foreground" + 2 ] );
                     GameModule.drawCanvasImageObj( images[ "L" ], 0, 0, foregroundContext );
                  }, 2500 );

               }
               break;
            default:

         }
      }
   };
} )();

$( "#game" )
   .imagesLoaded( () => {
      GameModule.test();
   } );
