'use strict';

function doDataMerge(withCommentsCsv, noCommentsCsv) {
    Promise.all([getAsText(withCommentsCsv), getAsText(noCommentsCsv)]).then(function(values) {
        var mergedCsvData = mergeCsvData(convertCsvWithComments(values[0]), convertCsvNoComments(values[1]));
        self.postMessage(formatMergedCsvData(mergedCsvData));
    });
}

function formatMergedCsvData(mergedCsvData) {
    var formattedData = [];
    //convert to an array
    for (var caseNumber in mergedCsvData) {
        if (typeof mergedCsvData[caseNumber].comments === 'undefined') {
            mergedCsvData[caseNumber].comments = [];
        }
        formattedData.push(mergedCsvData[caseNumber]);
    }

    return formattedData;
}

function mergeCsvData(csvData1, csvData2) {
    var mergedDataObject = {};
    for (var caseNumber in csvData1) {
        mergedDataObject[caseNumber] = csvData1[caseNumber];
    }

    for (var key in csvData2) {
        if (typeof mergedDataObject[key] !== 'undefined') {
            for (var column in csvData2[key]) {
                mergedDataObject[key][column] = csvData2[key][column];
            }
        } else {
            mergedDataObject[key] = csvData2[key];
        }
    }
    return mergedDataObject;
}

function getAsText(fileToRead) {
    var promise = new Promise(function(resolve, reject) {
        var reader = new FileReader();
        // Handle errors load
        reader.onload = function(event) {
            resolve(event.target.result);
        };
        // reader.onerror = errorHandler;
        // Read file into memory as UTF-8
        reader.readAsText(fileToRead);
    });
    return promise;
}

function convertCsvWithComments(withCommentsCsv) {
    var csvDataHash = {};
    var csvData = csvToArray(withCommentsCsv);
    for (var i = 1; i < csvData.length; i++) {
        var row = csvData[i];
        //let's assume case number is never empty or null
        if (typeof csvDataHash[row[0]] !== 'undefined') {
            // if not null
            if (returnEmpty(row[3]) !== null) {
                //push the comment in
                csvDataHash[row[0]].comments.push(row[3]);
            }
        } else {
            if (returnEmpty(row[0]) !== '') {
                //set it in the hash so as to avoid duplicates
                csvDataHash[row[0]] = {
                    caseNumber: row[0],
                    subject: returnEmpty(row[1]),
                    caseSubject: returnEmpty(row[2]),
                    comments: []
                };
                if (returnEmpty(row[3]) !== null) {
                    csvDataHash[row[0]].comments.push(row[3]);
                }
            }
        }
    }

    return csvDataHash;
}

function convertCsvNoComments(noCommentsCsv) {
    var convertedCsvData = [];
    var csvData = csvToArray(noCommentsCsv);
    // ["Region", "Account Name: Account Name", "Case Number", "Contact Name: Full Name", "Subject", "Status", "Description", "Type", "Version", "Planned Version #", "Support Consultant", "SpinifexIT Product Name", "SpinifexIT Product: SpinifexIT Product Name", "Date/Time Closed", "Performance Concern", "Idea #ID", "Case Reason", "Test Scenario ID", "CR #", "Parent Case: Case Number", "Priority"]0: "Region"1: "Account Name: Account Name"2: "Case Number"3: "Contact Name: Full Name"4: "Subject"5: "Status"6: "Description"7: "Type"8: "Version"9: "Planned Version #"10: "Support Consultant"11: "SpinifexIT Product Name"12: "SpinifexIT Product: SpinifexIT Product Name"13: "Date/Time Closed"14: "Performance Concern"15: "Idea #ID"16: "Case Reason"17: "Test Scenario ID"18: "CR #"19: "Parent Case: Case Number"20: "Priority"length: 21__proto__: Array[0]
    for (var i = 1; i < csvData.length; i++) {
        var row = csvData[i];
        convertedCsvData[row[2]] = {
            region: returnEmpty(row[0]),
            accountName: returnEmpty(row[1]),
            caseNumber: row[2],
            contactName: returnEmpty(row[3]),
            subject: returnEmpty(row[4]),
            status: returnEmpty(row[5]),
            description: returnEmpty(row[6]),
            type: returnEmpty(row[7]),
            version: returnEmpty(row[8]),
            plannedVersion: returnEmpty(row[9]),
            supportConsultant: returnEmpty(row[10]),
            spinifexItProductName: returnEmpty(row[11]),
            dateTimeClosed: returnEmpty(row[12]),
            performanceConcern: returnEmpty(row[13]),
            ideaNumberId: returnEmpty(row[14]),
            caseReason: returnEmpty(row[15]),
            testScenarioId: returnEmpty(row[16]),
            crNumber: returnEmpty(row[17]),
            parentCaseNumber: returnEmpty(row[18]),
            priority: returnEmpty(row[19]),
            requester_id: returnEmpty(row[3]),
            custom_fields: [{
                //region
                id: 35636347,
                value: returnEmpty(row[0])
            }, {
                //crNumber
                id: 35579928,
                value: returnEmpty(row[17]),
            }, {
                //testScenarioId
                id: 46639327,
                value: returnEmpty(row[16])
            }, {
                //ideaNumberId
                id: 46553348,
                value: returnEmpty(row[14])
            }]
        };
    }

    return convertedCsvData;
}

function processData(csv) {
    var allTextLines = csv.split(/\r\n|\n/);
    var lines = [];
    while (allTextLines.length) {
        lines.push(allTextLines.shift().split(','));
    }
    //set to the variable
    return lines;
}

function returnEmpty(data) {
    if (typeof data === 'undefined') {
        return '';
    }
    return data.replace(/""/g, '"');
}

// ref: http://stackoverflow.com/a/1293163/2343
// This will parse a delimited string into an array of
// arrays. The default delimiter is the comma, but this
// can be overriden in the second argument.
function csvToArray(strData, strDelimiter) {
    // Check to see if the delimiter is defined. If not,
    // then default to comma.
    strDelimiter = (strDelimiter || ",");

    // Create a regular expression to parse the CSV values.
    var objPattern = new RegExp(
        (
            // Delimiters.
            "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

            // Quoted fields.
            "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

            // Standard fields.
            "([^\"\\" + strDelimiter + "\\r\\n]*))"
        ),
        "gi"
    );


    // Create an array to hold our data. Give the array
    // a default empty first row.
    var arrData = [
        []
    ];

    // Create an array to hold our individual pattern
    // matching groups.
    var arrMatches = null;


    // Keep looping over the regular expression matches
    // until we can no longer find a match.
    while (arrMatches = objPattern.exec(strData)) {

        // Get the delimiter that was found.
        var strMatchedDelimiter = arrMatches[1];

        // Check to see if the given delimiter has a length
        // (is not the start of string) and if it matches
        // field delimiter. If id does not, then we know
        // that this delimiter is a row delimiter.
        if (
            strMatchedDelimiter.length &&
            strMatchedDelimiter !== strDelimiter
        ) {

            // Since we have reached a new row of data,
            // add an empty row to our data array.
            arrData.push([]);

        }

        var strMatchedValue;

        // Now that we have our delimiter out of the way,
        // let's check to see which kind of value we
        // captured (quoted or unquoted).
        if (arrMatches[2]) {

            // We found a quoted value. When we capture
            // this value, unescape any double quotes.
            strMatchedValue = arrMatches[2].replace(
                new RegExp("\"\"", "g"),
                "\""
            );

        } else {

            // We found a non-quoted value.
            strMatchedValue = arrMatches[3];

        }


        // Now that we have our value string, let's add
        // it to the data array.
        arrData[arrData.length - 1].push(strMatchedValue);
    }

    // Return the parsed data.
    return (arrData);
}

//the event listener for the worker to start working
self.addEventListener('message', function(ev) {
    //apply the arguments that we recieve from the caller
    doDataMerge.apply(self, ev.data);
}, false);
