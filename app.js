/*
* IDE is the binding implementations of the IDE customized actions.
*/
var IDE = {};

/*
* Adds a new menu entry using the specified name and items.
* Items must be an array of objects with a label and url properties.
*/
IDE.addMenu = function addMenu(id, name, items) {
	if (document.getElementById(id)) {
		console.log("Menu entry " + id + " already added.");
		return
	}
	
	var ul = document.createElement("ul");
	ul.setAttribute("class", "ember-view dropdown-menu");
	for (var i = 0; i< items.length; i++) {
		var s = document.createElement("span");
		s.setAttribute("class", "menu-label name");
		s.innerText = items[i].label;

		var fa = document.createElement("i");
		fa.setAttribute("class", "fa");

		var a = document.createElement("a");
		a.href = items[i].url;
		a.target = "_blank";
		a.appendChild(fa);
		a.appendChild(s);

		var li = document.createElement("li");
		li.setAttribute("class", "ember-view");
		li.appendChild(a);
		ul.appendChild(li);
	}

	var label = document.createElement("a");
	label.innerText = name;
	label.setAttribute("class", "dropdown-toggle");
	label.setAttribute("data-toggle", "dropdown");

	var entry = document.createElement("li");
	entry.setAttribute("id", id);
	entry.setAttribute("class", "dropdown");
	entry.appendChild(label);
	entry.appendChild(ul);
	
	var m = document.getElementById("ide_main_menu_view");
	m.getElementsByTagName("ul")[0].appendChild(entry);
}

/*
* onHashChange function is the event handler for the event change in the URL.
*/
function onHashChange() {
	if (/^#\/boxes\//.test(window.location.hash)) {
		IDE.addMenu("custom-domain", "Custom Domain", [
			{
				"label": "Port 3000",
				"url": "http://dev.ronoaldo.net:3000"
			},{
				"label": "Port 4000",
				"url": "http://dev.ronoaldo.net:4000"
			},{
				"label": "Port 8000",
				"url": "http://dev.ronoaldo.net:8000"
			},{
				"label": "Port 8080",
				"url": "http://dev.ronoaldo.net:8080"
			},{
				"label": "Port 8888",
				"url": "http://dev.ronoaldo.net:8888"
			}
		]);
	}
}

// Binds the hash change to the event listener.
window.addEventListener("hashchange", onHashChange);
onHashChange();