'use strict';

function httpGet(url) {
    var promise = new Promise(function(resolve, reject) {
        //create an instance of the xmlhttprequest object
        var xhr = new XMLHttpRequest();
        //open the request with a get request
        xhr.open('GET', url);
        //send the request
        xhr.send(null);
        xhr.responseType = 'json';
        xhr.onload = function() {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(xhr.response);
            } else {
                reject(xhr.statusText);
            }
        };
    });
    return promise;
}

function httpPost(url, data) {
    var promise = new Promise(function(resolve, reject) {
        //create an instance of the xmlhttprequest object
        var xhr = new XMLHttpRequest();
        //open the request with a get request
        xhr.open('POST', url, true);

        //let's send json to the api
        xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');

        xhr.onload = function() {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(xhr.response);
            } else {
                reject(xhr.statusText);
            }
        };
        //send the request
        xhr.send(JSON.stringify(data));
    });
    return promise;
}

function httpDelete(url) {
    var promise = new Promise(function(resolve, reject) {
        //create an instance of the xmlhttprequest object
        var xhr = new XMLHttpRequest();
        //open the request with a get request
        xhr.open('DELETE', url, true);

        //let's send json to the api
        // xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
        xhr.responseType = 'json';
        xhr.onload = function() {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(xhr.response);
            } else {
                reject(xhr.statusText);
            }
        };
        //send the request
        xhr.send(null);
    });
    return promise;
}
