'use strict';
var zendeskApiClient = require('./zendeskApiClient');

var exports = module.exports = {};

// function respondWithResult(res, statusCode) {
//     statusCode = statusCode || 200;
//     return function(entity) {
//         if (entity) {
//             res.status(statusCode).json(entity);
//         }
//     };
// }

// function handleError(res, statusCode) {
//     statusCode = statusCode || 500;
//     return function(err) {
//         res.status(statusCode).send(err);
//     };
// }

function handleError(err) {
    console.log(err);
    process.exit(-1);
}

exports.createTickets = function(req, res) {
    var ticketsData = req.body;

    if (Array.isArray(ticketsData)) {
        //test case only
        var testTicket = {
            ticket: {
                requester_id: 16138887167,
                subject: 'ticket test subject',
                custom_fields: [{
                    //crNumber
                    id: 35579928,
                    value: 35579928,
                }, {
                    //testScenarioId
                    id: 46639327,
                    value: 'test scenario id'
                }, {
                    //ideaNumberId
                    id: 46553348,
                    value: 'idea number id'
                }],
                comment: {
                    body: 'test comment'
                },
                assignee_id: 'Nestor Angelo Gimenez'
            }
        };
        zendeskApiClient.tickets.create(testTicket, function(err, req, result) {
            if (err) {
                return handleError(err);
            }
            //gets the first page
            return res.status(201).json(result);
        });
        /*
        return res.status(201).json(req.body);
        zendeskApiClient.tickets.show(2 ,function(err, req, result) {
            if (err) {
                console.log(err);
                return;
            }
            // console.log(JSON.stringify(result)); //gets the first page
            return res.status(201).json(result);
        });
        // return res.status(201).json(req.body);
        */
        for (var i = 0; i < ticketsData.length; i++) {
            // console.log(ticketsData[i]);
            // zendeskApiClient.tickets.create(ticketsData[i], function(err, req, result) {
            //     if (err) {
            //         return handleError(err);
            //     }
            //      //gets the first page
            //     return res.status(201).json(result);
            // });
        }
        // return res.status(201).json(ticketsData);

        // zendeskApiClient.TicketImport.import(ticketsData, function(err, req, result){

        // });
    } else {
        //error in input
        return res.status(200).send('invalid input please send array of json');
    }

};
