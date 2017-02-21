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
      fireAnimate = true,
      asunaAnimate = true,
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

                        $( "#screen-transition" )
                           .prop( "src", "img/game/gifs/kiriwave.gif" );

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
         currentSong.volume = 0.40;
         currentSong.play();
         currentSong.onended = () => {
            if ( i < 7 ) {
               i++;
            } else {
               i = 0;
            }
            GameModule.loopAudio( i );
         };

         let specialSong = new Audio( 'sounds/attackOnTitan.mp3' );
         specialSong.volume = 0.3;

         document.addEventListener( "attack", () => {
            currentSong.pause();
            specialSong.play();
            specialSong.onended = () => {
               specialSong.play();
            };
         }, false );

         document.addEventListener( "music", () => {
            specialSong.pause();
            currentSong.play();
         }, false );

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

               GameModule.movePlayerChar( player, Math.min( progress * 16 / 160, 16 ) );
               context.clearRect( 0, 0, canvas.width, canvas.height );
               GameModule.setSpriteFrame( player, context );

            } else {

               GameModule.movePlayerChar( player, 16 );

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
               GameModule.crow( globalProgress );
               break;

            case 2:
               GameModule.sheep( globalProgress );
               break;

            case 3:
               GameModule.houseSpriteAnimations( globalProgress );
               break;

            case 4:
               break;

            default:
               break;

         }

         requestAnimationFrame( GameModule.timer )

      },

      fireBlast: ( x, y ) => {

         let tower = images[ "tower" ];

         let towerAnimate = setInterval( () => {
            context.clearRect( 0, 0, canvas.width, canvas.height );
            GameModule.setSpriteFrame( tower, context );
            if ( tower.currentFrame == 8 ) {
               clearInterval( towerAnimate );
               laser();
            }
            GameModule.getNextSpriteFrame( tower );
         }, 120 );

         let laser = () => {
            context.lineWidth = 5;
            context.lineCap = "round";
            context.strokeStyle = '#c80000';
            context.beginPath();
            context.moveTo( 105, 62 );
            context.lineTo( x, y );
            context.moveTo( 105, 60 );
            context.lineTo( x, y );
            context.moveTo( 105, 64 );
            context.lineTo( x, y );
            context.stroke();
            GameModule.setCanvasImageObjPos( images[ "blast" ], x - 32, y - 31 );
            GameModule.drawCanvasImageObj( images[ "blast" ], 0, 0, context );
            let laserEffect = new Audio( 'sounds/bomb.mp3' );
            laserEffect.volume = 0.8;
            laserEffect.play();
            setTimeout( () => {
               context.clearRect( 0, 0, canvas.width, canvas.height );
               GameModule.setSpriteFrame( tower, context );
               GameModule.drawCanvasImageObj( images[ "blast" ], 0, 0, context );
               GameModule.titanShake();
               setTimeout( () => {
                  context.clearRect( 0, 0, canvas.width, canvas.height );
                  GameModule.setSpriteFrame( tower, context );
               }, 120 );
            }, 120 );
         }

      },

      goku: () => {

         let goku = images[ "goku" ];
         let titan = images[ "titan" ];

         goku.yPos = 282;
         goku.xPos = -66;

         let gokuTxt = [ "Cred că ar fi timpul să te ajut!" ];
         let gokuKameTxt = [ "KAMEHAMEHAAAAAA!!!" ];

         portraitContext.clearRect( 0, 0, portrait.width, portrait.height );
         GameModule.addCanvasImageObj( "gokuPortrait", "img/game/misc/goku.png", 200, 200 );
         GameModule.drawCanvasImageObj( images[ "gokuPortrait" ], 0, 0, portraitContext );

         $( "#alert" )
            .fadeIn( 500, () => {
               GameModule.alertTextDisplay( gokuTxt );
               setTimeout( () => {

                  $( "#alert" )
                     .fadeOut( 500, () => {

                        let gokuMove = setInterval( () => {

                           if ( goku.xPos < 120 ) {
                              foregroundContext.clearRect( 0, 0, canvas.width, canvas.height );
                              goku.xPos += 1;
                              GameModule.setSpriteFrame( goku, foregroundContext );
                           } else {
                              clearInterval( gokuMove );
                              let kameAudio = new Audio( 'sounds/Kamehameha.mp3' );
                              kameAudio.volume = 1;
                              kameAudio.play();
                              $( "#alert" )
                                 .fadeIn( 500, () => {
                                    GameModule.alertTextDisplay( gokuKameTxt );
                                    setTimeout( function () {
                                       $( "#alert" )
                                          .fadeOut( 500, () => {
                                             setTimeout( kamehameha, 2000 );
                                          } );
                                    }, 5000 );
                                 } );
                           }

                        }, 10 );

                     } );

               }, 3000 );
            } );

         let kamehameha = () => {
            let blastStarted = false;
            let tInterval = 400;
            let gokuAnimate = setInterval( () => {
               foregroundContext.clearRect( 0, 0, canvas.width, canvas.height );
               GameModule.setSpriteFrame( goku, foregroundContext );
               if ( goku.currentFrame == 5 ) {
                  goku.currentFrame = 2;
                  if ( !blastStarted ) {
                     GameModule.kamehameha();
                     blastStarted = true;
                     tInterval = 300;
                     clearInterval( gokuAnimate );
                  }
               }
               GameModule.getNextSpriteFrame( goku );
            }, tInterval );
         };

      },

      kamehameha: () => {

         let kame = images[ "kamehameha" ],
            goku = images[ "goku" ],
            kameX = 90,
            kameY;

         kame.currentFrame = 0;

         let drawRotatedBlast = ( x, y ) => {
            if ( x % 40 == 0 ) {
               if ( goku.currentFrame == 5 ) {
                  goku.currentFrame = 2;
               }
               GameModule.getNextSpriteFrame( goku );
            }
            kame.xPos = 0;
            kame.yPos = 0;
            foregroundContext.clearRect( 0, 0, canvas.width, canvas.height );
            GameModule.setSpriteFrame( goku, foregroundContext );
            foregroundContext.save();
            foregroundContext.translate( x + 64, y + 64 );
            foregroundContext.rotate( 0.12125902920621191 );
            GameModule.setSpriteFrame( kame, foregroundContext );
            foregroundContext.restore();
         }

         let kameInterval = setInterval( () => {

            if ( kameX < 506 - 64 ) {

               kameX += 5;
               kameY = 2 * 269 - 64 - Math.round( 0.20 * kameX + 258 );
               drawRotatedBlast( kameX, kameY );

               if ( kameX == 100 ) {
                  GameModule.getNextSpriteFrame( kame );
               } else if ( kameX == 200 ) {
                  GameModule.getNextSpriteFrame( kame );
               } else if ( kameX == 200 ) {
                  GameModule.getNextSpriteFrame( kame );
               } else if ( kameX == 300 ) {
                  GameModule.getNextSpriteFrame( kame );
               } else if ( kameX == 400 ) {
                  GameModule.getNextSpriteFrame( kame );
               }

            } else {

               foregroundContext.clearRect( 0, 0, canvas.width, canvas.height );
               GameModule.setSpriteFrame( goku, foregroundContext );
               GameModule.titanShake();
               clearInterval( kameInterval );

               let tInterval = 200;
               let gokuAnimate = setInterval( () => {
                  foregroundContext.clearRect( 0, 0, canvas.width, canvas.height );
                  GameModule.setSpriteFrame( goku, foregroundContext );
                  if ( goku.currentFrame == 5 ) {

                     clearInterval( gokuAnimate );
                     foregroundContext.clearRect( 0, 0, canvas.width, canvas.height );

                     let gokuMove = setInterval( () => {

                        if ( goku.xPos > -67 ) {
                           foregroundContext.clearRect( 0, 0, canvas.width, canvas.height );
                           goku.xPos -= 2;
                           GameModule.setSpriteFrame( goku, foregroundContext );
                        } else {
                           clearInterval( gokuMove );
                           foregroundContext.clearRect( 0, 0, canvas.width, canvas.height );
                           GameModule.getNextSpriteFrame( kame );
                           setTimeout( GameModule.titanRetreat, 4500 );
                        }

                     }, 10 );

                  }
                  GameModule.getNextSpriteFrame( goku );
               }, tInterval );

            }

         }, 40 );

      },

      titanAttack: () => {

         let titan = images[ "titan" ];

         titan.yPos = 0;
         titan.xPos = 768;

         let titanInit = setInterval( () => {

            if ( titan.xPos > 124 ) {
               GameModule.setCanvasBackground( images[ "background" + 4 ] );
               titan.xPos -= 2;
               GameModule.drawCanvasImageObj( titan, 0, 0, backgroundContext );
            } else {
               clearInterval( titanInit );
               GameModule.quiz();
            }

         }, 10 );

      },

      titanRetreat: () => {

         let titan = images[ "titan" ];

         titan.yPos = 0;
         titan.xPos = 124;

         let titanInit = setInterval( () => {

            if ( titan.xPos < 768 ) {
               GameModule.setCanvasBackground( images[ "background" + 4 ] );
               titan.xPos += 2;
               GameModule.drawCanvasImageObj( titan, 0, 0, backgroundContext );
            } else {
               clearInterval( titanInit );
               let event = new CustomEvent( 'music', {
                  'detail': "iAmNoPotato"
               } );
               document.dispatchEvent( event );
               GameModule.addCoins( 16 );
               GameModule.moveToLevel( 3 );
            }

         }, 10 );

      },

      titanShake: () => {

         let titan = images[ "titan" ];

         let shakenLeft = false,
            shakenRight = false;

         let shake = setInterval( () => {

            if ( !shakenLeft ) {
               if ( titan.xPos > 114 ) {
                  GameModule.setCanvasBackground( images[ "background" + 4 ] );
                  titan.xPos -= 3;
                  GameModule.drawCanvasImageObj( titan, 0, 0, backgroundContext );
               } else {
                  shakenLeft = true;
               }
            } else if ( !shakenRight ) {
               if ( titan.xPos < 138 ) {
                  GameModule.setCanvasBackground( images[ "background" + 4 ] );
                  titan.xPos += 3;
                  GameModule.drawCanvasImageObj( titan, 0, 0, backgroundContext );
               } else {
                  shakenRight = true;
               }
            } else {
               if ( titan.xPos > 124 ) {
                  GameModule.setCanvasBackground( images[ "background" + 4 ] );
                  titan.xPos -= 3;
                  GameModule.drawCanvasImageObj( titan, 0, 0, backgroundContext );
               } else {
                  GameModule.setCanvasBackground( images[ "background" + 4 ] );
                  titan.xPos = 124;
                  GameModule.drawCanvasImageObj( titan, 0, 0, backgroundContext );
                  clearInterval( shake );
               }
            }

         }, 10 );

      },

      quiz: () => {

         let myGame = document.getElementById( "game" );
         let choices = LevelModule.getChoices();
         let counter = 0;

         let getRandomIntInclusive = ( min, max ) => {
            min = Math.ceil( min );
            max = Math.floor( max );
            return Math.floor( Math.random() * ( max - min + 1 ) ) + min;
         }

         let closeGame = ( e ) => {

            console.log( e.keyCode );

            if ( e.keyCode === 27 ) {
               GameModule.addCoins( 16 );
               GameModule.moveToLevel( 3 );
               myGame.removeEventListener( 'click', optionSelect, false );
               document.removeEventListener( 'keypress', closeGame, false );
            }

         }

         let optionSelect = ( event ) => {

            let mouseLeft = event.layerX;
            let mouseTop = event.layerY;

            if ( mouseTop >= 240 && mouseTop <= 336 ) {
               if ( mouseLeft >= 232 && mouseLeft <= 472 ) {
                  let selectedOption = Math.floor( ( mouseLeft - 232 ) / 80 );
                  let event = new CustomEvent( 'optionClicked', {
                     'detail': selectedOption
                  } );
                  myGame.dispatchEvent( event );
               }
            }

         }

         let quizHover = ( event ) => {


            let mouseLeft = event.layerX;
            let mouseTop = event.layerY;

            if ( mouseTop >= 240 && mouseTop <= 336 ) {
               if ( mouseLeft >= 232 && mouseLeft <= 472 ) {
                  $game.css( {
                     cursor: `url('img/game/cursors/pointing_hand.cur'), pointer`
                  } );
               } else {
                  $game.css( {
                     cursor: `url('img/game/cursors/left_ptr.cur'), default`
                  } );
               }
            } else {
               $game.css( {
                  cursor: `url('img/game/cursors/left_ptr.cur'), default`
               } );
            }

         }

         myGame.addEventListener( 'click', optionSelect, false );
         myGame.addEventListener( 'mousemove', quizHover, false );
         document.addEventListener( 'keypress', closeGame, false );

         GameModule.addCanvasImageObj( "whiteBar", "img/game/misc/whiteBar.png", 32, 768 );
         GameModule.setCanvasImageObjPos( images[ "whiteBar" ], 0, 0 );

         let nextQuizOption = () => {

            let option = getRandomIntInclusive( 0, 2 );
            console.log( option );

            context.clearRect( 0, 0, canvas.width, canvas.height );
            GameModule.addCanvasImageObj( "choice" + counter, choices[ counter ].imgSrc, 128, 256 );
            GameModule.setCanvasImageObjPos( images[ "choice" + counter ], 224, 224 );
            GameModule.fadeInImage( images[ "choice" + counter ] );
            GameModule.drawCanvasImageObj( images[ "choice" + counter ], 0, 0, context );
            GameModule.drawCanvasImageObj( images[ "tower" ], 0, 0, context );
            GameModule.drawCanvasImageObj( images[ "whiteBar" ], 0, 0, context );
            foregroundContext.clearRect( 0, 0, canvas.width, canvas.height );
            GameModule.fadeInText( choices[ counter ].characters[ option ], 320, 20 );

            let optionCompare = ( e ) => {

               let moveOn = () => {
                  myGame.removeEventListener( 'optionClicked', optionCompare, false );
                  if ( counter < 7 ) {
                     counter++;
                     nextQuizOption();
                  } else {
                     myGame.removeEventListener( 'click', optionSelect, false );
                     document.removeEventListener( 'keypress', closeGame, false );
                     context.clearRect( 0, 0, canvas.width, canvas.height );
                     GameModule.drawCanvasImageObj( images[ "tower" ], 0, 0, context );
                     GameModule.goku();
                  }
               }

               if ( e.detail == option ) {
                  // let yay = new Audio( 'sounds/yay.mp3' );
                  // yay.volume = 1;
                  // yay.play();
                  foregroundContext.clearRect( 0, 0, canvas.width, canvas.height );
                  GameModule.fireBlast( getRandomIntInclusive( 600, 700 ), getRandomIntInclusive( 100, 300 ) );
                  setTimeout( moveOn, 1500 );
               } else {
                  let boo = new Audio( 'sounds/boo.mp3' );
                  boo.volume = 1;
                  boo.play();
                  moveOn();
               }

            }

            myGame.addEventListener( 'optionClicked', optionCompare, false );

         }

         nextQuizOption();

      },

      crow: ( progress ) => {

         if ( progress % 150 <= 100 && crowAnimate ) {
            GameModule.getNextSpriteFrame( images[ "crow" ] );
            crowAnimate = false;
            GameModule.setCanvasForeground( images[ "foreground" + currentLevel ] );
            GameModule.drawCanvasImageObj( images[ "miyazaki" ], 0, 0, foregroundContext );
            GameModule.setSpriteFrame( images[ "crow" ], foregroundContext );
         }
         if ( progress % 150 >= 100 && !crowAnimate ) {
            crowAnimate = true;
         }

      },

      houseSpriteAnimations: ( progress ) => {

         if ( progress % 100 < 60 && fireAnimate ) {

            fireAnimate = false;
            let fire = images[ "fire" ];
            GameModule.getNextSpriteFrame( fire );
            GameModule.setCanvasBackground( images[ "background" + currentLevel ] );
            GameModule.setSpriteFrame( fire, backgroundContext );
            GameModule.setSpriteFrame( images[ "asuna" ], backgroundContext );

            if ( progress % 400 < 60 && asunaAnimate ) {
               asunaAnimate = false;
               GameModule.getNextSpriteFrame( images[ "asuna" ] );
            } else if ( progress % 400 >= 60 && !asunaAnimate ) {
               asunaAnimate = true;
            }

         } else if ( progress % 100 >= 60 && !fireAnimate ) {
            fireAnimate = true;
         }

      },

      sheep: ( progress ) => {

         if ( progress % 400 <= 100 && sheepAnimate ) {

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

         if ( progress % 400 >= 100 && !sheepAnimate ) {
            sheepAnimate = true;
         }

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

      movePlayerChar: ( spriteObj, dist ) => {

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
               document.addEventListener( "keydown", rewardPlayer, false );
               portraitContext.clearRect( 0, 0, portrait.width, portrait.height );
               GameModule.addCanvasImageObj( "lPortrait", "img/game/misc/lPortrait.png", 200, 200 );
               GameModule.drawCanvasImageObj( images[ "lPortrait" ], 0, 0, portraitContext );
               GameModule.drawCanvasImageObj( images[ "L" ], 0, 0, foregroundContext );
               playerData.specialScreen = false;

               $( "#alert" )
                  .fadeIn( 500, () => {
                     GameModule.alertTextDisplay( answer );
                  } );

            }

            let rewardPlayer = ( event ) => {
               let char = event.which || event.keyCode;
               if ( char == 27 ) {

                  document.removeEventListener( "keydown", rewardPlayer, false );
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

            let asunaTxt = [ "Kirito, prietenul meu drag, în sfârşit ai venit la mine acasă!",
               "Sţiu că eşti obosit de la atâta drum, nu vrei să joci un joc?",
               "Trebuie să recunoşti personaje din anime-uri!",
               "Dacă nu îţi place jocul şi preferi să înveţi ceva în loc,",
               "apasă tasta 'esc' şi du-te la globul din colţul camerei, sau cântă un pic la pian."
            ];

            portraitContext.clearRect( 0, 0, portrait.width, portrait.height );
            GameModule.addCanvasImageObj( "asunaPortrait", "img/game/misc/asuna.png", 200, 200 );
            GameModule.drawCanvasImageObj( images[ "asunaPortrait" ], 0, 0, portraitContext );

            let closeGame = ( e ) => {
               if ( e.keyCode === 27 ) {
                  $( "#alert" )
                     .fadeOut( 500, () => {} );
                  document.removeEventListener( "keydown", closeGame, false );
                  GameModule.moveToLevel( 4 );
               }
            }

            $( "#alert" )
               .fadeIn( 500, () => {
                  document.addEventListener( "keydown", closeGame, false );
                  GameModule.alertTextDisplay( asunaTxt );
               } );
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
               pianoEffect.volume = 1;
               pianoEffect.play();
               break;

            case "back":
               window.location.href = "index.html";
               break;

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

               let level2Load = () => {
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
               };


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
                     .fadeIn( 1500, () => {

                        level2Load();

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
                  GameModule.changeSpriteOrientation( images[ "kirito" ], "down" );
                  setTimeout( () => {
                     listeningToKeyboard = true;
                  }, 200 );
                  playerData.coins += 16;
                  level2Load();

               }

               break;

            case 3:
               if ( playerData.coins >= 16 ) {

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
                  GameModule.changeSpriteOrientation( images[ "kirito" ], "up" );
                  context.clearRect( 0, 0, canvas.width, canvas.height );
                  foregroundContext.clearRect( 0, 0, canvas.width, canvas.height );
                  backgroundContext.clearRect( 0, 0, canvas.width, canvas.height );
                  GameModule.addCanvasImageObj( "background3", "img/game/levels/level3.png", 384, 768 );
                  GameModule.addCanvasImageObj( "foreground3", "img/game/levels/level3Overlay.png", 384, 768 );
                  GameModule.addCanvasImageObj( "asuna", "img/game/sprites/asunafix.png", 32, 32, 2 );
                  GameModule.addCanvasImageObj( "fire", "img/game/sprites/fire.png", 32, 32, 7 );
                  GameModule.setCanvasBackground( images[ "background" + 3 ] );
                  GameModule.setCanvasForeground( images[ "foreground" + 3 ] );
                  GameModule.setCanvasImageObjPos( images[ "asuna" ], 16 * 16, 240 );
                  GameModule.setCanvasImageObjPos( images[ "fire" ], 29 * 16, 80 );
                  GameModule.setSpriteFrame( images[ "kirito" ], context );
                  GameModule.setSpriteFrame( images[ "asuna" ], backgroundContext );
                  GameModule.setSpriteFrame( images[ "fire" ], backgroundContext );

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

            case 4:

               let event = new CustomEvent( 'attack', {
                  'detail': "iAmPotato"
               } );
               document.dispatchEvent( event );

               pressedKey = false;
               shouldAnimate = false;
               GameModule.setCanvasImageObjPos( player, playerX, playerY );
               listeningToKeyboard = false;

               currentLevel = 4;

               context.clearRect( 0, 0, canvas.width, canvas.height );
               foregroundContext.clearRect( 0, 0, canvas.width, canvas.height );
               backgroundContext.clearRect( 0, 0, canvas.width, canvas.height );
               GameModule.addCanvasImageObj( "background4", "img/game/levels/sky.png", 384, 768 );
               GameModule.addCanvasImageObj( "foreground4", "img/game/levels/transparent.png", 384, 768 );
               GameModule.addCanvasImageObj( "tower", "img/game/sprites/towerW169H350.png", 350, 169, 9 );
               GameModule.addCanvasImageObj( "goku", "img/game/sprites/goku1.png", 102, 66, 6 );
               GameModule.addCanvasImageObj( "meteor", "img/game/sprites/meteor.png", 331, 303, 10 );
               GameModule.addCanvasImageObj( "kamehameha", "img/game/sprites/kamehameha.png", 128, 128, 6 );
               GameModule.addCanvasImageObj( "blast", "img/game/misc/blast.png", 64, 57 );
               GameModule.addCanvasImageObj( "titan", "img/game/misc/titan.png", 384, 655 );
               GameModule.setCanvasBackground( images[ "background" + 4 ] );
               GameModule.setCanvasForeground( images[ "foreground" + 4 ] );
               GameModule.setCanvasImageObjPos( images[ "tower" ], 20, 44 );
               GameModule.setSpriteFrame( images[ "tower" ], context );

               // listeningToKeyboard = true;
               GameModule.titanAttack();

               break;

            case 5:
               currentLevel = 5;
               break;

            case 6:
               currentLevel = 6;
               break;

            default:
               break;

         }
      }
   };
} )();

$( "#game" )
   .imagesLoaded( () => {
      GameModule.test();
   } );
