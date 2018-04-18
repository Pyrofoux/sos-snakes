levels = {};
levels.list = [];

levels.init = function()
{
	list = ascii.split("\n\r");
	
	for(var i in list)
	{
		list[i] = list[i].trim();
		list[i] = list[i].split("\n");
		for(var j in list[i])
		{
			list[i][j] = list[i][j].trim();
		}
	}
	levels.list = list;
	
	levels.read(0);
}

levels.read = function(id)
{
	m = clone(map.exemple);

	for(var y =0;y<map.h;y++)
	{
		for(var x =0;x<map.w;x++)
		{
			var c = list[id][y][x];
			
			if(c == "*")
			{
				m[y][x] = 0;
			}
			else if(c == "0")
			{
				m[y][x] = 1;
			}
			else if(c == "+")
			{
				m[y][x] = 2;
			}
			else if(c == "D")
			{
				m[y][x] = 3;
			}
			else if(c == "G")
			{
				m[y][x] = 4;
			}
			else if(c == "S")
			{
				saidijo.teleport(u*x+(u/4),u*y);
			}
			else
			{
				snake.spawn(x,y,c);
			}
		}
	}
	
	map.m = m;
}