module.exports = function (express) {
	var app = express();
	var router = express.Router();

	var ctrlLogger = require('../controllers/logger');

	router.post('/logDebug', ctrlLogger.logDebug);
	router.post('/logError', ctrlLogger.logError);

	module.exports = router;
	return router;
};