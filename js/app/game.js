var GameModule = (function() {

   // global vars
   var controlsEnabled = false;
   var $mainChar = $("#mainChar");
   var playerMoving;
   var $solids = $(".solids");

   // char control vars
   var playerMoveOptions = { queue: true, duration: 1, delay: 0, easing: "linear" },
   moveValue, movementOrientation, currentKey;
   var mainCharSpriteAnimating = false;
   var listeningToKeyPress = true;
   var posX, posY;

   // var map => 2D array
   var myMap = new Int8Array(1152);
   myMap.fill(0);

   return {

      init: function() {

         // enable char controls after page is loaded
         controlsEnabled = true;

         // add functions to help with 2D array
         Int8Array.prototype.get = function(i,j) {
            return this[(i*this.width) + j];
         }
         Int8Array.prototype.set = function(i,j,val) {
            this[(i*this.width) + j] = val;
            return this[(i*this.width) + j];
         }
         Int8Array.prototype.setwidth = function(w) {
            this.width = w;
         }

         // set properties for 2D array
         myMap.setwidth(47);

         // start game
         GameModule.frame1();

      },

      bindHandlers: function() {

         // resize handler
         $(window).on("resize", function() {

         });

         // npc click handler
         $(".npc").click(function() {

            // test if mainChar is near clicked npc
            var dist = GameModule.getDistanceBetweenElements($(this), $mainChar);
            if(dist <= ($(this).width() / 2 + 16)) {

            } else {

            }

         });

      },

      frame1: function() {

         // get npc
         $asuna = $("#asuna");

         // elements pos init
         GameModule.setSolidPos($mainChar, 8, 12, 2);
         GameModule.setSolidPos($asuna, 36, 12, 2);
         GameModule.setSolidPos($("#tree"), 38, 10, 1);
         GameModule.setSolidPos($("#grass"), 0, 17, 1);

         // show elements
         $(".frame1").show();

      },

      getPositionAtCenter: function ($el) {

         // get bounding rectangle data of $el
         var data = $el.get(0).getBoundingClientRect();

         // return center position
         return {
            x: data.left + data.width / 2,
            y: data.top + data.height / 2
         };

      },

      getDistanceBetweenElements: function($el1, $el2) {

         // get center points of elements
         var aPosition = GameModule.getPositionAtCenter($el1);
         var bPosition = GameModule.getPositionAtCenter($el2);

         // return distance between points
         return Math.sqrt(
            Math.pow(aPosition.x - bPosition.x, 2) +
            Math.pow(aPosition.y - bPosition.y, 2)
         );
      },

      animateSprite: function($el, spriteWidth, spriteHeight, numberOfFrames, refreshRate) {

         // frame id for sprite
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
            $el.css("background-position", (-currentFrame)*spriteWidth + "px " + (-$el.spriteLine)*spriteHeight + "px" );
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

      emptySolidPos: function($el) {

         // get pos
         var w = $el.width() / 16;
         var h = $el.height() / 16;
         var x = $el.gamePosX;
         var y = $el.gamePosY;

         // delete pos in 2D array
         for(var i=y; i<y+h; i++) {
            for(var j=x; j<x+w; j++) myMap.set(i,j,0);
         }

      },

      setSolidPos: function($el, x, y, val) {

         // verifiy if in map boundaries
         if(x>=0 && y>=0 && x<48 && y<24) {

            // define pos
            $el.gamePosX = x;
            $el.gamePosY = y;

            // set pos on screen
            $el.css({ left: x*16, top: y*16 });

            // set pos in 2D array
            var w = $el.width() / 16;
            var h = $el.height() / 16;
            for(var i=y; i<y+h; i++) {
               for(var j=x; j<x+w; j++) myMap.set(i,j,val);
            }

         }

      },

      animateCharPos: function($el, x, y, val) {

         // verifiy if in map boundaries
         if(x>=0 && y>=0 && x<48 && y<24) {

            // define pos
            $el.gamePosX = x;
            $el.gamePosY = y;

            // set pos on screen
            var options = {queue: false, duration: 600, delay: 0, easing: "linear", done:function() {
               listeningToKeyPress = true;
               if(!playerMoving) {
                  mainCharSpriteAnimating = false;
                  GameModule.disableSprite($el);
                  $el.clearQueue();
                  $el.stop();
               }
            }};
            $el.animate({ left: x*16, top: y*16 }, options);

            // set pos in 2D array
            var w = $el.width() / 16;
            var h = $el.height() / 16;
            for(var i=y; i<y+h; i++) {
               for(var j=x; j<x+w; j++) myMap.set(i,j,val);
            }

         }

      },

      logArray: function() {

         // convert typed array into 2D string
         var line = "";
         for(var i=0; i<24; i++) {
            for(var j=0; j<48; j++) line += (myMap.get(i,j) + " ");
            line += "\n";
         }

         // log array
         console.log(line);

      },

      testPosition: function($el, x, y) {

         // verifiy if in map boundaries
         if(x>=0 && y>=0 && x<48 && y<24) {

            // test for collision
            var w = $el.width() / 16;
            var h = $el.height() / 16;
            for(var i=y; i<y+h; i++) {
               for(var j=x; j<x+w; j++) {
                  if(myMap.get(i,j) > 0) return myMap.get(i,j);
               }
            }
            return 0;

         } else return -1;

      },

      moveSolid: function($el, x, y) {

         // test if target position empty
         if(GameModule.testPosition($el, x, y) === 0) {
            GameModule.emptySolidPos($el);
            GameModule.animateCharPos($el, x, y, 2);
         } else {
            listeningToKeyPress = true;
            mainCharSpriteAnimating = false;
            GameModule.disableSprite($el);
            $el.clearQueue();
            $el.stop();
         }

      },

      moveCharacter: function(direction) {

         // set var for readability
         var $el = $mainChar;

         // transform movementOrientation string to line id from sprite
         switch (direction) {
            case "up": GameModule.moveSolid($el, $el.gamePosX, $el.gamePosY-2);
            break;

            case "down": GameModule.moveSolid($el, $el.gamePosX, $el.gamePosY+2);
            break;

            case "left": GameModule.moveSolid($el, $el.gamePosX-2, $el.gamePosY);
            break;

            case "right": GameModule.moveSolid($el, $el.gamePosX+2, $el.gamePosY);
            break;

            default: return;
         }

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
                  movementOrientation = "left";
                  break;

                  // up key
                  case 38:
                  movementOrientation = "up";
                  break;

                  // right key
                  case 39:
                  movementOrientation = "right";
                  break;

                  // down key
                  case 40:
                  movementOrientation = "down";
                  break;

                  // exit for other keys
                  default: return;

               }

               // switch sprite orientation and animate;
               GameModule.changeSpriteOrientation($mainChar, movementOrientation);
               if(!mainCharSpriteAnimating) {
                  GameModule.animateSprite($mainChar, 32, 32, 3, 120);
                  mainCharSpriteAnimating = true;
               }
               GameModule.moveCharacter(movementOrientation);

            }
         });

         // on arrow keyup stop action
         $(document).keyup(function(e) {

            // test if released key coincides with the first pressed key
            if(currentKey == e.which && controlsEnabled) {
               playerMoving = false;
            }

         });
      }

   };
})();

$(document).on("ready", function() {
   GameModule.init(); // init game vars
   GameModule.bindHandlers(); // bind game handlers
   GameModule.mainCharControls(); // enable main char movement
});
