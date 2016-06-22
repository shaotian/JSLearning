
function prepareGallery() {
	var gallery = document.getElementById("imageGallery");
	var links = gallery.getElementsByTagName("a");
	for (var i = links.length - 1; i >= 0; i--) {
		links[i].onclick = function() {
			showPic(this);
			return false;
		}
	}
}

function showPic(whichpic) {
	var placeholder = document.getElementById("placeholder");
	// placeholder.setAttribute("src", whichpic.getAttribute("href"));
	placeholder.src = whichpic.href;
	var p = document.getElementById("description");
	p.firstChild.nodeValue = whichpic.title;
}

function addLoadEvent(func) {
	var oldOnload = window.onload;
	if (typeof oldOnload != "function") {
		window.onload = func;
	} else {
		window.onload = function() {
			oldOnload();
			func();
		}
	}
}

function deleteChild() {
	var placeholder = document.getElementById("placeholder");
	var description = document.getElementById("description");
	var parent = placeholder.parentNode;
	parent.removeChild(placeholder);
	parent.removeChild(description);

}

function insertAfter(newElement, targetElement) {
	var parent = targetElement.parentNode;
	if (targetElement == parent.lastChild) {
		parent.appendChild(newElement);
	} else {
		parent.insertBefore(newElement, targetElement.nextSibling);
	}
}

function preparePlaceholder() {
	var placeholder = document.createElement("img");
	placeholder.id = "placeholder";
	placeholder.src = "images/scenery1.jpg";
	var description = document.createElement("p");
	description.id = "description";
	var txt = document.createTextNode("Choose an image");
	description.appendChild(txt)
	var gallery = document.getElementById("imageGallery");
	insertAfter(placeholder, gallery);
	insertAfter(description, placeholder);
}

addLoadEvent(prepareGallery);

addLoadEvent(deleteChild);

addLoadEvent(preparePlaceholder)