// ------------- imported from ./index.js ---------------

module.exports = function (router) {
  var ctrlTesting = require('../controllers/testing');

  // -----------------------------------------------------------------------------------------
  // -----------------------------------------------------------------------------------------
  // -----------------------------------------------------------------------------------------
  // 					 all these routes are authenticated because declared
  //           after the authentication middleware inside ./index.js
  // -----------------------------------------------------------------------------------------
  // -----------------------------------------------------------------------------------------
  // -----------------------------------------------------------------------------------------

  router.get('/destroySession', ctrlTesting.destroySession);
  router.get('/setStringSession', ctrlTesting.setStringSession);
  router.get('/setJsonWithoutTokenSession', ctrlTesting.setJsonWithoutTokenSession);
  router.get('/setJsonWithWrongFormatTokenSession', ctrlTesting.setJsonWithWrongFormatTokenSession);
  router.get('/setJsonWithExpiredDateSession', ctrlTesting.setJsonWithExpiredDateSession);

	module.exports = router;
	return router;
};
