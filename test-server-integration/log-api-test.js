var should = require('should'); 
var assert = require('assert');
var request = require('supertest');  

var cheerio = require('cheerio')

var app       = require('../app')
var agent     = request.agent(app);

// describe('Login', function () {
//   it('should login superadmin', function(done) {

  
    
//   });
// });

// // function extractCsrfToken (res) {
// //   var $ = cheerio.load(res.text);
// //   return $('[name=_csrf]').val();
// // }


describe('log-api', function() {
  var url = 'http://localhost:3000';
  // within before() you can run all the operations that are needed to setup your tests. In this case
  // I want to create a connection with the database, and when I'm done, I call done().
  //before(function(done) {
    // In our tests we use the test db
    //mongoose.connect(config.db.mongodb);							
  // done();
  //});
  // use describe to give a title to your test suite, in this case the tile is "Account"
  // and then specify a function in which we are going to declare all the tests
  // we want to run. Each test starts with the function it() and as a first argument 
  // we have to provide a meaningful title for it, whereas as the second argument we
  // specify a function that takes a single parameter, "done", that we will use 
  // to specify when our test is completed, and that's what makes easy
  // to perform async test!
  var csrfToken;

  it('should correctly update an existing account', function(done){

    //var req = request( app ).get( '/login' )
    //agent.attachCookies(req);

    agent
      .get('/login')
      //.type('form')
      //.send({ name: 'name' })
      //.send({ email: 'email' })
      //.send({ password: 'password' })
      //.expect(403)
      //.expect('Location', '/')
      //.expect('set-cookie', /connect.sid/)
      .end(function(err, res) {
        if (err) return done(err);
        //agent.attachCookies(res);
        agent.saveCookies(res);
        csrfToken = res.headers['set-cookie'][0].split('=')[1].split(';')[0];
        console.log(csrfToken);
        //var $ = cheerio.load(res);


          var body = {
      
            "message" : "sdadasdas"
    
        
            };
          // once we have specified the info we want to send to the server via POST verb,
          // we need to actually perform the action on the resource, in this case we want to 
          // POST on /api/profiles and we want to send some info
          // We do this using the request object, requiring supertest!


          agent
          .post('/api/debug')
          .set('set-cookie', ['connect.sid=' + csrfToken])
          //.set('XSRF-TOKEN', csrfToken) //set header for this test
          .set('Content-Type',  'application/json') //set header for this test
          .send(body)
          .expect(200) //Status code
          // end handles the response
          .end(function(err, res) {
             console.log("called");
            if (err) {
               console.log(err);
              return done(err);
            }
            // this is should.js syntax, very clear
            //res.body.should.have.property('message');
            done();
          });

        //console.log($);

        //var csrf = $('[name=XSRF-TOKEN]').val();

        //console.log(csrf);
        //console.log("agent:");
        //console.log(agent);
        //console.log("agent cookies:" + agent.getCookies);
        //return done();
      });


    // session.get('/register')
    //   .end(function (err, res) {
    //     if (err) return done(err);
    //     csrfToken = extractCsrfToken(res);
    //     done();
    //   });
  });

  //describe('/api/log/debug', function() {
  //   it('should log a debug message on server', function(done) {
  //     var body = {
      
  //         "message" : "sdadasdas"
    
        
  //     };
  //   // once we have specified the info we want to send to the server via POST verb,
  //   // we need to actually perform the action on the resource, in this case we want to 
  //   // POST on /api/profiles and we want to send some info
  //   // We do this using the request object, requiring supertest!


  //   agent
  //   .post('/api/debug')
  //   //.set('set-cookie', ['connect.sid=' + csrfToken])
  //   //.set('XSRF-TOKEN', csrfToken) //set header for this test
  //   .set('Content-Type',  'application/json') //set header for this test
  //   .send(body)
  //   .expect(200) //Status code
  //   // end handles the response
  //   .end(function(err, res) {
  //      console.log("called");
  //     if (err) {
  //        console.log(err);
  //       return done(err);
  //     }
  //     // this is should.js syntax, very clear
  //     //res.body.should.have.property('message');
  //     done();
  //   });
  // });
 //    it('should correctly update an existing account', function(done){
 //     var body = {
 //      firstName: 'JP',
 //      lastName: 'Berd'
 //    };
 //    request(url)
 //    .put('/api/profiles/vgheri')
 //    .send(body)
 //    .expect('Content-Type', /json/)
	// 	.expect(200) //Status code
	// 	.end(function(err,res) {
	// 		if (err) {
	// 			throw err;
	// 		}
	// 		// Should.js fluent syntax applied
	// 		res.body.should.have.property('_id');
 //     res.body.firstName.should.equal('JP');
 //     res.body.lastName.should.equal('Berd');                    
 //     res.body.creationDate.should.not.equal(null);
 //     done();
 //   });
	// });
  });
//});