// 'use strict';
// process.env.NODE_ENV = 'test'; //before every other instruction
//
// var expect = require('chai').expect;
// var app = require('../app');
// var agent = require('supertest').agent(app);
// var async = require('async');
//
// // testing services
// const URL_DESTROY_SESSION = '/api/testing/destroySession';
// const URL_SET_STRING_SESSION = '/api/testing/setStringSession';
// const URL_SET_JSON_WITHOUT_TOKEN_SESSION = '/api/testing/setJsonWithoutTokenSession';
// const URL_SET_JSON_WITH_WRONGFORMAT_TOKEN_SESSION = '/api/testing/setJsonWithWrongFormatTokenSession';
// const URL_SET_JSON_WITH_EXPIRED_DATE_SESSION = '/api/testing/setJsonWithExpiredDateSession';
//
// describe('testing-api', () => {
//   //useful function that prevent to copy and paste the same code
//   function getPartialGetRequest (apiUrl) {
//     return agent
//     .get(apiUrl)
//     .set('Content-Type', 'application/json')
//     .set('Accept', 'application/json');
//   }
//
//   // FIXME: attention, these tests are ok, but the status code should be 404 NOT FOUND
//   // HTTP specifications says: `The server has not found anything matching the
//   //    Request-URI. No indication is given of whether the condition is temporary
//   //    or permanent.`
//   // This means that when I'm calling unexisting rest services I should get a 404.
//
//   // At the moment I'm receiving 403 due to a bug.
//   // For more info check this issue: https://github.com/Ks89/My-MEAN-website/issues/45
//
//   describe('calling testing rest services with a NODE_ENV !== test', () => {
//     describe('---ERRORS---', () => {
//       const sessionModifierUrls = [
//         URL_DESTROY_SESSION,
//         URL_SET_STRING_SESSION,
//         URL_SET_JSON_WITHOUT_TOKEN_SESSION,
//         URL_SET_JSON_WITH_WRONGFORMAT_TOKEN_SESSION,
//         URL_SET_JSON_WITH_EXPIRED_DATE_SESSION
//       ];
//       for(let i=0; i<sessionModifierUrls.length; i++) {
//         it(`should get 403 FORBIDDEN, because testing services are available only if NODE_ENV === test.
//               Instead you are running this test with NODE_ENV = ${process.env.NODE_ENV}
//               Test i=${i} with ${sessionModifierUrls[i]}`, done => {
//             getPartialGetRequest(sessionModifierUrls[i])
//             .send()
//             .expect(403)
//             .end((err, res) => {
//               expect(res.body.message).to.be.equal('No token provided');
//               done(err, res);
//             });
//           });
//         }
//       });
//     });
//   });
