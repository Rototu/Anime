var GameModule = (function() {

   // global vars
   var controlsEnabled = false;
   var $mainChar = $("#mainChar");
   var playerMoving;
   var solids = [];
   var nearbySolids = [];
   var gameOffset = {};

   // char control vars
   var playerMoveOptions = { queue: true, duration: 1, delay: 0, easing: "linear" },
   moveValue, movementOrientation, currentKey;
   var mainCharSpriteAnimating = false;
   var listeningToKeyPress = true;
   var posX, posY;

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

         var dist, currentItem, diagDist, distL, distR, distT, distB;

         // build list of solid objects
         $(".solid").each(function(index) {
            $self = $(this);
            solids[index] = {
               obj: $self,
               x: $self.offset().left + $self.width() / 2,
               y: $self.offset().top + $self.height() / 2,
               height: $self.height(),
               width: $self.width()
            };
         });

         // start collision test cycle
         detectCollision = setInterval(function() {

            // get player coordinates
            posX = $mainChar.offset().left + 16;
            posY = $mainChar.offset().top + 16;

            // loop through solid objects
            for(index in solids) {

               // test if obj is not mainChar
               if(index != 0) {

                  // get distances beetween player and current object
                  currentItem = solids[index];
                  diagDist = Math.sqrt((currentItem.width*currentItem.width/4)+(currentItem.height*currentItem.height/4));
                  dist = Math.sqrt((posX - currentItem.x)*(posX - currentItem.x) + (posY - currentItem.y)*(posY - currentItem.y));
                  distR = currentItem.x - posX - 16 - currentItem.width / 2;
                  distL = posX - currentItem.x - 16 - currentItem.width / 2;
                  distB = currentItem.y - posY - 16 - currentItem.height / 2;
                  distT = posY - currentItem.y - 16 - currentItem.height / 2;

                  // test to see if they are in danger of collision
                  if((dist - diagDist - 23 < 20) && ((distR < 20 && distR > 0) || (distL < 20 && distL > 0) || (distT < 20 && distT > 0) || (distB < 20 && distB > 0))) {
                     // if current obj is not in nearbySolids array, push it in
                     if($.inArray(index, nearbySolids) < 0)
                     nearbySolids.push(index)
                  }
                  // if element is not in proximity of the player and is in the nearbySolids array, remove it
                  else if($.inArray(index, nearbySolids) >= 0) {
                     var val = $.inArray(index, nearbySolids);
                     nearbySolids.splice(val, 1);
                  }
               }
            }

         }, 20);

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

      testForObjectCollision: function(obj1, obj2, myDirection, val) {

         // declare vars
         var x = obj1.x - obj1.width / 2, y = obj1.y - obj1.height / 2;
         var a = obj2.x - obj2.width / 2, b = obj2.y - obj2.height / 2;

         // set next step
         switch(myDirection) {
            case "up": y -= val; break;
            case "left": x -= val; break;
            case "down": y += val; break;
            case "right": x += val; break;
            default: return;
         }

         // test next step
         if (x < a + obj2.width && x + obj1.width > a && y < b + obj2.height && obj1.height + y > b) {
            return false;
         } else {
            return true;
         }

      },

      mainCharAnimation: function() {

         var movementPossible = true;

         setInterval(function() {

            // test if in danger of collision
            if(nearbySolids.length > 0) {

               // loop through nearby objects
               for(index in nearbySolids) {

                  // declare local vars
                  var self = solids[nearbySolids[index]];
                  var myChar = {
                     x: posX,
                     y: posY,
                     width: solids[0].width,
                     height: solids[0].height
                  };

                  // test to see if next step is possible
                  movementPossible = GameModule.testForObjectCollision(myChar, self, movementOrientation, 10);

               }
            }

         }, 10);

         // character control refresh function (listen ==> action)
         var charMovement = setInterval(function() {

            // test if character should be moving
            if(playerMoving && controlsEnabled) {

               // test if sprite animation cycle has started
               if(!mainCharSpriteAnimating) {

                  // start sprite animation cycle
                  GameModule.animateSprite($mainChar, 32, 3, 100);
                  mainCharSpriteAnimating = true;

               }

               // move character in received direction with set options
               if(movementPossible || nearbySolids.length == 0) $mainChar.animate(moveValue, playerMoveOptions);

            }

            // on keyUp if player is moving stop all its animation cycles
            else if(mainCharSpriteAnimating) {
               $mainChar.stop();
               GameModule.disableSprite($mainChar);
               mainCharSpriteAnimating = false;
            }

         }, 20);

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
