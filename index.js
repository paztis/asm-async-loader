/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Jerome HENAFF @paztis
*/
var md5 = require('md5');

module.exports = function (content) {
    this.cacheable && this.cacheable();
    this.value = content;

    var scriptId = md5(content);

    var codeString = JSON.stringify(content)
        .replace(/\u2028/g, '\\u2028')
        .replace(/\u2029/g, '\\u2029');

    var result =
        'var returnedPromise;' +
        'var scriptId="' + scriptId + '";' +
        'var script = document.getElementById(scriptId);' +
        'if(!script) {' +
            // Create a promise-like structure in case of old browsers
            'returnedPromise = {'+
                'status: 0,' +
                'arg: null,' +
                'successCb: [],' +
                'failureCb: [],' +
                '_dispatch: function(cbList, arg) {' +
                    'var cb;' +
                    'while(cbList.length) {' +
                        'cb = cbList.shift();' +
                        'cb && cb(arg);' +
                    '}' +
                '},' +
                'resolve: function(arg) {' +
                    'this.status = 1;' +
                    'this.arg = arg;' +
                    'this._dispatch(this.successCb, arg);' +
                '},' +
                'reject: function(err) {' +
                    'this.status = 2;' +
                    'this.arg = err;' +
                    'this._dispatch(this.failureCb, err);' +
                '},' +
                '_listen: function(cbList, cb, status) {' +
                    'cbList.push(cb);' +
                    'if(this.status === status) {this._dispatch(cbList, this.arg);}' +
                '},' +
                'then: function(cb) {' +
                    'this._listen(this.successCb, cb, 1);' +
                '},' +
                'catch: function(cb) {' +
                    'this._listen(this.failureCb, cb, 2);' +
                '}' +
            '};' +

            // Blob url management
            'var blob = new Blob([' + codeString + ']);' +
            'var url = URL.createObjectURL(blob);' +
            'var revoqueUrl = function() {URL.revokeObjectURL(url);};' +

            'script = document.createElement("script");' +
            // On script error loading
            'script.onerror = function(){' +
                'revoqueUrl();' +
                'returnedPromise.reject()' +
            '};' +
            // On script success loading
            'script.onload = function(){' +
                'revoqueUrl();' +
                'returnedPromise.resolve()' +
            '};' +
            'script.loadingPromise = returnedPromise;' + // Store the promise in the scipt
            'script.id = scriptId;' +
            'script.async = true;' + // Set the script async
            'script.src = url;' +
            'document.body.appendChild(script);' +
        '} else {' +
            'returnedPromise = script.loadingPromise;' +
        '}' +
        'module.exports=returnedPromise;';

    return result;
};
