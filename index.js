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
        'var scriptId="' + scriptId + '";' +
        'var promise = {'+
            'status: 0,' +
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
                'this._dispatch(this.successCb, arg);' +
            '},' +
            'reject: function(err) {' +
                'this.status = 2;' +
                'this._dispatch(this.failureCb, err);' +
            '},' +
            '_listen: function(cbList, cb, status) {' +
                'cbList.push(cb);' +
                'if(this.status === status) {' +
                    'this._dispatch(cbList, arg);' +
                '}' +
            '},' +
            'then: function(cb) {' +
                'this._listen(this.successCb, cb);' +
            '},' +
            'catch: function(cb) {' +
                'this._listen(this.failureCb, cb);' +
            '}' +
        '};' +
        'var loaded = function() {};' +
        'if(!document.getElementById(scriptId)) {' +
            'var blob = new Blob([' + codeString + ']);' +
            'var script = document.createElement("script");' +
            'var url = URL.createObjectURL(blob);' +
            'var revoqueUrl = function() {URL.revokeObjectURL(url);};' +
            'script.onerror = revoqueUrl;' +
            'script.onload = function(){' +
                'revoqueUrl();' +
                'promise.resolve()' +
            '};' +
            'script.id = scriptId;' +
            'script.async = true;' +
            'script.src = url;' +
            'document.body.appendChild(script);' +
        '} else {' +
            'promise.resolve()' +
        '}' +
        'module.exports=promise;';

    return result;
};
