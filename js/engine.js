function qs(s){return document.getElementById(s)};
function dc(s){return document.createElement(s)};
function rand(a,b){return Math.floor(Math.random()*(b-a+1))+a};
function shuffle(r){for(var a=r.length-1;a>0;a--){var f=Math.floor(Math.random()*(a+1)),n=r[a];r[a]=r[f],r[f]=n}return r};
function clone(a){var b;if(null==a||"object"!=typeof a)return a;if(a instanceof Date)return b=new Date,b.setTime(a.getTime()),b;if(a instanceof Array){b=[];for(var c=0,d=a.length;c<d;c++)b[c]=clone(a[c]);return b}if(a instanceof Object){b={};for(var e in a)a.hasOwnProperty(e)&&(b[e]=clone(a[e]));return b}throw new Error("Unable to copy obj! Its type isn't supported.")}
var abs = Math.abs;


var cvs = qs("cvs"),ctx = cvs.getContext("2d"),hid = qs("hid");
var dirs = [{x:0,y:-1},{x:1,y:0},{x:0,y:1},{x:-1,y:0}];

function init()
{
	audio.init(function()
	{
		draw.init(function()
		{
			qs("load").style.display = "none";
			var r = rand(1,4);
			audio.current = r;
			songs.fadein("zik"+r);
			levels.init();
			snake.start();
			saidijo.start();
		})
	});
}

function coll(box1,box2)
{
   if((box2.x >= box1.x + box1.w)|| (box2.x + box2.w <= box1.x) || (box2.y >= box1.y + box1.h) || (box2.y + box2.h <= box1.y))
          return false; 
   else
          return true;
}

function sign(x) {
    return typeof x === 'number' ? x ? x < 0 ? -1 : 1 : x === x ? 0 : NaN : NaN;
}