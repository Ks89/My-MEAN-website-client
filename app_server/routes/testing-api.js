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

  router.get('/testing/destroySession', ctrlTesting.destroySession);
  router.get('/testing/setStringSession', ctrlTesting.setStringSession);
  router.get('/testing/setJsonWithoutTokenSession', ctrlTesting.setJsonWithoutTokenSession);
  router.get('/testing/setJsonWithWrongFormatTokenSession', ctrlTesting.setJsonWithWrongFormatTokenSession);
  router.get('/testing/setJsonWithExpiredDateSession', ctrlTesting.setJsonWithExpiredDateSession);

	module.exports = router;
	return router;
};
