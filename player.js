function PikaPlayer()
{
	var self = this;
	

	self.elems = {};
	self.currTitle = "";

	self.player = new Audio();
	self.player.preload = "none";

	if (Storage === undefined)
	{
		window.localStorage = {};
		console.warn("HTML5 localStorage not supported in your browser!");
	}

	if (self.player.canPlayType("audio/ogg") !== "no" &&
		self.player.canPlayType("audio/ogg") !== "")
		self.playerSrc = "http://radio.ponytonite.com:8000/stream_ogg";
	else if (self.player.canPlayType("audio/mpeg") !== "no" &&
		self.player.canPlayType("audio/mpeg") !== "")
		self.playerSrc = "http://radio.ponytonite.com:8000/stream";
	else
		throw new Error("Cannot play either OGG or MPEG audio in this browser!");
}

// Utility functions //
PikaPlayer.prototype.util = {
	// XMLHTTP request - compatible with IE9+ //
	getJSON: function(uri, callback) {
		var request = new XMLHttpRequest();
		request.open('GET', uri, true);

		request.onload = function() {
			if (request.status >= 200 && request.status < 400) {
				// Success!
				var data = JSON.parse(request.responseText);
				callback && callback(data);
			} else {
				// We reached our target server, but it returned an error
				callback && callback(false);
			}
		};

		request.onerror = function(err) {
			callback && callback(false);
			// There was a connection error of some sort
		};
		request.send();
	}
};

// Set volume slider, persistant storage and player volume //
PikaPlayer.prototype.setVolume = function(newVolume) {
	var self = this;

	newVolume = (newVolume === undefined) ? 100 : newVolume;

	self.player.volume = newVolume / 100;
	self.elems.playerVolume.value = newVolume;
	window.localStorage.playerVolume = newVolume;
};

// Play/pause player //
PikaPlayer.prototype.playPause = function() {
	var self = this;

	if (self.player.paused)
	{
		self.player.src = self.playerSrc;
		self.player.play();
	}
	else
	{
		self.player.pause();
		self.player.src = "";
	}

};

// Update metadata display //
PikaPlayer.prototype.displayMetadata = function(metadata) {
	var self = this;

	if (self.currTitle === metadata.track.title)
		return;

	self.currTitle = metadata.track.title;

	var fixWrap = function(element, value, scrollSpeed, splitDistance) {
		scrollSpeed = (scrollSpeed === undefined) ? 50 : scrollSpeed
		splitDistance = (splitDistance === undefined) ? 80 : splitDistance

		element.innerHTML = value;

		if (element.clientWidth < element.scrollWidth)
		{
			var slideDuration = (element.scrollWidth + splitDistance) / scrollSpeed;
			element.innerHTML = "<div class='marquee' style='width: " + (element.scrollWidth + splitDistance) + "px'><div style='" + 
			"-webkit-animation: marquee " + slideDuration + "s linear infinite;" +
			"-moz-animation: marquee " + slideDuration + "s linear infinite;" +
			"-o-animation: marquee " + slideDuration + "s linear infinite;" +
			"animation: marquee " + slideDuration + "s linear infinite;" +
			"'><span>" + value + "</span><span>" + value + "</span></div></div>";
		}
	};

	self.elems.player.style.backgroundImage = "url(" + metadata.track.imageurl + ")";
	self.elems.playerListeners.innerHTML = "Listeners: " + metadata.listeners;
	
	fixWrap(self.elems.playerTitle, metadata.track.title, 50, 80);
	fixWrap(self.elems.playerArtist, metadata.track.artist, 25, 70);
	fixWrap(self.elems.playerAlbum, (metadata.track.album == "Unknown" ? "" : metadata.track.album), 25, 70);

};

PikaPlayer.prototype.getMetadata = function() {
	var self = this;

	self.util.getJSON("http://radio.ponytonite.com:2199/rpc/ponytonite/streaminfo.get", function(data) {
			if (data === false)
				console.warn("Failed to get metadata!");
			else
				self.displayMetadata(data.data[0]);
		}
	);
};

// Initialize player //
PikaPlayer.prototype.initPlayer = function() {
	var self = this;

	if (self.elems.player !== undefined)
		return false;

	// Span elements for player //
	var controlElems = {
		"playerGradient": "",
		"playerTitle": "THE SONG TITLE",
		"playerArtist": "ARTIST",
		"playerAlbum": "ALBUM",
		"playerPlay": "&#9654;",
		"playerListeners": "Listeners: 0"
	};

	self.elems.player = document.createElement("div");
	self.elems.player.classList.add("player");

	for (var i in controlElems)
	{
		self.elems[i] = document.createElement("span");
		self.elems[i].classList.add(i);
		self.elems[i].innerHTML = controlElems[i];
		self.elems.player.appendChild(self.elems[i]);
	}

	// TEMPORARY volume slider //
	// TODO: Change this to a JS-controlled SVG //
	self.elems.playerVolume = document.createElement("input");
	self.elems.playerVolume.type = "range";
	self.elems.playerVolume.classList.add("playerVolume");
	self.elems.playerVolume.min = 0;
	self.elems.playerVolume.max = 100;
	self.elems.playerVolume.value = 100;
	self.elems.playerVolume.step = 1;
	self.elems.player.appendChild(self.elems.playerVolume);

	document.body.appendChild(self.elems.player);

	// Create event listener functions //
	var scrollListener = function(evt) {
		evt.preventDefault();

		var direction = -evt.detail || evt.wheelDelta;
		var volume = self.player.volume * 100;

		if (direction > 0)
			self.setVolume(Math.min(volume + 5, 100));
		else
			self.setVolume(Math.max(volume - 5, 0));

		return false;
	};

	var volumeListener = function(evt) {
		evt.preventDefault();

		self.setVolume(evt.target.value);

		return false;
	};

	var clickListener = function(evt) {
		if (evt.target === self.elems.playerVolume)
			return true;

		evt.preventDefault();
		self.playPause();
		return false;
	};

	var playListener = function(evt) {
		self.elems.playerPlay.innerHTML = "&#9724;";
	};

	var stopListener = function(evt) {
		self.elems.playerPlay.innerHTML = "&#9654;";
	};

	// Add event listeners //
	self.elems.player.addEventListener('DOMMouseScroll', scrollListener);
	self.elems.player.addEventListener('mousewheel', scrollListener);
	self.elems.playerVolume.addEventListener('input', volumeListener);
	self.elems.playerVolume.addEventListener('change', volumeListener);
	self.elems.player.addEventListener('click', clickListener);
	self.player.addEventListener('play', playListener);
	self.player.addEventListener('playing', playListener);
	self.player.addEventListener('abort', stopListener);
	self.player.addEventListener('pause', stopListener);

	// Load volume from localStorage //
	self.setVolume(window.localStorage.playerVolume);

	// Start metadata refresh timer //
	self.getMetadata();
	setInterval(function() {
		self.getMetadata();
	}, 5000);

	return true;
};
