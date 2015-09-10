function AjaxLink(url, statusPage) {
    var self = this;
    self.url = url;
    self.statusPage = statusPage;

    self.getStatusPage = function () {
        if (self.statusPage == 'back') {
            self.statusPage = 'back';
        } else {
            self.statusPage = 'new';
        }
    };

    self.ajaxRequest = function () {
        var request = new XMLHttpRequest();
        request.open('POST', self.url, true);
        request.send();
        request.onload = function () {
            if (request.status >= 200 && request.status < 400) {
                // Success!
                self.getStatusPage();
                if (self.statusPage == 'new') {
                    self.insertNewPage(request.responseText);
                    window.scrollTo(0, 0);
                } else if (self.statusPage == 'back') {
                    self.insertBackPage(request .responseText);
                }
            } else {
                // We reached our target server, but it returned an error
            }
            request.onerror = function () {
                // There was a connection error of some sort
            };
        };
    };

    self.insertNewPage = function (html) {
        var newDoc = document.open("text/html", "replace");
        document.write(html);
        newDoc.close();
        window.history.pushState({}, "", self.url);
    };

    self.insertBackPage = function (html) {
        var newDoc = document.open("text/html", "replace");
        document.write(html);
        newDoc.close();
    };
}

var links = document.querySelectorAll('a');
for (var key in links) {
    links[key].onclick = function (e) {
        var linkHref = this.getAttribute('href');
        var linkTarget = this.getAttribute('target');
        if (!linkHref.indexOf('wp-admin') + 1 && linkTarget != '_blank') {
            e.preventDefault();
            var linkObj = new AjaxLink(linkHref);
            linkObj.ajaxRequest();
        }
    };
}

window.addEventListener("popstate", function (e) {
    var linkObjBack = new AjaxLink(window.location.href, 'back');
    linkObjBack.ajaxRequest();
}, false);