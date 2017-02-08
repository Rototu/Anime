"use strict";

let c = document.getElementById( "canvas" );
let ctx = c.getContext( "2d" );
ctx.imageSmoothingEnabled = false;
ctx.mozImageSmoothingEnabled = false;

ctx.beginPath();
ctx.rect( 0, 0, 3840, 2160 );
ctx.fillStyle = "black";
ctx.fill();

let randX = () => Math.floor( Math.random() * 3841 );
let randY = () => Math.floor( Math.random() * 2161 );
let randRad = () => Math.floor( Math.random() * 2 ) + 1;

let x, y, r;

for ( let i = 1; i <= 4000; i++ ) {

   // create star
   x = randX();
   y = randY();
   r = randRad();
   let star = ctx.createRadialGradient( x, y, 0, x, y, r );
   star.addColorStop( 0, 'rgba(255,255,255,1)' );
   star.addColorStop( 0.8, 'rgba(255,255,255,0.8)' );
   star.addColorStop( 1, 'rgba(228,0,0,0)' );

   // draw shape
   ctx.fillStyle = star;
   ctx.fillRect( x - r, y - r, 2 * r, 2 * r );

}
