function AjaxLoadingLink(url, statusPage) {
    var newHtml,
        newNonce,
        alActionForNonce,
        preloadImg = document.querySelector('.ajax-loading-preload'),
        self = this;
    self.url = url;
    self.statusPage = statusPage;

    var getLocation = function (href) {
        var l = document.createElement("a");
        l.href = href;
        return l;
    };

    self.preLoader = function (bool) {
        preloadImg.style.display = bool ? 'block' : 'none';
    };

    self.getStatusPage = function () {
        if (self.statusPage == 'back') {
            self.statusPage = 'back';
        } else {
            self.statusPage = 'new';
        }
    };

    self.ajaxRequest = function () {
        self.preLoader(true);
        var request = new XMLHttpRequest();
        var data = 'url=' + encodeURIComponent(self.url) +
            '&al_action_for_nonce=' + encodeURIComponent(ajaxLoading.al_action_for_nonce) +
            '&action=' + encodeURIComponent(ajaxLoading.action) +
            '&new_al_action_for_nonce=' + encodeURIComponent('ajax-loading-nonce_' + getLocation(self.url).pathname.replace(/\//g, '-')) +
            '&nonce=' + encodeURIComponent(ajaxLoading.nonce);
        request.open('POST', ajaxLoading.url, true);
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        request.send(data);
        request.onload = function () {
            if (request.status >= 200 && request.status < 500) {
                // Success!
                newHtml = JSON.parse(request.responseText).html;
                newNonce = JSON.parse(request.responseText).nonce;
                alActionForNonce = JSON.parse(request.responseText).al_action_for_nonce;
                self.getStatusPage();
                if (self.statusPage == 'new') {
                    self.preLoader(false);
                    self.insertNewPage(newHtml);
                    window.scrollTo(0, 0);
                } else if (self.statusPage == 'back') {
                    self.preLoader(false);
                    self.insertBackPage(newHtml);
                }
            } else {
                // We reached our target server, but it returned an error
                self.insertNewPage('<h1>' + request.statusText + '</h1>');
            }
            request.onerror = function () {
                // There was a connection error of some sort
            };
        };
    };

    self.insertNewPage = function (html) {
        var newDoc = document.open("text/html", "replace");
        document.write(html);
        ajaxLoading.nonce = newNonce;
        ajaxLoading.al_action_for_nonce = alActionForNonce;
        newDoc.close();
        window.history.pushState({}, "", self.url);
    };

    self.insertBackPage = function (html) {
        var newDoc = document.open("text/html", "replace");
        document.write(html);
        ajaxLoading.nonce = newNonce;
        ajaxLoading.al_action_for_nonce = alActionForNonce;
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
            var linkObj = new AjaxLoadingLink(linkHref);
            linkObj.ajaxRequest();
        }
    };
}

window.addEventListener("popstate", function (e) {
    var linkObjBack = new AjaxLoadingLink(window.location.href, 'back');
    linkObjBack.ajaxRequest();
}, false);