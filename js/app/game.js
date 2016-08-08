var GameModule = (function() {

   // global vars
   var controlsEnabled = false;
   var $mainChar = $("#mainChar");
   var playerMoving;
   var solids = [];
   var gameOffset = {};

   // char control vars
   var playerMoveOptions = { queue: true, duration: 10, delay: 0, easing: "linear" },
   moveValue, movementOrientation, currentKey;
   var mainCharSpriteAnimating = false;
   var listeningToKeyPress = true;

   return {

      init: function() {

         // enable char controls after page is loaded
         controlsEnabled = true;

         // get gameOffset and store it in global var
         gameOffset.x = $("#gameBox").offset().left;
         gameOffset.y = $("#gameBox").offset().top;

      },

      bindHandlers: function() {

         $(window).on("resize", function() {
            gameOffset.x = $("#gameBox").offset().left;
            gameOffset.y = $("#gameBox").offset().top;
         });

      },

      animateSprite: function($el, spriteSize, numberOfFrames, refreshRate) {

         // frame id from sprite
         var currentFrame = 0;

         // frameSelector
         var frameSelect = function() {
            if(currentFrame < numberOfFrames) {
               currentFrame++;
            }
            if(currentFrame == numberOfFrames) {
               currentFrame = 0;
            }
         };

         // animate frame function
         var animateSprite = function(){
            frameSelect();
            $el.css("background-position", (-currentFrame)*spriteSize + "px " + (-$el.spriteLine)*spriteSize + "px" );
         };

         // animation function
         var startSpriteAnimation = function() {
            $el.stop();
            animateSprite();
            $el.objectAnimation = setInterval(function() {
               animateSprite();
            }, refreshRate);
         }

         // start animation
         startSpriteAnimation();

         // THESE ARE THE DIRECT EXTERNAL CONTROLS FOR THE SPRITE ANIMATION
         // $el.spriteLine = 0;
         // clearInterval($el.objectAnimation);

      },

      disableSprite: function($el) {

         // clear sprite animation interval
         clearInterval($el.objectAnimation);

      },

      changeSpriteOrientation: function($el, movementOrientation) {

         // transform movementOrientation string to line id from sprite
         switch (movementOrientation) {

            case "up":
            $el.spriteLine = 3;
            break;

            case "down":
            $el.spriteLine = 0;
            break;

            case "left":
            $el.spriteLine = 1;
            break;

            case "right":
            $el.spriteLine = 2;
            break;

            default: return;

         }

      },

      randomSprite: function($el, size, numberOfOptions) {

         // get random option
         var randomOption = Math.floor(Math.random() * (numberOfOptions));

         // set sprite based on random option
         $el.css("background-position", (-randomOption)*size + "px 0" );

      },

      solidCollision: function() {

         // build list of solid objects
         $(".solid").each(function(index) {
            $self = $(this);
            solids[index] = {
               item: $self,
               x: $self.position().left,
               y: $self.position().top,
               height: $self.height(),
               width: $self.width()
            };
         });

         // collision test set as global interval
         window.detectCollision = setInterval(function() {

            // loop through solid objects
            for(var obj1 in solids) {

               // update position and id for current solid
               var currentId = solids[obj1].item.prop('id');
               solids[obj1].x = solids[obj1].item.position().left;
               solids[obj1].y = solids[obj1].item.position().top;

               // loop through rest of solids
               for(var obj2 in solids) {

                  // if not same solids test for collision
                  if(obj1 != obj2) {

                     // Collision conditions
                     var test1 = (solids[obj1].x < solids[obj2].x + solids[obj2].width);
                     var test2 = (solids[obj1].x + solids[obj1].width > solids[obj2].x);
                     var test3 = (solids[obj1].y < solids[obj2].y + solids[obj2].height);
                     var test4 = (solids[obj1].height + solids[obj1].y > solids[obj2].y);

                     // test and update
                     if (test1 && test2 && test3 && test4) {
                        solids[obj1].colliding = true;
                     } else {
                        solids[obj1].colliding = false;
                     }

                  }
               }
            }
         }, 100);

      },

      mainCharControls: function() {

         // keypress handler
         $(document).keydown(function(e) {

            // proceed if listening to keyboard is enabled
            if(listeningToKeyPress && controlsEnabled) {

               // test for arrow keys
               if(e.which == 37 || e.which == 38 || e.which == 39 || e.which == 40) {
                  playerMoving = true;
                  listeningToKeyPress = false;
                  currentKey = e.which;
               }

               switch(e.which) {

                  // left key
                  case 37:
                  moveValue = {left: "-=2px"};
                  movementOrientation = "left";
                  break;

                  // up key
                  case 38:
                  moveValue = {top: "-=2px"};
                  movementOrientation = "up";
                  break;

                  // right key
                  case 39:
                  moveValue = {left: "+=2px"};
                  movementOrientation = "right";
                  break;

                  // down key
                  case 40:
                  moveValue = {top: "+=2px"};
                  movementOrientation = "down";
                  break;

                  // exit for other keys
                  default: return;

               }

               // switch sprite orientation;
               GameModule.changeSpriteOrientation($mainChar, movementOrientation);

            }
         });

         // on arrow keyup stop action
         $(document).keyup(function(e) {

            // test if released key coincides with the first pressed key
            if(currentKey == e.which && controlsEnabled) {
               playerMoving = false;
               $mainChar.clearQueue();
               listeningToKeyPress = true;
            }

         });
      },

      mainCharAnimation: function() {

         // collision vars
         var collided = false;
         var badOrientation;
         var posX;
         var insideBox = true;
         var escaping = false;

         // character control refresh function (listen ==> action)
         var charMovement = setInterval(function() {

            // get player coordinates
            posX = $mainChar.offset().left;
            posY = $mainChar.offset().top;

            // test if player is inside of game borders
            if(posX <= gameOffset.x + 5 || posX >= gameOffset.x - 37 + 800 || posY <= gameOffset.y + 10 || posY >= gameOffset.y - 47 + 450) {
               insideBox = false;
            } else insideBox = true;

            // test if character should be moving
            if(playerMoving && controlsEnabled) {

               // test if mainChar is colliding with another solid
               if(solids[0].colliding || !insideBox && !escaping) {

                  

                  // stop movement and declare collision locally
                  if(!collided) {
                     collided = true;
                     badOrientation = movementOrientation;
                     $mainChar.clearQueue();
                     moveValue = null;
                     $mainChar.css({
                        left: $mainChar.x + "px",
                        top: $mainChar.y + "px"
                     });
                  }

                  // force escape direction on player
                  else if(collided) {

                     // set escape direction conditions
                     var bool1 = (badOrientation == "left" && movementOrientation == "right");
                     var bool2 = (badOrientation == "right" && movementOrientation == "left");
                     var bool3 = (badOrientation == "up" && movementOrientation == "down");
                     var bool4 = (badOrientation == "down" && movementOrientation == "up");

                     // test for escape conditions
                     if(badOrientation != movementOrientation) {

                        // declare escape from collision
                        badOrientation = null;
                        collided = false;
                        escaping = true;
                        setTimeout(function() {
                           escaping = false;
                        }, 1000);

                     }

                     // if not escaping then set current pos to last know right pos
                     else {
                        $mainChar.clearQueue();
                        moveValue = null;
                        $mainChar.css({
                           left: $mainChar.x + "px",
                           top: $mainChar.y + "px"
                        });
                     }

                  }

               }

               // test if sprite animation cycle has started
               if(!mainCharSpriteAnimating) {

                  // start sprite animation cycle
                  GameModule.animateSprite($mainChar, 32, 3, 100);
                  mainCharSpriteAnimating = true;

               }

               // move character in received direction with set options
               $mainChar.animate(moveValue, playerMoveOptions);

            }

            // on keyUp if player is moving stop all its animation cycles
            else if(mainCharSpriteAnimating) {
               $mainChar.stop();
               GameModule.disableSprite($mainChar);
               mainCharSpriteAnimating = false;
            }

         }, 20);

         // if player is not colliding set current pos as a good pos
         setInterval(function() {
            if(!solids[0].colliding && insideBox) {
               $mainChar.x = $mainChar.position().left;
               $mainChar.y = $mainChar.position().y;
            }
         }, 100);

      }
   };
})();

$(document).on("ready", function() {
   GameModule.init();
   GameModule.bindHandlers();
   GameModule.solidCollision();
   GameModule.mainCharControls();
   GameModule.mainCharAnimation();
});
