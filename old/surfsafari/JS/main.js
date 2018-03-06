/*if (navigator.userAgent.indexOf("Dreamweaver") == -1)
	setTimeout(function(){location.reload();}, 1500);*/

window.addEventListener('load', function() {

	// Generate comment links (because this way is easier to do globally)
	var comments = document.body.getElementsByClassName('pcomments');
	for (var i = 0; i < comments.length; ++i)
	{
		var elem = document.createElement('a');
		elem.href = "comments.html";
		elem.innerHTML = comments[i].innerHTML;
		comments[i].innerHTML = "";
		comments[i].appendChild(elem);
	}

	if (window.localStorage.surfSafariLogin)
	{
		var elems = document.getElementsByTagName("a");
		for (var i = 0; i < elems.length; ++i)
		{
			if (elems[i].innerHTML == "Login")
			{
				elems[i].innerHTML = "Log out";
				elems[i].href = "";
				elems[i].onclick = function() {
					delete window.localStorage.surfSafariLogin;
					alert("Logged out");
					window.location.reload();
				};
			}
		}
	}

}, false);