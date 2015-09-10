function AjaxForm(form) {
    var self = this;
    self.form = form;
    self.action = self.form.getAttribute('action');
    self.method = self.form.getAttribute('method').toUpperCase();
    self.formData = form.querySelectorAll('*');

    self.getRequestData = function () {
        self.data = '';
        for (var key in self.formData) {
            var currentFormData = self.formData[key];
            if (typeof currentFormData == 'object') {
                var name = currentFormData.getAttribute('name');
                var value = currentFormData.value;
                if (name) {
                    self.data += name + '=' + value + '&';
                }
            }
        }
        self.data = self.data.substring(0, self.data.length - 1);
    };

    self.getDataQueryByMethod = function () {
        self.getRequestData();
        if (self.method == 'GET') {
            self.url = self.action + '?' + self.data;
            self.requestSendData = '';
        } else if (self.method == 'POST') {
            self.url = self.action;
            self.requestSendData = self.data;
        }
    };

    self.ajaxRequest = function () {
        self.getDataQueryByMethod(self.requestSendData);
        var request = new XMLHttpRequest();
        request.open(self.method, self.url, true);
        request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        request.send(self.requestSendData);
        request.onload = function () {

            // We reached our target server, but it returned an error
            // There was a connection error of some sort
            if (request.status >= 200 && request.status < 400) {
                // Success!
                self.insertPage(request.responseText);
                window.scrollTo(0, 0);
            } else {

            }
            request.onerror = function () {

            };
        };
    };

    self.insertPage = function (html) {
        var newDoc = document.open("text/html", "replace");
        document.write(html);
        newDoc.close();
        window.history.pushState({}, "", self.url);
    };
}

var forms = document.querySelectorAll('form');
for (var key in forms) {
    forms[key].onsubmit = function (e) {
        e.preventDefault();
        var formObj = new AjaxForm(this);
        formObj.ajaxRequest();
    };
}