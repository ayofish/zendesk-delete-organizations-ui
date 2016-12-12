'use strict';
(function(window, document) {

    function onClickImport() {
        var worker = new Worker('js/csvWorker.js');
        var noCommentsCsv = document.getElementById('inputcsv').files[0];
        var withCommentsCsv = document.getElementById('inputcsvwithcomments').files[0];
        worker.postMessage([withCommentsCsv, noCommentsCsv]);
        //listen to the event when the worker finishes the parsing of the csv files
        worker.addEventListener('message', function(ev) {
            //formatted tickets data
            var ticketArr = ev.data;
            //let's send it to the server
            //let's break it up into chunks
            var i, j, temparray, chunk = 100;
            for (i = 0, j = ticketArr.length; i < j; i += chunk) {
                temparray = ticketArr.slice(i, i + chunk);
                // createTickets(temparray);
                // do whatever
            }

            createTickets([ticketArr[0]]);
        }, false);
    }

    function createTickets(ticketArr) {
        httpPost('/tickets', ticketArr).then(function(data) {
            console.log(data);
        });
    }

    function onLoad() {
        // document.getElementById('inputcsv').addEventListener('change', onChangeFileInput, false);
        document.getElementById('importbutton').addEventListener('click', onClickImport, false);
    }

    function onChangeFileInput(event) {
        if (typeof event.target.files[0] !== 'undefined') {
            var fileInput = event.target.files[0];
            //update the text beside the button for file input
            getAsText(fileInput);
        }
    }

    function getAsText(fileToRead) {
        if (window.FileReader) {
            var reader = new FileReader();
            // Handle errors load
            reader.onload = loadHandler;
            reader.onerror = errorHandler;
            // Read file into memory as UTF-8
            reader.readAsText(fileToRead);
        } else {
            alert('FileReader are not supported in this browser.');
        }
    }

    function loadHandler(event) {
        var csv = event.target.result;
        processData(csv);
    }

    function processData(csv) {
        var allTextLines = csv.split(/\r\n|\n/);
        var lines = [];
        while (allTextLines.length) {
            lines.push(allTextLines.shift().split(','));
        }
        console.log(lines);
        //set to the variable
        drawOutput(lines);
    }

    function errorHandler(evt) {
        if (evt.target.error.name == 'NotReadableError') {
            alert('Canno\'t read file !');
        }
    }

    function drawOutput(lines) {
        //Clear previous data
        document.getElementById('output').innerHTML = '';
        var table = document.createElement('table');
        for (var i = 0; i < lines.length; i++) {
            var row = table.insertRow(-1);
            for (var j = 0; j < lines[i].length; j++) {
                var firstNameCell = row.insertCell(-1);
                firstNameCell.appendChild(document.createTextNode(lines[i][j]));
            }
        }
        document.getElementById('output').appendChild(table);
    }

    //listener for window load event
    window.addEventListener('DOMContentLoaded', onLoad, false);

})(window, document);
