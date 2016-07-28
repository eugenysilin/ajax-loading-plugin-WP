function AjaxLoadingForm(form) {
    var newHtml,
        newNonce,
        alActionForNonce,
        newUrl,
        preloadImg = document.querySelector('.ajax-loading-preload'),
        self = this;
    self.form = form;
    self.url = self.form.getAttribute('action');
    self.method = self.form.getAttribute('method').toUpperCase();
    self.formData = form.querySelectorAll('*');

    var getLocation = function (href) {
        var l = document.createElement("a");
        l.href = href;
        return l;
    };

    self.preLoader = function (bool) {
        preloadImg.style.display = bool ? 'block' : 'none';
    };

    self.getRequestData = function () {
        self.data = 'url=' + encodeURIComponent(self.url) +
            '&al_action_for_nonce=' + encodeURIComponent(ajaxLoading.al_action_for_nonce) +
            '&action=' + encodeURIComponent(ajaxLoading.action) +
            '&new_al_action_for_nonce=' + encodeURIComponent('ajax-loading-nonce_' + getLocation(self.url).pathname.replace(/\//g, '-')) +
            '&nonce=' + encodeURIComponent(ajaxLoading.nonce) +
            '&form_method=' + encodeURIComponent(self.method);
        for (var key in self.formData) {
            var currentFormData = self.formData[key];
            if (typeof currentFormData == 'object') {
                var name = currentFormData.getAttribute('name');
                var value = encodeURIComponent(currentFormData.value);
                if (name) {
                    self.data += '&form_data[' + name + ']=' + value;
                }
            }
        }
    };

    self.ajaxRequest = function () {
        self.getRequestData();
        var request = new XMLHttpRequest();
        request.open('POST', ajaxLoading.url, true);
        request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        request.send(self.data);
        request.onload = function () {

            newHtml = JSON.parse(request.responseText).html;
            newNonce = JSON.parse(request.responseText).nonce;
            alActionForNonce = JSON.parse(request.responseText).al_action_for_nonce;
            newUrl = JSON.parse(request.responseText).new_url;

            // We reached our target server, but it returned an error
            // There was a connection error of some sort
            if (request.status >= 200 && request.status < 500) {
                // Success!
                self.insertPage(newHtml);
                window.scrollTo(0, 0);
            } else {
                // We reached our target server, but it returned an error
                self.insertPage('<h1>' + request.statusText + '</h1>');
            }
            request.onerror = function () {
                // There was a connection error of some sort
            };
        };
    };

    self.insertPage = function (html) {
        var newDoc = document.open("text/html", "replace");
        document.write(html);
        newDoc.close();
        window.history.pushState({}, "", newUrl);
    };
}

function hasClass(el, cl) {
    var regex = new RegExp('(?:\\s|^)' + cl + '(?:\\s|$)');
    return !!el.className.match(regex);
}

var cfClass = document.querySelector('meta[name=plugin_ajax-loading_options]').getAttribute('data-options_cf_form_class');

var forms = document.querySelectorAll('form');
for (var key in forms) {
    forms[key].onsubmit = function (e) {
        if (!hasClass(this, cfClass)) {
            e.preventDefault();
            var formObj = new AjaxLoadingForm(this);
            formObj.ajaxRequest();
        }
    };
}