var draw = {};

var u = 32;

var alpha = 0;

draw.init = function(callb)
{
	cvs.width = u*25;
	cvs.height = u*25;
	callb();
}


draw.all = function()
{
	ctx.clearRect(0,0,cvs.width,cvs.height);
	draw.map();
	draw.tail();
	draw.vis();
	draw.hero();
	if(!saidijo.moved || !snake.moved)draw.text();
	if(levels.id == 0)
	{
		draw.title();
	}

	alpha += 0.1;
	if(alpha > 10000)
	{
		alpha = 0;
	}
}

draw.tail = function()
{
	var t = snake.tail.slice(0, -1);
	for(var i in t)
	{
		draw.rect(t[i].x*u,t[i].y*u,u,u,snake.coltail);
	}
	
	if(!snake.JEMANJ)
	{
		if(snake.alive)
		{
			draw.rect(snake.vis2.x,snake.vis2.y,u,u,snake.colvis2);
		}
		else
		{
			colors = map.cols[3];
			draw.rect(snake.vis2.x,snake.vis2.y,u,u,draw.rgb(colors.r + colors.c* Math.sin(alpha*colors.s), colors.g + colors.c * Math.cos(alpha*colors.s), colors.b + colors.c * Math.cos(alpha*colors.s + 0.2)));
			// draw.rect(snake.vis2.x,snake.vis2.y,u,u,snake.colvis2);
		}
	}
	else if(snake.tail.length>1)
	{
		t = snake.tail[snake.tail.length-2]
		
		if(snake.alive)
		{
			draw.rect(t.x*u,t.y*u,u,u,snake.colvis2);
		}
		else
		{
			// colors = map.cols[3];
			// draw.rect(t.x*u,t.y*u,u,u,draw.rgb(colors.r + colors.c* Math.sin(alpha*colors.s), colors.g + colors.c * Math.cos(alpha*colors.s), colors.b + colors.c * Math.cos(alpha*colors.s + 0.2)));
			draw.rect(t.x*u,t.y*u,u,u,"red")
		}
	}
}


draw.vis = function()
{
	if(snake.tail.length>0)draw.rect(snake.head.x * u,snake.head.y * u, u, u, snake.colvis);
	
	draw.rect(snake.vis.x,snake.vis.y,u,u,snake.colvis);
}

draw.hero = function()
{
	draw.rect(saidijo.cor.x,saidijo.cor.y,saidijo.cor.w,saidijo.cor.h,saidijo.col);
}

draw.map = function()
{
	map.walk(
	function(x,y)
	{
		var colors = map.cols[map.m[y][x]];
		draw.rect(x*u,y*u,u,u,draw.rgb(colors.r + colors.c* Math.sin(alpha*colors.s), colors.g + colors.c * Math.cos(alpha*colors.s), colors.b + colors.c * Math.cos(alpha*colors.s + 0.2)));
	});
}

draw.rect = function(x,y,w,h,col)
{
	ctx.beginPath();
	ctx.fillStyle = col;
	ctx.rect(x,y,w,h);
	ctx.fill(); 
	ctx.closePath();
}

draw.rgb = function(r, v, b)
{
	// console.log("rgb(" + parseInt(Math.abs(r)).toString() + "," + parseInt(Math.abs(v)).toString() + ", " + parseInt(Math.abs(b)).toString() +")")
    return "rgb(" + parseInt(Math.abs(r)).toString() + "," + parseInt(Math.abs(v)).toString() + ", " + parseInt(Math.abs(b)).toString() +")";
}

draw.rgba = function(r, v, b, a)
{
    return "rgba(" + parseInt(Math.abs(r)).toString() + "," + parseInt(Math.abs(v)).toString() + ", " + parseInt(Math.abs(b)).toString() +", " + Math.abs(a).toString() +")";
}

draw.black = function(callb)
{
	var i=0,limit=50,delta = 10;
	ctx.globalAlpha = 0.2;
	ctx.fillStyle = "black";
	function step()
	{
		ctx.fillRect(0,0,cvs.width,cvs.height);
		i++
		if(i>=limit)
		{
			if(callb)
			{
				ctx.globalAlpha = 1;
				callb();
			}
		}
		else
		{
			setTimeout(step,delta);
		}
	}
	step();
}

draw.unblack = function(callb,s)
{
	var ref = dc("canvas");
	ref.width = cvs.width,ref.height=cvs.height;
	ref.getContext("2d").drawImage(cvs,0,0);
	
	
	ctx.fillStyle = "black";
	var i=0,limit=50,delta = 10;
	function step()
	{
		ctx.globalAlpha = 1;
		// if(!s)
			// {
				ctx.drawImage(ref,0,0);
			// }
			// else
			// {
				// draw.map();
			// }
		ctx.globalAlpha = 1-i/limit;
		ctx.fillRect(0,0,cvs.width,cvs.height);
		i++
		if(i>=limit)
		{
			ctx.globalAlpha = 1;
			// if(!s)
			// {
				ctx.drawImage(ref,0,0);
			// }
			// else
			// {
				// draw.map();
			// }
			if(callb)callb();
		}
		else
		{
			setTimeout(step,delta);
		}
	}
	step();
}

draw.text = function()
{
	ctx.font = "24px copse";
	
	// ctx.textBaseline="alphabetic"; 
	if(!saidijo.moved)
	{
		var s = saidijo.cor,sx = s.x, sy = s.y;
		ctx.fillStyle = draw.rgba(255,255,255,Math.cos(1+alpha/4));
		ctx.fillText("→",sx+u,sy+u/2);
		ctx.fillStyle = draw.rgba(255,255,255,Math.cos(alpha/4));
		ctx.fillText("←",sx-u-6,sy+u/2);
		ctx.fillStyle = draw.rgba(255,255,255,Math.cos(2+alpha/4));
		ctx.fillText("↑",sx+3,sy-u/2);
	}
	
	if(!snake.moved)
	{
		var t = snake, tx = t.head.x*u,ty = t.head.y*u;
		ctx.fillStyle = draw.rgba(255,255,255,Math.cos(2+alpha/4));
		ctx.fillText("D",tx+u+6,ty+u/2+8);
		ctx.fillStyle = draw.rgba(255,255,255,Math.cos(alpha/4));
		ctx.fillText("A",tx-u+8,ty+u/2+8);
		ctx.fillStyle = draw.rgba(255,255,255,Math.cos(1+alpha/4));
		ctx.fillText("W",tx+4,ty-6);
		ctx.fillStyle = draw.rgba(255,255,255,Math.cos(3+alpha/4));
		ctx.fillText("S",tx+8,ty+u+u-8);
	}
	
}

draw.title = function()
{
	// ctx.textBaseline="middle"; 
	ctx.font = "64px copse";
	ctx.fillStyle = draw.rgb(255,255,255);
	draw.midtext("S.O.S Snake",5*u-u);
	
	ctx.font = "32px copse";
	draw.midtext("by",6.4*u-u);
	draw.midtext("Gdcvdqpl & Pyrofoux",7.7*u-u);
	
	ctx.font = "24px copse";
	draw.midtext("LD36",23*u);
}

draw.midtext = function(txt,h)
{
	textWidth = ctx.measureText(txt).width;
	ctx.fillText(txt ,(cvs.width/2) - (textWidth/ 2), h)
}


