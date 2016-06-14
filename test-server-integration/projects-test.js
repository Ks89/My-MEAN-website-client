'user strict';
var expect = require('chai').expect;
var app = require('../app');
var agent = require('supertest').agent(app);

describe('projects', function() {
	var csrfToken, connectsid;

	it('should correctly get projects', function(done) {

		agent
		.get('/api/projects')
    .set('Content-Type', 'application/json') //set header for this test
    .set('Accept', 'application/json')
    .expect(200) //Status code
    // end handles the response
    .end(function(err, res) {
    	console.log("called");
    	if (err) {
    		console.log(err);
    		return done(err);
    	} else {
    		console.log("---res.body---");
    		console.log(res.body);
    		console.log("--------------");

    		expect(res.body[0].name).to.be.equals('SPF');
    		expect(res.body[1].name).to.be.equals('BYAManager');
    		expect(res.body[2].name).to.be.equals('Superapp');
    	}
    	done();  
    });
	});
});