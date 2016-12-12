var express = require('express');
var router = express.Router();
var api = require('../api/tickets');


/* POST ticket/tickets. */
router.post('/', api.createTickets);

module.exports = router;
