// 'user strict';
// // var express = require('express');
// // var bodyParser = require('body-parser');
// var request = require('supertest');  

// var chai = require('chai');
// var expect = chai.expect;

// // var _und = require('underscore');
// //var cheerio = require('cheerio')

// var appFile       = require('../app')
// var agent     = request.agent(appFile);

// //app.use(bodyParser.json());

// describe('log-api', function() {
//   var csrfToken, connectsid;

//   it('should correctly update an existing account', function(done){
//     var body = {
//       "message" : "sdadasdas"    
//     };

//     agent
//     .post('/api/log/debug')
//         //.use(csrf1)
//         //.set('set-cookie', ['connect.sid=' + 's%3ABKQTG0b5t9BO9mCkf-OjAXlOE9Uj8OUi.F4bUqdkdYlrVUShzNqR1o7FR%2FK0SPkUpbMuxD2hDsbc'])
//         //.set('XSRF-TOKEN', '1rbV8plj-AzgMcBICuGFrtXFghu-K1lw3pK8') //set header for this test
//         .set('Content-Type', 'application/json') //set header for this test
//         //.set('Accept', 'application/json')
//         .send(body)
//         //.expect(200) //Status code
//         // end handles the response
//         .end(function(err, res) {
//          console.log("called");
//          if (err) {
//            console.log(err);
//            return done(err);
//          } else {
//           console.log("---res.body---");
//           console.log(res.body);
//           console.log("--------------");

//           expect(res.body.message).to.contain("debug logged on server");

//         }
//         done();  

//       });


//         // agent
//         // .get('/api/projecthome')
//         // //.use(csrf1)
//         // //.set('set-cookie', ['connect.sid=' + 's%3ABKQTG0b5t9BO9mCkf-OjAXlOE9Uj8OUi.F4bUqdkdYlrVUShzNqR1o7FR%2FK0SPkUpbMuxD2hDsbc'])
//         // //.set('XSRF-TOKEN', '1rbV8plj-AzgMcBICuGFrtXFghu-K1lw3pK8') //set header for this test
//         // .set('Content-Type', 'application/json') //set header for this test
//         // //.set('Accept', 'application/json')
//         // .send(body)
//         // //.expect(200) //Status code
//         // // end handles the response
//         // .end(function(err, res) {
//         //  console.log("called");
//         //  if (err) {
//         //    console.log(err);
//         //    return done(err);
//         //  } else {
//         //   console.log("res.body");
//         //   console.log(res);
//         //   //alert('yay got ' + JSON.stringify(res.body));

//         //   //expect(res.body).to.contain("debuglogged on server");

//         //  }
//         //  done();  

//         // });
//       // });
//     });
// });