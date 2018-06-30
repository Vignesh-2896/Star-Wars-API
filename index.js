var character_names = [];

    document.getElementById("find_film").addEventListener('click',function(){
        run(gen).catch(function(error)
		{
			alert(err.message);
		});
    })
function run(genFunc)
{
	const genObject = genFunc();
	function iterate(iteration)
	{
		if(iteration.done)
			return Promise.resolve(iteration.value);
		return Promise.resolve(iteration.value)
		.then(x => iterate(genObject.next(x))) 
		.catch(x => iterate(genObject.throw(x)));
	}
	try
	{
		return iterate(genObject.next());
	}
	catch(ex)
	{
		return Promise.reject(ex);
	}
}
function* gen()
{
	var film_searched = document.getElementById("film_search").value;
	if(film_searched > 7 || film_searched < 1)
		throw new Error("Invalid Film ID. Please enter between 1-8");
	
	var filmJSON = yield fetch("https://swapi.co/api/films/" + film_searched);
	var film = yield filmJSON.json();
	var characters = film.characters;
    for(let i = 0; i < characters.length ; i++)
	{
        var tempCharacterResponse = yield fetch(characters[i]);
        var tempCharacter = yield tempCharacterResponse.json();
		character_names.push(tempCharacter.name);
    }
	
	document.getElementById("film_name").innerHTML = film.title;
	character_names.forEach(character_inject);
}

function character_inject(val)
{
	var li = document.createElement("li");
	li.innerHTML = val;
	document.getElementById("film_characters").appendChild(li);
}