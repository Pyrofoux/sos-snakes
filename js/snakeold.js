var snake = {};

snake.tail = [];
snake.head = {x:8,y:10};
snake.tempo = 300;
snake.dir = 1;
snake.dirdur = 1;


snake.colhead = "red";
snake.coltail = "gold"; //lol "cocktail"

snake.start = function()
{
	
	shortcut.add("Z",function(){snake.godir(0)});
	shortcut.add("D",function(){snake.godir(1)});
	shortcut.add("S",function(){snake.godir(2)});
	shortcut.add("Q",function(){snake.godir(3)});
	
	setTimeout(snake.step,snake.tempo);
}

snake.godir = function(dir)
{
	if(dir%2 != snake.dir%2)snake.dir = dir;
}

snake.step = function()
{
	var c = {};
	c.x = snake.head.x+dirs[snake.dir].x;
	c.y = snake.head.y+dirs[snake.dir].y;

	var b = map.get(c.x,c.y);
	if(b == 2)
	{
		map.set(c.x,c.y,0);
	}
	else
	{
		snake.tail.splice(-1,1);
	}
	snake.tail.unshift(snake.head);
	snake.head = c;
	// draw.all();
	// setTimeout(snake.step,snake.tempo);
}
