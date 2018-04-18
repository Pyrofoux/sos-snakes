var saidijo = {};
saidijo.cor = {x:40,y:40};
saidijo.vel = {vx:0,vy:0};
saidijo.velMax = {vx:7,vy:7}
saidijo.col = "#FFFFFF";

saidijo.tempo = 20;
saidijo.cor.w = u/2;
saidijo.cor.h = u-u/4;

saidijo.presses = {right:false,left:false};

saidijo.alive = true;
saidijo.godmod = false;

saidijo.start = function()
{
	// shortcut.add("left",function(){saidijo.walk(-1)});
	// shortcut.add("right",function(){saidijo.walk(1)});
	shortcut.add("right",function(){saidijo.press("right")});
	shortcut.add("left",function(){saidijo.press("left")});
	
	shortcut.add("right",function(){saidijo.unpress("right")},{"type":"keyup"});
	shortcut.add("left",function(){saidijo.unpress("left")},{"type":"keyup"});
	
	shortcut.add("up",function(){saidijo.jump(10)});
	
	shortcut.add("R",function(){if(saidijo.alive)saidijo.death("restart")});
	shortcut.add("K",function(){if(saidijo.alive)saidijo.death("restart")});
	shortcut.add("Enter",function(){if(saidijo.alive)saidijo.death("restart")});
	
	shortcut.add("M",function(){audio.mute()});
	saidijo.update();
}

saidijo.teleport = function(newX,newY)
{
	saidijo.cor.x = newX;
	saidijo.cor.y = newY;
	saidijo.vel.vx = 0;
	saidijo.vel.vy = 0;
	saidijo.vel = {vx:0,vy:0};
	saidijo.alive = true;
	saidijo.moved = false;
}

saidijo.press = function(dir)
{
	if(dir == "right")
	{
		saidijo.presses.right = true;
		saidijo.presses.left = false;
	}
	else
	{
		saidijo.presses.right = false;
		saidijo.presses.left = true;
	}
}

saidijo.unpress = function(dir)
{
	if(dir == "right")
	{
		saidijo.presses.right = false;
	}
	else
	{
		saidijo.presses.left = false;
	}
}

saidijo.walk = function(dir)
{
	if(abs(saidijo.vel.vx) < abs(saidijo.velMax.vx))
	{
		saidijo.vel.vx+=dir;
	}
	saidijo.moved = true;
	saidijo.vel.vx+=dir;
}

saidijo.jump = function(strength)
{
	if( saidijo.alive && saidijo.canjump())
	{
		saidijo.moved = true;
		sound.jump.play();
		saidijo.vel.vy-=strength;
	}
}

saidijo.applyGravity = function(g)
{
	if(!saidijo.canjump())
	{
		saidijo.vel.vy+=g;
	}
	else
	{
		saidijo.vel.vy = 0;
	}

}

saidijo.update = function() //c'est là qu'on applique les maj de sa vitesse à se position + gravité + estquil touche le sol etc
{
	if(!saidijo.alive)
	{
		return false;
	}
	if(saidijo.presses.right && saidijo.alive)
	{
		saidijo.walk(1);
	}
	
	if(saidijo.presses.left && saidijo.alive)
	{
		saidijo.walk(-1);
	}
	
	// console.log(saidijo.presses);
	if(saidijo.vel.vx*saidijo.vel.vx>0.5 && saidijo.alive)
	{
		saidijo.addx(saidijo.vel.vx);
	}
	
	if(saidijo.vel.vx>0 && saidijo.alive) //inertie vers la droite
    {    	
     	saidijo.vel.vx = Math.min(saidijo.vel.vx,saidijo.velMax.vx);
     	saidijo.vel.vx -= 1;
    }
    else if(saidijo.vel.vx<0 && saidijo.alive) //inertie vers la gauche
    {
      saidijo.vel.vx = Math.max(saidijo.vel.vx,-saidijo.velMax.vx);
      saidijo.vel.vx += 1;
    }
	
	if(saidijo.alive)saidijo.addy(saidijo.vel.vy);
	
	if(saidijo.alive)saidijo.applyGravity(1);
	
	if(saidijo.cor.y > map.w*u && saidijo.alive)
	{
		saidijo.death("tombe");
	}
	else if(saidijo.colls() && saidijo.alive && levels.id != levels.list.length-1)
	{
		saidijo.death("collision");
	}
	
	
	
	if(saidijo.alive)
	{
		draw.all();
		setTimeout(saidijo.update,saidijo.tempo);
	}
	
	if(saidijo.cor.x > map.w*u && saidijo.alive)
	{
		saidijo.cor.x = (map.w+1)*u;
		saidijo.cor.y = map.h*u/2;
		saidijo.end = true;
		saidijo.ending();
	}
	
}

saidijo.addx = function(val)
{
	var q = abs(val), s = sign(val);
	for(var i=0;i<q;i++)
	{
		var clown = clone(saidijo.cor);
		clown.x+=s;
		if(saidijo.colls(clown))
		{
			return true
		}
		else
		{
			saidijo.cor = clown;
		}
	}
}


saidijo.addy = function(val)
{
	var q = abs(val), s = sign(val);
	for(var i=0;i<q;i++)
	{
		var clown = clone(saidijo.cor);
		clown.y+=s;
		if(saidijo.colls(clown))
		{
			return true
		}
		else
		{
			saidijo.cor = clown;
		}
	}
}

saidijo.colls = function(s)
{
	if(!s)s = saidijo.cor;
	
	if(snake.alive)
	{
		// console.log("queue")
	var t = snake.tail.slice(0, -1);
	for(var i in t)
	{
		if(coll(s,{x:t[i].x*u,y:t[i].y*u,w:u,h:u}))
			{
				return true
			}
	}
		// console.log("tête")
		if(coll(s,{x:snake.vis.x,y:snake.vis.y,w:u,h:u}))
			{
				return true
			}
		
		if(coll(s,{x:snake.head.x*u,y:snake.head.y*u,w:u,h:u}))
			{
				return true
			}
	}
	
	// console.log("fin queue") 
		if(snake.vis2)
		{
			if(coll(s,{x:snake.vis2.x,y:snake.vis2.y,w:u,h:u}))
				{
					if(!snake.alive)
					{
						saidijo.death("touche queue");
					}
					return true
				}
		}
	
	
var leftTile = Math.floor((s.x)/u);
var rightTile = Math.ceil((s.x+s.w)/u)-1;
var topTile = Math.floor((s.y)/u);
var bottomTile = Math.ceil((s.y+s.h)/u)-1;

for (var y = topTile; y <= bottomTile; ++y)
{
    for (var x = leftTile; x <= rightTile; ++x)
    {
			var c = map.get(x,y);

			if(c == 3)
				{
					saidijo.death("lava");
					return true
				}
			else if(c == 4)
				{
					saidijo.win();
					return true
				}
				
			if(c != 0 && !(c == -1 && x >= map.w))return true
		}
	}
	return false
	
}

saidijo.canjump = function()
{
	var clown = clone(saidijo.cor);
		clown.y+=1;
		if(saidijo.colls(clown))
		{
			return true
		}
	return false
}

saidijo.death = function(i)
{
	// alert(i)
	if(saidijo.godmod)return "not today"
	
	// if(levels.id != levels.list.length-1)
	// {
			sound.death.play();
			saidijo.alive = false;
		draw.all();
		if(levels.id != levels.list.length-1)
		{
			snake.dead(1);
		}
		else
		{
			var calc = [snake.head].concat(snake.tail)
			snake.head = {x:26,y:26};
			snake.tail = [];
			snake.vis = {x:snake.head.x*u,y:snake.head.y*u};
			// snake.vis2 = false;
			calc = calc.slice(0, -1);
			for(var i in calc)
			{
				map.set(calc[i].x,calc[i].y,3);
			}
			snake.alive = false;
		}
		draw.black(function()
		{
			levels.read(levels.id);
			draw.all();
			draw.unblack(function(){
				saidijo.update();
				
			});
		});
	// }
	// else
	// {
		// saidijo.alive = false;
		// draw.all();
		// snake.dead(1);
		// draw.black(function()
		// {
			// levels.id = 0;
			// levels.read(levels.id);
			// draw.all();
			// draw.unblack(function(){
				// saidijo.update();
				
			// });
		// });
	// }
	
}

saidijo.win = function()
{
	sound.endLevel.play();
	saidijo.alive = false;
	draw.all();
	snake.dead(1);
	draw.black(function()
	{
		if(levels.list[levels.id+1])
		{
			levels.id = levels.id+1;
		}
		levels.read(levels.id);
		draw.all();
		// saidijo.update();
		draw.unblack(function(){
			saidijo.update();
		});
	});
}

saidijo.ending = function()
{
	setTimeout(function(){
		if(snake.end)
		{
			saidijo.alive = false;
			snake.alive = false;
			snake.end = false;
			snake.alive = false;
			draw.black(function()
			{
				ctx.fillStyle = "white";
				ctx.font = "64px copse";
				draw.midtext("Thanks for playing !",u*10);
				draw.unblack();
			})
			// {
				// levels.id = 0;
				// levels.read(levels.id);
				// draw.all();
				// saidijo.update();
				// draw.unblack(function(){
					// var r = rand(1,4);
			// audio.current = r;
			// songs.fadein("zik"+r);
					// saidijo.update();
				// });
	// });
		}
	},2000);
}

