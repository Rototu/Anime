var GameModule = (function() {

   var controlsEnabled = false;
   var $mainChar = $("#mainChar");
   var playerMoving;
   var solids = [];

   return {

      init: function() {
         controlsEnabled = true;
      },

      bindHandlers: function() {

      },

      animateSprite: function($el, spriteSize, numberOfFrames, refreshRate) {

         // animation vars
         var currentFrame = 0;

         // animate frame function
         var spriteAnimate = function(){
            if(currentFrame < numberOfFrames) {
               currentFrame++;
            }
            if(currentFrame == numberOfFrames) {
               currentFrame = 0;
            }
            $el.css("background-position", (-currentFrame)*spriteSize + "px " + (-$el.spriteLine)*spriteSize + "px" );
         };

         // start animation
         $el.stop();
         spriteAnimate();
         $el.objectAnimation = setInterval(function() {
            spriteAnimate();
         }, refreshRate);

         // THESE ARE THE DIRECT EXTERNAL CONTROLS FOR THE SPRITE ANIMATION
         // $el.spriteLine = 0;
         // clearInterval($el.objectAnimation);

      },

      disableSprite: function($el) {
         clearInterval($el.objectAnimation);
      },

      changeSpriteOrientation: function($el, orientation) {

         switch (orientation) {

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

      randomSprite: function($el, size, optionNumber) {

         // get random option
         var randomOption = Math.floor(Math.random() * (optionNumber));

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

         console.log(solids);

         // periodical collision test
         window.detectCollision = setInterval(function() {

            // loop through solid objects
            for(var obj1 in solids) {

               // update position and vars
               solids[obj1].x = solids[obj1].item.position().left;
               solids[obj1].y = solids[obj1].item.position().top;
               var currentId = solids[obj1].item.prop('id');

               //test collision
               for(var obj2 in solids) {
                  if(obj1 != obj2) {

                     // Collision conditions
                     var bool1 = (solids[obj1].x < solids[obj2].x + solids[obj2].width);
                     var bool2 = (solids[obj1].x + solids[obj1].width > solids[obj2].x);
                     var bool3 = (solids[obj1].y < solids[obj2].y + solids[obj2].height);
                     var bool4 = (solids[obj1].height + solids[obj1].y > solids[obj2].y);

                     // verify conditions
                     if (bool1 && bool2 && bool3 && bool4) {
                        solids[obj1].colliding = true;
                     }
                     else solids[obj1].colliding = false;

                  }
               }
            }
         }, 100);

      },

      mainCharControls: function() {

         // char control vars
         var moveOptions = { queue: true, duration: 1, delay: 0, easing: "linear" };
         var moveDirection;
         var orientation;
         var moveStarted = false;
         var listeningToKeyPress = true;

         // key control
         if(listeningToKeyPress) {

            $(document).keydown(function(e) {

               if(e.which == 37 || e.which == 38 || e.which == 39 || e.which == 40) {
                  playerMoving = true;
                  listeningToKeyPress = false;
               }

               switch(e.which) {

                  // left key
                  case 37:
                  moveDirection = {left: "-=2px"};
                  orientation = "left";
                  break;

                  // up key
                  case 38:
                  moveDirection = {top: "-=2px"};
                  orientation = "up";
                  break;

                  // right key
                  case 39:
                  moveDirection = {left: "+=2px"};
                  orientation = "right";
                  break;

                  // down key
                  case 40:
                  moveDirection = {top: "+=2px"};
                  orientation = "down";
                  break;

                  // exit for other keys
                  default: return;

               }

            });

         }


         // if keyup stop action
         $(document).keyup(function(e) {
            if(e.which == 37 || e.which == 38 || e.which == 39 || e.which == 40) {
               playerMoving = false;
               $mainChar.clearQueue();
               listeningToKeyPress = true;
            }
         });

         var collided = false;
         var badOrientation;

         // character control refresh function (listen ==> action)
         var charMovement = setInterval(function() {

            if(playerMoving && controlsEnabled) {
               if(solids[0].colliding) {

                  if(!collided) {
                     collided = true;
                     badOrientation = orientation;
                     $mainChar.clearQueue();
                     moveDirection = null;
                     $mainChar.css({
                        left: $mainChar.x + "px",
                        top: $mainChar.y + "px"
                     });
                  }

                  else if(collided) {

                     var bool1 = (badOrientation == "left" && orientation == "right");
                     var bool2 = (orientation == "left" && badOrientation == "right");
                     var bool3 = (badOrientation == "up" && orientation == "down");
                     var bool4 = (orientation == "up" && badOrientation == "down");

                     if(bool1 || bool2 || bool3 || bool4) {
                        setTimeout(function() {
                           badOrientation = null;
                           collided = false;
                        }, 200);
                     }
                     else {
                        $mainChar.clearQueue();
                        moveDirection = null;
                        $mainChar.css({
                           left: $mainChar.x + "px",
                           top: $mainChar.y + "px"
                        });
                     }
                  }

               }

               if(!solids[0].colliding) {
                  $mainChar.x = $mainChar.position().left;
                  $mainChar.y = $mainChar.position().y;
               }

               if(!moveStarted) {
                  GameModule.changeSpriteOrientation($mainChar, orientation);
                  GameModule.animateSprite($mainChar, 32, 3, 200);
                  moveStarted = true;
               }
               $mainChar.animate(moveDirection, moveOptions);
            }
            else {
               if(moveStarted) {
                  $mainChar.stop();
                  GameModule.disableSprite($mainChar);
                  moveStarted = false;
               }
            }
         }, 20);

      }

   };
})();

$(document).on("ready", function() {
   GameModule.init();
   GameModule.bindHandlers();
   GameModule.mainCharControls();
   GameModule.solidCollision();
});
