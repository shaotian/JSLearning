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
        if (window.location.href.indexOf(l)!= -1) {
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
    elem.style.top = calc(ypos, finalY)+ "px";
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
        link.lindex = i+1;
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

addLoadEvent(highlightPage);
addLoadEvent(prepareSlideShow);
addLoadEvent(prepareInternalNav);
