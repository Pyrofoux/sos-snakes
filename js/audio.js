var audio = {},songs={},sound = {};

audio.songs = ["zik1","zik2","zik3","zik4"];
audio.list = ["death","snakePowerUp","jump","snakeDeath","snakeActive","endLevel"]

audio.init = function(callb)
{
	audio.loadsongs(function()
	{
		audio.load(audio.list,callb);
	});
}

audio.load = function(arr,callb)
{
	if(!arr.length)
		return callb();
	
	for(var i = 0,loads=0;i<arr.length;i++)
	{
		var sfx = new Audio();
		sfx.addEventListener("canplaythrough",loaded,false);
		sfx.preload = "auto";
		ext = (~arr[i].indexOf(".")) ? "": ".mp3";
		sfx.src = "sound/"+arr[i]+ext;
		sound[arr[i].split(".")[0]] = hid.appendChild(sfx);
	}
	
	function loaded()
	{
		loads++
		
		if(loads == arr.length)callb();
	}
}

audio.loadsongs = function(callb)
{
	arr = audio.songs;
	for(var i = 0,loads=0;i<arr.length;i++)
	{
		var sfx = new Audio();
		sfx.addEventListener("canplaythrough",loaded,false);
		sfx.addEventListener("ended",function()
		{
			audio.next();
		});
		sfx.preload = "auto";
		// sfx.controls = true;
		
		sfx.src = "zik/"+arr[i]+".mp3"
		songs[arr[i]] = hid.appendChild(sfx);
		
	}
	
	function loaded()
	{
		loads++
		if(loads == arr.length)callb();
	}
}


songs.last = "";

songs.play = function(name)
{
	songs[name].currentTime = 0;
	songs[name].volume = 1;
	songs[name].play();
	songs.last = name;
}

songs.fade = function(callb)
{
	last =  songs["zik"+audio.current];
	
	if(!last)
	{
		callb();
		return false
	}
	
	var steps = 500,i=1;
	function step()
	{
		
		last.volume -= 1/steps;
		i++
		
		
		if(i>=steps)
		{
			last.volume = 0;
			if(callb)
			{
				callb();
			}
		}
		else
		{
			setTimeout(step,1);
		}
		// alert("yo")
	}
	step();
}

songs.fadein = function(name,callb)
{
	var steps = 500,i=1;
	songs.play(name);
	last = songs["zik"+audio.current];
	last.volume = 0;
	function step()
	{
		
		last.volume += 1/steps;
		i++
		
		
		if(i>=steps)
		{
			last.volume = 1;
			if(callb)
			{
				callb();
			}
		}
		else
		{
			setTimeout(step,1);
		}
	}
	step();
}

audio.current = 2;

audio.finalfade = true;

audio.next = function()
{
	var id = rand(1,4), n = "zik"+id, cur = "zik"+audio.current;
	songs[cur].pause();
	songs[n].currentTime = 0;
	audio.current = id;
	setTimeout(function()
	{
		songs.fadein(n);
	},3000)
}

audio.mbool = true;

audio.mute = function()
{
	audio.mbool = !audio.mbool;
	
	if(!audio.mbool)
	{
		songs["zik"+audio.current].pause();
	}
	else
	{
		songs["zik"+audio.current].play();
	}
}