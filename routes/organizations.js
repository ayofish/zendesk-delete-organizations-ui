var express = require('express');
var router = express.Router();
var api = require('../api/organizations');


/* POST ticket/tickets. */
router.get('/', api.showAll);
router.delete('/:id', api.deleteOrganization);

module.exports = router;
