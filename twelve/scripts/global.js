function addLoadEvent(func) {
    var old = window.onload;
    if ((typeof old) != "function") {
        window.onload = func;
    } else {
        window.onload = function () {
            old();
            func();
        }
    }
}
function insertAfter(newElement, targetElement) {
    var parent = targetElement.parentNode;
    if (targetElement == parent.lastChild) {
        parent.appendChild(newElement);
    } else {
        parent.insertBefore(newElement, targetElement.nextSibling);
    }
}
function addClass(element, value) {
    if (!element.className) {
        element.className = value;
    } else {
        element.className += " " + value;
    }
}
function highlightPage() {
    var headers = document.getElementsByTagName("header");
    if (headers.length < 1) {
        return;
    }
    var navs = headers[0].getElementsByTagName("nav");
    if (navs.length < 1) {
        return;
    }
    var links = navs[0].getElementsByTagName("a");
    if (links.length < 1) {
        return;
    }

    for (var i = 0; i < links.length; i++) {
        var l = links[i].href;
        if (window.location.href.indexOf(l) != -1) {
            addClass(links[i], "here");
            document.body.id = links[i].lastChild.nodeValue.toLowerCase();
        }
    }

}
function moveElement(elementId, finalX, finalY, interval) {
    var elem = document.getElementById(elementId);
    if (elem.movement) {
        clearTimeout(elem.movement);
    }
    if (!elem.style.left || !elem.style.top) {
        elem.style.left = "0px";
        elem.style.top = "0px";
    }
    var xpos = parseInt(elem.style.left);
    var ypos = parseInt(elem.style.top);
    if (xpos == finalX && ypos == finalY) {
        return;
    }

    elem.style.left = calc(xpos, finalX) + "px";
    elem.style.top = calc(ypos, finalY) + "px";
    elem.movement = setTimeout("moveElement('" + elementId + "'," + finalX + "," + finalY + "," + interval + ")", interval);
}

function calc(cur, final) {
    if (cur > final) {
        return cur - Math.ceil((cur - final) / 10);
    } else {
        return cur + Math.ceil((final - cur) / 10);
    }
}

function prepareSlideShow() {
    var intro = document.getElementById("intro");
    if (!intro) {
        return;
    }
    var slideShow = document.createElement("div");
    slideShow.id = "slideshow";
    var preview = document.createElement("img");
    preview.id = "preview";
    preview.src = "images/slideshow.gif";
    slideShow.appendChild(preview);
    var frame = document.createElement("img");
    frame.src = "images/frame.gif";
    frame.id = "frame";
    slideShow.appendChild(frame);
    insertAfter(slideShow, intro);
    var links = intro.getElementsByTagName("a");
    var overFun = function () {
        moveElement("preview", this.lindex * -150, 0, 5);
    };
    for (var i = 0; i < links.length; i++) {
        var link = links[i];
        link.onmouseover = overFun;
        link.lindex = i + 1;
    }
}
function prepareInternalNav() {
    if (document.body.id != "about") {
        return;
    }
    var sections = document.getElementsByTagName("section");
    if (sections.length < 1) {
        return;
    }
    var ul = document.createElement("ul");
    for (var i = 0; i < sections.length; i++) {
        var section = sections[i];
        var h2 = section.getElementsByTagName("h2")[0];
        var li = document.createElement("li");
        var a = document.createElement("a");
        a.appendChild(document.createTextNode(h2.lastChild.nodeValue));
        a.href = "#" + section.id;
        li.appendChild(a);
        ul.appendChild(li);
        section.style.display = "none";
        a.sectionId = section.id;
        a.onclick = function () {
            for (var j = 0; j < sections.length; j++) {
                var s = sections[j];
                if (s.id == this.sectionId) {
                    s.style.display = "block";
                } else {
                    s.style.display = "none";
                }
            }
        }
    }

    sections[0].parentNode.insertBefore(ul, sections[0]);
}

function preparePlaceholder() {
    var gallery = document.getElementById("imagegallery");
    if (!gallery) {
        return;
    }
    var placeholder = document.createElement("img");
    placeholder.id = "placeholder";
    placeholder.src = "images/placeholder.gif";
    var description = document.createElement("p");
    description.id = "description";
    description.appendChild(document.createTextNode("Choose an image"));

    insertAfter(description, gallery);
    insertAfter(placeholder, description);
}

function prepareGallery() {
    var gallery = document.getElementById("imagegallery");
    if (!gallery) {
        return;
    }
    var links = gallery.getElementsByTagName("a");
    var click = function () {
        showPic(this);
        return false;
    };
    for (var i = 0; i < links.length; i++) {
        var link = links[i];
        link.onclick = click;
    }
}

function showPic(whichpic) {
    var placeholder = document.getElementById("placeholder");
    placeholder.src = whichpic.href;
    var description = document.getElementById("description");
    description.lastChild.nodeValue = whichpic.title;
}

function getHttpObject() {
    return new XMLHttpRequest();
}

function displayAjaxLoading(element) {
    while (element.hasChildNodes()) {
        element.removeChild(element.lastChild);
    }
    var content = document.createElement("img");
    content.src = "images/loading.gif";
    element.appendChild(content);
}

function submitFormWithAjax(whichform, thetarget) {
    var request = getHttpObject();
    if (!request) {
        return false;
    }
    displayAjaxLoading(thetarget);
    var dataParts = [];
    var element;
    for (var i = 0; i < whichform.elements.length; i++) {
        element = whichform.elements[i];
        dataParts[i] = element.name + '=' + encodeURIComponent(element.value);
    }
    var data = dataParts.join('&');
    request.open('POST', whichform.action, true);
    request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    request.onreadystatechange = function () {
        if (request.readyState != 4) {
            return;
        }
        if (request.status != 200 && request.status != 0) {
            thetarget.innerHTML = '<p>' + request.statusText + '</p>';
            return;
        }
        for (var i = 0; i < 1000000000; i++) {
        }
        var matches = request.responseText.match(/<article>([\s\S]+)<\/article>/)
        if (matches.length > 0) {
            thetarget.innerHTML = matches[1];
        } else {
            thetarget.innerHTML = '<p>Oops, there was an error. Sorry.</p>>';
        }
    };
    request.send(data);
    return true;
}

function prepareForms() {
    if (document.forms.length < 1) {
        return;
    }
    for (var i = 0; i < document.forms.length; i++) {
        var thisForm = document.forms[i];
        thisForm.onsubmit = function () {
            var article = document.getElementsByTagName('article')[0];
            return !submitFormWithAjax(this, article);
        }
    }
}

addLoadEvent(highlightPage);
addLoadEvent(prepareSlideShow);
addLoadEvent(prepareInternalNav);
addLoadEvent(preparePlaceholder);
addLoadEvent(prepareGallery);
addLoadEvent(prepareForms);