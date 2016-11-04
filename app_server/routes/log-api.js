// ------------- imported from app.js ---------------
module.exports = function (express) {
	var app = express();
	var router = express.Router();

	var ctrlLogger = require('../controllers/logger');

	router.post('/debug', ctrlLogger.debug);
	router.post('/error', ctrlLogger.error);
	router.post('/exception', ctrlLogger.exception);

	module.exports = router;
	return router;
};
