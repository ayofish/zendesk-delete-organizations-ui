'use strict';
var zendesk = require('node-zendesk');
//initialize the zendesk client to connect with the api
var client = zendesk.createClient({
    //username
    username: '',
    //api token
    token: '',
    //zendesk api url
    remoteUri: ''
});

module.exports = client;