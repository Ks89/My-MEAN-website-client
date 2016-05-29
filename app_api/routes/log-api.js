module.exports = function (express) {
	var app = express();
	var router = express.Router();

	var ctrlLogger = require('../controllers/logger');

	router.post('/logDebug', ctrlLogger.logError);
	router.post('/logError', ctrlLogger.logDebug);

	module.exports = router;
	return router;
};