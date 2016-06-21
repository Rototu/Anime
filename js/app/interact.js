var InteractiveModule = (function () {
   return {
      init: function () {
         this.$name = $("#name");
         this.$gameElement = $(".gameElement");
         this.$nameSubmit = $("#nameSubmit");
         this.started = false;
      },

      bindHandlers: function () {

         if(!this.started) InteractiveModule.frame1();

         //validate name by its length on change
         this.$name.on('input', function () {
            var nameLength = this.$name.val().length;
            if(nameLength > 1) {
               this.$nameSubmit.show();
            }
            else {
               this.$nameSubmit.hide();
            }
         }.bind(this));

         //handle name submit
         this.$nameSubmit.click(function () {
            $("#frame1Form").submit();
         });
         $("#frame1Form").submit(function (e) {

            //prevent reload
            e.preventDefault();

            //store name
            this.name =  this.$name.val();
            console.log(this.name);
            $(".myCharName").text(this.name);

            //change to scene 2
            InteractiveModule.frame2();

         }.bind(this));

         //handle char select
         $(".gameChar").click(function () {
            $(".gameChar").hide();
            $("#"+this.id).show().css("opacity", 1);
            switch (this.id) {
               case "char1":
               InteractiveModule.characterSelect().shizuo(this);
               break;

               case "char2":
               InteractiveModule.characterSelect().levi(this);
               break;

               case "char3":
               InteractiveModule.characterSelect().madoka(this);
               break;

               case "char4":
               InteractiveModule.characterSelect().yandere(this);
               break;

               default: return;
            }
         });

      },

      //characterSelected
      characterSelect: function() {
         return {

            //shizuo select
            shizuo: function (myChar) {

               //set choice
               var $izaya = $("#char4");
               var $myText =  $("#frame2One");
               myChar.src = "img/game/shizuocalmright.gif";
               $myText.text("L-ai ales pe Shizuo...");

               //start animation
               $izaya.prop("src", "img/game/izayarun.gif").css("opacity", 1).css("left", "1000px").delay(500).show(function () {
                  move("#char4").ease("linear").translate(-650).duration(3000).end().then(function () {
                     $izaya.prop("src", "img/game/izaya.gif");
                     $myText.text("Izaya a venit să îşi bată joc de tine!");
                  });
               });

               //complex animation
               setTimeout(function () {
                  setTimeout(function () {
                     $izaya.prop("src", "img/game/izayarunright.gif");
                     move("#char4").ease("linear").translate(650).duration(3000).end();
                     setTimeout(function () {
                        //animation end
                        $myText.text("PRINDE-L!!!");
                        myChar.src = "img/game/shizuo.gif";
                        //moving on to next frame
                        move("#char1").ease("linear").translate(1000).duration(1500).end().then(InteractiveModule.frame3().shizuo());
                     }, 1000)
                  }, 500);
               },  5000);

            },

            //madoka select
            madoka: function (myChar) {

               //set choice
               myChar.src = "img/game/madokawalking.gif";
               var $myText =  $("#frame2One");
               $myText.text("Ai ales-o pe Madoka Kaname :D");

               //start animation
               move("#char3").translate(200).duration(2000).end();
               setTimeout(function () {
                  $("#swirl").delay(1000).fadeIn(3000, function () {
                     myChar.src = "img/game/madokawind.gif";
                  });
                  $myText.text("Ahmmm, ce se întâmplă?");
                  $("#frame2").css("background-color", "black").delay(5000).fadeOut(3000, function () {
                     //next frame
                     InteractiveModule.frame3().madoka();
                  });
               }, 2500);

            },

            //levi select
            levi: function (myChar) {

               //set choice
               myChar.src = "img/game/leviidle.gif";
               var $myText =  $("#frame2One");
               $myText.text("L-ai ales pe Levi, obsedatul de curățenie!");

               //start animation
               setTimeout(function () {
                  $("#char2").css("right", "300px");
                  myChar.src = "img/game/levinervous.gif";
                  move("#char2").ease("linear").translate(-1000).duration(5000).end();
                  $myText.text("Habar nu ai în ce te-ai băgat...");
                  setTimeout(function () {
                     InteractiveModule.frame3().levi();
                  }, 5000);
               }, 2500);

            },

            //yandere select
            yandere: function (myChar) {

               //set choice
               myChar.src = "img/game/yuno.gif";
               var $myText =  $("#frame2One");
               $myText.text("Ai ales-o pe Ynnej Ocin!");
               move("#char4").set("left", "400px").duration("1.5s").end();

               //start animation
               setTimeout(function () {
                  $myText.text("Ei îi place să manipuleze oamenii...");
                  setTimeout(function () {
                     InteractiveModule.frame3().yandere();
                  }, 3000);
               }, 3000);

            }

         };
      },

      frame1: function () {

         //set initial values
         this.$gameElement.hide();
         this.$name.val("");
         this.name = null;
         this.started = true;

         //animation frame1
         $("#frame1").show(0, function () {
            $("#korosensei").delay(500).show("slide", {direction : "left"}, 1000, function () {
               $("#frame1One").delay(1000).fadeIn(1000, function () {
                  $("#frame1Two").delay(1000).fadeIn(1000, function () {
                     $("#frame1Form").delay(500).fadeIn(3000);
                  });
               });
            });
         });

      },

      frame2: function () {

         //animation frame 2
         $("#frame1").hide("slide", {direction:"left"});
         $("#frame2").show("slide", {direction:"right"}, function () {
            $("#charChoice").delay(2000).fadeIn(5000);
            $("#frame2One").delay(1000).fadeIn(3000);
         });

      },

      frame3: function () {
         return {
            shizuo: function () {

               //randomCoinPos generator function
               var randomCoinPos = function () {
                  return {
                     x: Math.round(Math.random() * (861)) + 70,
                     y: Math.round(Math.random() * (361)) + 70
                  };
               };

               //multiply element function
               $.fn.duplicate = function(count, cloneEvents) {
                  var tmp = [];
                  for ( var i = 0; i < count; i++ ) {
                     $.merge( tmp, this.clone( cloneEvents ).get() );
                  }
                  return this.pushStack( tmp );
               };

               //multiply element
               $('.coin').duplicate(19).appendTo('#frame3Shizuo');

               //set coin random position
               $(".coin").each(function () {
                  $(this).css("left", randomCoinPos().x);
                  $(this).css("top", randomCoinPos().y);
               });

               //random pos for IzayaChar
               var randomIzayaPos = function () {
                  return {
                     x: Math.round(Math.random() * (761)) + 70,
                     y: Math.round(Math.random() * (261)) + 70
                  };
               };


               //animation
               setTimeout(function () {
                  //animation frame 3
                  $("#frame2").hide("slide", {direction:"left"});
                  $("#frame3Shizuo").show("slide", {direction:"right"}, function () {
                     $("#shizuoClick").fadeIn(1000);
                     setTimeout(function () {

                        //start game
                        $("#shizuoClick").fadeOut(1000);
                        $(".coin").delay(1000).fadeIn(1500);
                        $("#shizuo").delay(1000).fadeIn(3000);
                        $("#runningIzaya").delay(1000).fadeIn(3000);

                        //game mechanics init
                        setTimeout(function () {

                           //move Shizuo onClick
                           $("#frame3Shizuo").click(function (e) {

                              //calculate mouse pos relative to frame
                              var parentOffset = $(this).parent().offset();
                              var x = e.pageX - parentOffset.left - 70;
                              var y = e.pageY - parentOffset.top - 145;

                              //calculate char pos relative to frame
                              var shizuoPos = $("#shizuo").position();
                              var xS = shizuoPos.left;
                              var yS = shizuoPos.top;

                              //calculate duration for animation (charSpeed=300px/sec)
                              var runTime = Math.sqrt((xS-x)*(xS-x)+(yS-y)*(yS-y)) / 300;

                              //change animation orientation based on running direction
                              if(x>xS) {
                                 $("#shizuoImg").prop("src", "img/game/shizuo.gif");
                                 x += 35;
                              }
                              if(x<xS) {
                                 $("#shizuoImg").prop("src", "img/game/shizuoleft.gif");
                                 x += 35;
                              }

                              //move char to clicked pos then reset animation
                              move("#shizuo").ease("linear").set("left", x+"px").set("top", y+"px").duration(runTime+"s").end().then(function() {
                                 $("#shizuoImg").prop("src", "img/game/shizuocalmright.gif");
                              });

                           });

                           //coin counter
                           var coins = 0;
                           var coinCounter = setInterval(function () {
                              $(".coin").each(function () {

                                 //get position values
                                 var coinPos = $(this).offset();
                                 var charPos = $("#shizuoImg").offset();
                                 var charWidth = $("#shizuoImg").width();

                                 //detect collision
                                 var collision = (charPos.left < coinPos.left + 20 && charPos.left + charWidth > coinPos.left && charPos.top < coinPos.top + 20 && charPos.top + 120 > coinPos.top);
                                 if(collision) {
                                    coins++;
                                    $("#coinScore").text(coins);
                                    $(this).remove();
                                 }

                                 //if all coins collected stop counter and progress through game
                                 if(coins == 20) {
                                    clearInterval(coinCounter);
                                 }

                              });
                           },100);

                           //IzayaMove
                           var runningIzayaMove =  function () {

                              //get random pos
                              var newPos = randomIzayaPos();
                              var x = newPos.x;
                              var y = newPos.y;

                              //calculate char pos relative to frame
                              var izayaPos = $("#runningIzaya").position();
                              var xS = izayaPos.left;
                              var yS = izayaPos.top;

                              //little debug
                              move("#runningIzaya").ease("linear").set("left", xS+"px").set("top", yS+"px").duration(0).end().then(function() {
                                 $("#runningIzaya").prop("src", "img/game/izaya.gif");
                              });

                              //calculate duration for animation (charSpeed=600px/sec)
                              var runTime = Math.sqrt((xS-x)*(xS-x)+(yS-y)*(yS-y)) / 600;

                              //change animation orientation based on running direction
                              if(x>xS) {
                                 $("#runningIzaya").prop("src", "img/game/izayarunright.gif");
                                 x += 35;
                              }
                              if(x<xS) {
                                 $("#runningIzaya").prop("src", "img/game/izayarun.gif");
                                 x += 35;
                              }

                              console.log(x+" "+y+" "+runTime);

                              //move char to new pos then reset animation
                              move("#runningIzaya").ease("linear").set("left", x+"px").set("top", y+"px").duration(runTime+"s").end().then(function() {
                                 $("#runningIzaya").prop("src", "img/game/izaya.gif");
                              });

                           };

                           var IzayaIntervalMove =  setInterval(function () {
                              runningIzayaMove();
                           }, 3000);

                           //detect collision Izaya and Shizuo
                           var IzayaCollision = setInterval(function () {

                              //get position values
                              var isaPos = $("#runningIzaya").offset();
                              var charPos = $("#shizuoImg").offset();
                              var isaWidth = $("#runningIzaya").width();
                              var isaHeight = $("#runningIzaya").height();
                              var charWidth = $("#shizuoImg").width();

                              //detect collision
                              var collision = (charPos.left < isaPos.left + isaWidth && charPos.left + charWidth > isaPos.left && charPos.top < isaPos.top + isaHeight && charPos.top + 120 > isaPos.top);
                              if(collision) {
                                 runningIzayaMove();
                              }

                              //if all coins collected stop counter and progress through game
                              if(coins == 20) {
                                 clearInterval(IzayaIntervalMove);
                                 if(collision) {
                                    InteractiveModule.frame4().shizuo();
                                    clearInterval(IzayaCollision);
                                 }
                              }

                           },100);

                        }, 3000);
                     });

                  }, 6000);

               }, 2000);

            },

            madoka: function () {

               //set div vars
               $madoka = $("#madoka");
               $makise = $("#scientist");
               $madokaTxt = $("#madokaTxt");
               $makiseTxt = $("#makiseTxt");

               //set quiz img list
               var imgList = [
                  {
                     name: "Attack on Titan",
                     src: "img/game/quiz/attackontitan.jpg"
                  },
                  {
                     name: "Neon Genesis Evangelion",
                     src: "img/game/quiz/eva.gif"
                  },
                  {
                     name: "Fairy Tail",
                     src: "img/game/quiz/fairytail.jpg"
                  },
                  {
                     name: "Fullmetal Alchemist Brotherhood",
                     src: "img/game/quiz/fullmetal.gif"
                  },
                  {
                     name: "Monster",
                     src: "img/game/quiz/monster.jpg"
                  },
                  {
                     name: "Naruto",
                     src: "img/game/quiz/naruto.gif"
                  },
                  {
                     name: "One Punch Man",
                     src: "img/game/quiz/op.gif"
                  },
                  {
                     name: "Owari no Seraph",
                     src: "img/game/quiz/owarinoseraph.jpg"
                  },
                  {
                     name: "Paprika",
                     src: "img/game/quiz/paprika.gif"
                  },
                  {
                     name: "Perfect Blue",
                     src: "img/game/quiz/perfectblue.jpg"
                  },
                  {
                     name: "High School DxD",
                     src: "img/game/quiz/rias.gif"
                  },
                  {
                     name: "Regele Shaman",
                     src: "img/game/quiz/regeleshaman.gif"
                  },
                  {
                     name: "JoJo's Bizzare Adventure",
                     src: "img/game/quiz/jojo.gif"
                  },
                  {
                     name: "Texhnolyze",
                     src: "img/game/quiz/texhnolyze.jpg"
                  },
                  {
                     name: "Serial Experiments Lain",
                     src: "img/game/quiz/lain.jpg"
                  },
                  {
                     name: "Baccano",
                     src: "img/game/quiz/baccano.gif"
                  },
                  {
                     name: "Durarara!",
                     src: "img/game/quiz/durarara.jpg"
                  },
                  {
                     name: "Cowboy Bebop",
                     src: "img/game/quiz/bebop.gif"
                  },
                  {
                     name: "Code Geass",
                     src: "img/game/quiz/geass.jpg"
                  },
                  {
                     name: "Akira",
                     src: "img/game/quiz/akira.gif"
                  },
                  {
                     name: "Steins;Gate",
                     src: "img/game/quiz/steinsgate.gif"
                  },
                  {
                     name: "Your Lie in April",
                     src: "img/game/quiz/shigatsu.png"
                  }
               ];

               //start animation
               $("#frame3Madoka").fadeIn(3000, function () {
                  move("#madoka").set("top", "300px").duration('4s').end().then(function () {
                     $madoka.prop("src", "img/game/madokaidle.gif");
                     move("#scientist").translate(-200).duration('3s').end().then(function () {

                        //get char Pos
                        var madoPos = $madoka.position().left + 140;
                        var makiPos = $makise.position().left - 255;

                        //set text Pos
                        $madokaTxt.css("left", madoPos+"px").hide();
                        $makiseTxt.css("left", makiPos+"px").hide();

                        //randomImg
                        var randomImg = function () {
                           return {
                              myEl: Math.floor(Math.random() * (22)),
                              myId: Math.floor(Math.random() * (4)) + 1
                           };
                        };

                        //continue with animation
                        setTimeout(function () {
                           $madokaTxt.text("Ce s-a întâmplat? Unde am ajuns?").fadeIn();
                           setTimeout(function () {
                              $makiseTxt.text("Ai ajuns în multiversul anime-urilor...").fadeIn();
                              setTimeout(function () {
                                 $makiseTxt.text("Ca să scapi de aici, potrivește universurile anime cu denumirea lor!");
                                 setTimeout(function () {
                                    $madokaTxt.text("Fie, sunt pregătită.");
                                    setTimeout(function () {
                                       $makiseTxt.text("Să începem atunci!");
                                       setTimeout(function () {

                                          //start quiz
                                          $("#animeQuiz").fadeIn();
                                          var questionSet = 1;

                                          //generate quiz set
                                          var genQuiz = function () {

                                             //random quiz element
                                             $(".quizQuestion").css("border-color", "black");
                                             var x = randomImg().myEl;
                                             // var r = Math.floor(4*((x/4) - Math.floor(x/4))) + 1;
                                             var r = randomImg().myId;
                                             var answer = "q" + r;
                                             $("#q" + r).prop("src", imgList[x].src);

                                             //txt set
                                             $madokaTxt.text("Hmmm...");
                                             $makiseTxt.text(imgList[x].name);

                                             //fill in rest on quiz elements
                                             var i = 1;
                                             while(i<4) {
                                                if(x == 21) x = -1;
                                                if(r == 4) r = 0;
                                                r++;
                                                x++;
                                                i++;
                                                $("#q" + r).prop("src", imgList[x].src);
                                             }

                                             //answer check
                                             $(".quizQuestion").click(function () {

                                                //if answer right
                                                if(this.id == answer) {

                                                   //mark correct answer
                                                   $(this).css("border-color", "green");

                                                   //end after 5 questions
                                                   if(questionSet == 6) {
                                                      genQuiz = null;
                                                      $("#animeQuiz").fadeOut(1000);
                                                      $makiseTxt.text("Adio! ;-) ");
                                                      setTimeout(function () {
                                                         InteractiveModule.frame4().madoka();
                                                      }, 3000);
                                                   }

                                                   //continue to next question
                                                   if(questionSet < 6) {
                                                      questionSet++;
                                                      setTimeout(function () {
                                                         genQuiz();
                                                      }, 1000);
                                                   }

                                                }

                                                //if answer wrong
                                                else {
                                                   $(this).css("border-color", "red");
                                                }

                                             });

                                          };

                                          genQuiz();

                                       }, 3000);
                                    }, 3000);
                                 }, 3000);
                              }, 3000)
                           }, 3000);;
                        }, 500);

                     });
                  });
               });
            },

            levi: function () {

               //set initial vars
               var $dancingLevi = $("#levi");
               var progressBar = 0;
               time = 2500;

               //animation start
               $("#frame2").hide("slide", {direction:"right"});
               $("#frame3Levi").show("slide", {direction:"left"});
               setTimeout(function () {
                  move("#levi").ease("linear").set("left", "400px").duration("3s").end();
                  setTimeout(function () {
                     $("#spotlight").fadeIn(3000);
                     move("#levi").ease("linear").set("left", "550px").duration("0s").end();
                     $dancingLevi.prop("src", "img/game/leviidle.gif");
                     setTimeout(function () {

                        //start dancing
                        $dancingLevi.prop("src", "img/game/thisislevi.gif");
                        setTimeout(function () {

                           //game init
                           var danceOn = false;
                           var myArrow = null;
                           $("#leviGame").fadeIn(2000);

                           //select random arrow
                           var randomArrow = function () {
                              var arr = Math.floor(Math.random() * (4)) + 1;
                              switch (arr) {
                                 case 1: return "#leftArrow";
                                 break;

                                 case 2: return "#upArrow";
                                 break;

                                 case 3: return "#downArrow";
                                 break;

                                 case 4: return "#rightArrow";
                                 break;
                                 default:
                                 return null;
                              }
                           };

                           //make arrow fall
                           var arrowFall = function () {

                              //enable listening
                              danceOn = true;

                              //get random arrow
                              myArrow = randomArrow();

                              //reset arrow
                              move(myArrow).set("top", "-110px").duration(0).end();

                              //animate selected arrow
                              move(myArrow).ease("linear").set("top", "1000px").duration(time+500).end();

                           };

                           //update progressBar
                           var progressBarUpdate = function () {
                              move("#danceProgress").ease("linear").set("width", progressBar+"%").duration("0.5s").end();
                           };

                           //test arrow position
                           var arrowCol = function () {

                              //get postion
                              var arrowPos = $(myArrow).position().top;

                              //if arrow is in container
                              console.log(arrowPos);
                              if(arrowPos >= 365 && arrowPos <= 395) {

                                 //increase speed
                                 time -= 150;

                                 //verify progress
                                 if(progressBar < 100) progressBar += 10;
                                 if(progressBar == 100) {
                                    clearInterval(myTimer);
                                    InteractiveModule.frame4().levi();
                                 }

                                 //update progress
                                 progressBarUpdate();

                              }

                           };



                           //keypress listener
                           $(document).keydown(function (e) {

                              //if listening enabled
                              if(danceOn) {

                                 //disable keypress until next arrowFall
                                 danceOn = false;

                                 //verify if pressed key is falling arrow
                                 switch(e.which) {

                                    //left key
                                    case 37:
                                    if(myArrow == "#leftArrow") arrowCol();
                                    break;

                                    //up key
                                    case 38:
                                    if(myArrow == "#upArrow") arrowCol();
                                    break;

                                    //left key
                                    case 39:
                                    if(myArrow == "#rightArrow") arrowCol();
                                    break;

                                    //down key
                                    case 40:
                                    if(myArrow == "#downArrow") arrowCol();
                                    break;

                                    // exit for other keys
                                    default: return;

                                 }

                              }
                           });

                           //the timer
                           var myTimer = setInterval(function () {
                              arrowFall();
                           }, time);

                        }, 2000);
                     }, 1500);
                  }, 3500)
               }, 500);

            },

            yandere: function () {

               //init vars
               var $myAnimeChar = null;
               var myCharSel;
               var animeBg;
               var animeTxt;
               var charSrc = null;
               var bgSrc = null;
               var myImg;

               //scene init
               $("#frame2").fadeOut(300);
               $("#frame3Yandere").fadeIn(1000);
               $("#selectedCharName").text("---");
               var animeOptions = {
                  stack: ".draggableChar",
                  containment: "#animeContainer",
                  scroll: false,
                  snap: ".draggableChar"
               };
               $(".draggableChar").unbind('dragstart').draggable(animeOptions);

               //char on click is selected
               $(".draggableChar").click(function () {
                  $myAnimeChar = $(this);
                  $("#selectedCharName").text(this.id);
                  myImg = this;
               });

               //form handling
               $("#animeController").submit(function (e) {

                  //prevent reload
                  e.preventDefault();

                  //submitted vars
                  myCharSel = $("#charSelect").val();
                  animeBg = $("#bgSelect").val();
                  animeTxt = $("#replica").val();

                  //handle submitted vars
                  if($myAnimeChar) {
                     charChange();
                     bgChange();
                     var ratio = myImg.naturalWidth / myImg.naturalHeight;
                     $myAnimeChar.css("height", animeTxt+"px").css("width", animeTxt*ratio+"px");
                  }

               });

               //char change
               var charChange = function () {

                  //set src
                  switch (myCharSel) {

                     case "makise": charSrc = "img/game/scientist.gif";
                     break;

                     case "shinji": charSrc = "img/game/shinji.gif";
                     break;

                     case "izaya": charSrc = "img/game/izaya.gif";
                     break;

                     case "mikasa": charSrc = "img/game/neko.gif";
                     break;

                     case "unit01": charSrc = "img/game/unit01.gif";
                     break;

                     case "shizuo": charSrc = "img/game/shizuocalmright.gif";
                     break;

                     case "levi": charSrc = "img/game/leviidle.gif";
                     break;

                     default: return;

                  }

                  //change selected char to set src
                  $myAnimeChar.prop("src", charSrc);

               };

               //bg change
               var bgChange = function () {

                  //set src
                  switch (animeBg) {

                     case "street": bgSrc = "img/game/durarara.jpg";
                     break;

                     case "sky": bgSrc = "img/game/cer.jpg";
                     break;

                     case "space": bgSrc = "img/game/bebop.jpg";
                     break;

                     default: return;

                  }

                  //change bg to set src
                  move("#frame3Yandere").set("background-image", 'url("' +bgSrc+'")').duration("1s").end();

               };


            }

         };
      },

      frame4: function () {
         return {

            shizuo: function () {
               $("#frame3Shizuo").hide("slide", {direction:"left"});
               $("#shizuoEnd").show(0).delay(8000).fadeOut();
               $("#shizuoEndTitle").delay(9000).fadeIn(3000);
               $("#frame4Shizuo").show("slide", {direction:"right"}, "slow");
            },

            madoka: function () {
               $("#frame3Madoka").fadeOut(500);
               setTimeout(function () {
                  $("#frame4Madoka").fadeIn(3000);
                  setTimeout(function () {
                     move("#madokaEnd").ease("linear").translate(2000).duration('10s').end();
                  }, 3500)
               }, 1500);
            },

            levi: function () {
               $("#frame3Levi").fadeOut(500);
               setTimeout(function () {
                  $("#frame4Levi").fadeIn(1000);
                  setTimeout(function () {
                     $("#leviEndTitle").fadeIn(3000);
                     $("#leviEnd").fadeIn(3000);
                  }, 1500)
               }, 1000);
            }

         };
      }
   };
})();

$(document).on("ready", function () {
   InteractiveModule.init();
   InteractiveModule.bindHandlers();
});
