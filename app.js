/*
 * IDE is the binding implementations of the IDE customized actions.
 */
var IDE = {};

/*
 * addMenu function adds a new menu entry using the specified name and items.
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

var confRe = /"entryCouponCode"(.*|[\s\S]*)\}[\s\S]*\}/;
/**
* conf function returns the configuration available in the host 
* page initialization script.
*/
IDE.conf = function conf() {
	if (!IDE._conf) {
		IDE._conf = {};
		var scripts = document.getElementsByTagName("script");
		for (var i = 0 ; i < scripts.length ; i++) {
			if (scripts[i].innerText.indexOf("App.bootstrap") >= 0) {
				var scriptData = scripts[i].innerText;
				if (scriptData.match(confRe)) {
					var confStr = '{"entryCouponCode"' + scriptData.match(confRe)[1] + '}';
					try {
						IDE._conf = JSON.parse(confStr);
					} catch (e) {
						console.log("Error loading configuration from host page.");
						console.log(e);
					}
				}
			}
		}
	}
	return IDE._conf;
}

/**
* customDomain function returns the custom domain of the box in the current URL.
*/
IDE.customDomain = function customDomain() {
	var box = IDE.currentBoxId();
	if (box) {
		var boxes = IDE.conf().boxes;
		for (var i = 0 ; i < boxes.length ; i++) {
			console.log("Looking up box configuration from: " + JSON.stringify(boxes[i]));
			if (box === boxes[i].id.toString()) {
				console.log("Found box: " + JSON.stringify(boxes[i]));
				return boxes[i].custom_domain;
			}
		}
	}
	return null;
}

/**
* Returns the current box ID
*/
IDE.currentBoxId = function currentBoxId() {
	var box = window.location.hash.match(/^#\/boxes\/(\d+)/);
	if (box) {
		return box[1];
	}
	return undefined;
}

/*
 * onHashChange function is the event handler for the event change in the URL.
 */
function onHashChange() {
	if (/^#\/boxes\//.test(window.location.hash)) {
		var domain = IDE.customDomain();
		var custom = [];
		if (domain) {
			var ports = ["3000", "4000", "8000", "8080", "8888"];
			for (var i = 0 ; i < ports.length; i++) {
				custom.push({
					"label": "Port " + ports[i],
					"url": "http://" + domain + ":" + ports[i]
				});
			}
		}
		custom.push({
			"label": "------------------",
			"url": ""
		})
		custom.push({
			"label": "Configure custom domain ...",
			"url": "/app#/boxes/" + IDE.currentBoxId() + "/domains"
		})
		IDE.addMenu("custom-domain", "Custom Domain", custom);
	}
}

// Binds the hash change to the event listener.
window.addEventListener("hashchange", onHashChange);
onHashChange();