var visual = {
	Ascii: {
		Elevator: {
			Closed: [
				"  /\\  ",
				"-------",
				"|     |",
				"|     |",
				"|     |",
				"|     |",
				"-------"
			],
			Open: [
				"  /\\  ",
				"------/",
				"|      ",
				"|      ",
				"|      ",
				"|      ",
				"------\\"
			]
		},

		People: {
			Male: [
				" o",
				"/|\\",
				"/ \\",
				"| |"
			],
			Female: [
				" O",
				"[|]",
				"/_\\",
				"| |"
			],
			Penis: [
				"  O",
				"/--",
				"\\--",
				"  O"
			],
			Nobody: []
		},
	},

	putInElevator: function(elevatorState, personType, personEntry)
	{
		return elevatorState.map(function(elem, index) {
			if (index < 2 || index - 2 >= personType.length)
				return elem;
			else
			{
				var padding = "";
				for (var i = 0; i < personEntry; ++i)
					padding += ' ';
				return elem.substr(0, 2) + padding + personType[index-2] + elem.substr(personType[index-2].length + 2 + personEntry);
			}
		}).join("\n");
	},

	randomPerson: function() {
		return Math.floor(Math.random() * 2) ? Math.floor(Math.random() * 120) ? "Male" : "Penis" : "Female";
	}
};
