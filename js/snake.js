var snake = {};

snake.tail = [];
snake.head = {x:-1,y:-1};
snake.tempo = 4;
snake.dir = 1;
snake.coltail = "#FFFFFF"
snake.vis = {x:snake.head.x*u,y:snake.head.y*u};
snake.vis2 = false;
snake.colvis = "#FFFFFF";
snake.colvis2 = "#FFFFFF";
snake.bouffe = 3;
snake.JEMANG = false;
snake.alive = false;
snake.started = false;
snake.moved = false;
snake.end = false;

snake.start = function()
{
	shortcut.add("Z",function(){snake.godir(0)});
	shortcut.add("W",function(){snake.godir(0)});
	
	shortcut.add("D",function(){snake.godir(1)});
	shortcut.add("S",function(){snake.godir(2)});
	
	shortcut.add("Q",function(){snake.godir(3)});
	shortcut.add("A",function(){snake.godir(3)});
}

snake.spawn = function(newX,newY,len) //x and y for the grid, not the actual draw coordinates
{
	snake.alive = true;
	snake.head.x = newX;
	snake.head.y = newY;
	snake.vis.x = newX*u;
	snake.vis.y = newY*u;
	snake.started = false;
	snake.JEMANG = false;
	snake.bouffe = len;
	snake.tail = [];
	snake.vis2 = false;
	snake.moved = false;
	snake.end = false;

}

snake.godir = function(dir)
{
	
	if(!snake.started && snake.alive)
	{
		snake.started = true;
		snake.dir = dir;
		snake.block();
		snake.moved = true;
		sound.snakeActive.play();
	}
	else
	{
		if(dir%2 != snake.dir%2)snake.dir = dir;
		snake.moved = true;
	}
}

snake.step = function()
{
	if(snake.end)snake.dir = 1;
	if(!snake.alive)return false;
	
	var s = 0,c = dirs[snake.dir], calc = [snake.head].concat(snake.tail),end,bend,d;
	
	
	if(calc.length >= 2)
	{
		end = calc[calc.length-1];
		bend = calc[calc.length-2];
		d = {x:bend.x-end.x,y:bend.y-end.y}
		snake.vis2 = {}		
	}
	function step()
	{
		s++;
		snake.vis.x = snake.head.x*u+s*c.x;
		snake.vis.y = snake.head.y*u+s*c.y;
		
		if(snake.vis2)
		{
			snake.vis2.x = end.x*u+s*d.x;;
			snake.vis2.y = end.y*u+s*d.y;;
		}
		
		if(coll(saidijo.cor,{x:snake.vis.x,y:snake.vis.y,w:u,h:u}))
			{
				saidijo.cor.x += c.x;
				saidijo.cor.y += c.y;
			}
		
		
		// draw.all();
		if(s <u)
		{
			if(snake.alive)
			setTimeout(step,snake.tempo);
		}
		else
		{
			snake.block(1);
		}
		
	}
	
	step();
}

snake.block = function(t)
{
	
	if(t)
	{
		var newX = Math.floor(snake.vis.x/u), newY = Math.floor(snake.vis.y/u);
		
		if(map.get(newX,newY) == 2)
		{
			sound.snakePowerUp.play();
			map.set(newX,newY,0);
			snake.bouffe++;
		}
		snake.tail.unshift(clone(snake.head));
		if(snake.bouffe > 0)
		{
			snake.bouffe--
			snake.JEMANJ = true;
		}
		else
		{
			snake.JEMANJ = false;
			snake.tail.splice(-1,1);
		}
		snake.head.x = newX;
		snake.head.y = newY;
		
		var dx = (snake.head.x+dirs[snake.dir].x),// SNAKE DX, NOUVELLE GENERATIOOOOON
		dy = (snake.head.y+dirs[snake.dir].y);

		var c = map.get(dx,dy);
		if((c == 2 || c == 0) && !snake.isSnake(dx,dy))
		{	
			snake.step();
		}
		else if(c == -1)
		{
			snake.end = true;
			snake.step();
		}
		else
		{
			snake.dead();
		}
	}
	else
	{
		snake.step();
	}
}

snake.dead = function(t)
{
	
	if(snake.alive)
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
		
		if(!t)sound.snakeDeath.play();
		
		if(levels.id == levels.list.length-1)
		{
			saidijo.death();
		}
		
		// alert(JSON.stringify(snake.vis2))
	}
	snake.alive = false;
}

snake.isSnake = function(x,y)
{
	if(snake.head.x == x && snake.head.y == y)return true
	
	for(var i in snake.tail)
	{
		if(snake.tail[i].x == x && snake.tail[i].y == y)return true
	}
	return false
}
























