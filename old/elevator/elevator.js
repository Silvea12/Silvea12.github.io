
var height = 0;
var goingUp = false;
var stayTime = 0;
var personType = "Nobody";
var personLeaving = false;


setInterval(function() {

	var pre = document.createElement('pre');

	var elevatorType = "Open"

	if (height == 0 && goingUp == false)
	{
		personLeaving = true;
		stayTime = 8;
		goingUp = true;
	}
	else if (height == 30 && goingUp == true)
	{
		personLeaving = true;
		stayTime = 8;
		goingUp = false;
	}
	else if (stayTime > 0)
	{
		if (personType == "Nobody")
			personType = visual.randomPerson();
		--stayTime;
	}
	else if (personLeaving)
	{
		personLeaving = false;
		personType = "Nobody";
		stayTime = 8;
	}
	else
	{
		//if (personType == "Nobody")
			//personType = visual.randomPerson();

		elevatorType = "Closed";
		if (goingUp)
			++height;
		else
			--height;
	}

	for (var i = 30; i > height; --i)
	{
		pre.innerHTML += ("  ||\n");
	}

	pre.innerHTML += (visual.putInElevator(visual.Ascii.Elevator[elevatorType], visual.Ascii.People[personType], personLeaving ? 16 - stayTime * 2 : stayTime * 2));

	for (var i = 0; i < height; ++i)
	{
		pre.innerHTML += "\n";
	}

	document.body.innerHTML = pre.outerHTML;

	//console.log("Height:", height, "StayTime:", stayTime, "GoingUp:", goingUp);

	//console.log('\033[2J');
	//console.log("\n" + elevatorType + " " + personType + ":");
	//console.log(visual.putInElevator(visual.Ascii.Elevator[elevatorType], visual.Ascii.People[personType]));
}, 100);
