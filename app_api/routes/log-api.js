var express = require('express');
var app = express();
var router = express.Router();

var ctrlLogger = require('../controllers/logger');

router.get('/logError/:message', ctrlLogger.logError);
router.post('/logDebug', ctrlLogger.logDebug);

module.exports = router;