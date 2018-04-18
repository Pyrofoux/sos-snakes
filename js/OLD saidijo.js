var saidijo = {};
saidijo.cor = {x:40,y:40};
saidijo.vel = {vx:0,vy:0};
saidijo.velMax = {vx:7,vy:7}
saidijo.touchesGround = false;
saidijo.col = "white";

saidijo.tempo = 20;
saidijo.cor.w = u/2;
saidijo.cor.h = u-u/4;

saidijo.presses = {right:false,left:false};

saidijo.start = function()
{
	// shortcut.add("left",function(){saidijo.walk(-1)});
	// shortcut.add("right",function(){saidijo.walk(1)});
	shortcut.add("right",function(){saidijo.press("right")});
	shortcut.add("left",function(){saidijo.press("left")});
	
	shortcut.add("right",function(){saidijo.unpress("right")},{"type":"keyup"});
	shortcut.add("left",function(){saidijo.unpress("left")},{"type":"keyup"});
	
	shortcut.add("up",function(){saidijo.jump(10)});
	saidijo.update();
}

saidijo.teleport = function(newX,newY)
{
	saidijo.cor.x = newX;
	saidijo.cor.y = newY;
	saidijo.vel.vx = 0;
	saidijo.vel.vy = 0;
	saidijo.touchesGround = false;
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
	saidijo.vel.vx+=dir;
}

saidijo.jump = function(strength)
{
	if(saidijo.canjump())
	{
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
	if(saidijo.presses.right)
	{
		saidijo.walk(1);
	}
	
	if(saidijo.presses.left)
	{
		saidijo.walk(-1);
	}
	
	// console.log(saidijo.presses);
	if(saidijo.vel.vx*saidijo.vel.vx>0.5)
	{
		saidijo.addx(saidijo.vel.vx);
	}
	
	if(saidijo.vel.vx>0) //inertie vers la droite
    {    	
     	saidijo.vel.vx = Math.min(saidijo.vel.vx,saidijo.velMax.vx);
     	saidijo.vel.vx -= 1;
    }
    else if(saidijo.vel.vx<0) //inertie vers la gauche
    {
      saidijo.vel.vx = Math.max(saidijo.vel.vx,-saidijo.velMax.vx);
      saidijo.vel.vx += 1;
    }
	
	saidijo.addy(saidijo.vel.vy);
	
	saidijo.applyGravity(1);
	draw.all();
	setTimeout(saidijo.update,saidijo.tempo)
	
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
		
		// console.log("fin queue")
		if(snake.vis2)
		{
			if(coll(s,{x:snake.vis2.x,y:snake.vis2.y,w:u,h:u}))
				{
					return true
				}
		}
	}
	
	// console.log("block");
	
	for(var y =0;y<map.h;y++)
	{
		for(var x =0;x<map.w;x++)
		{
			if(map.get(x,y) != 0)
			{
				if(coll(s,{x:x*u,y:y*u,w:u,h:u}))
					{
						return true
					}
			}
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






