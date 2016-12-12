'use strict';
var zendeskApiClient = require('./zendeskApiClient');


var exports = module.exports = {};

function handleError(err) {
    console.log(err);
}

exports.showAll = function(req, res) {
    zendeskApiClient.organizations.list(function(err, req, result) {
        if (err) {
            handleError(err);
            return res.status(500).json(err);
        }
        return res.status(200).json(result);
    });
};

exports.deleteOrganization = function(req, res) {
    var orgId = req.params.id;
    if (orgId !== '' && orgId !== null) {
        // console.log(orgId);
        // return res.status(200).json(req.params);
        zendeskApiClient.organizations.delete(orgId, function(err, req, result) {
            if (err) {
                handleError(err);
                return res.status(500).json(err);
            }
            return res.status(200).json(result);
        });

    } else {
        //error in input
        return res.status(200).send('invalid input please send array of json');
    }

};
