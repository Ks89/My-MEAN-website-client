'user strict';
var expect = require('chai').expect;
var app = require('../app');
var agent = require('supertest').agent(app);

var User;
var mongoose = require('mongoose');
require('../app_server/models/users');

var user;

describe('users', () => {
	describe('---YES---', () => {

		beforeEach(done => {
			// Connecting to a local test database or creating it on the fly
			mongoose.connect('mongodb://localhost/test-db');
			User = mongoose.model('User');
			user = new User();
			user.local.name = 'username';
			user.local.email = 'email@email.it';
			user.setPassword('Password1');
      user.save((err, usr) => {
      	user._id = usr._id;
      	done(err);
      });
  });

		it('should correctly login', done => {

			const loginMock = {
				email : user.local.email,
	      password : 'Password1'
			};

			agent
			.get('/login')
			.expect(200)
			.end((err1, res1) => {
				if(err1) {
					return done(err);
				} else {
					console.log(res1);
					
     			var csrftoken = (res1.headers['set-cookie']).filter(value =>{
     				console.log(value);
     				return value.includes('XSRF-TOKEN');
     			})[0];
     			var connectionSid = (res1.headers['set-cookie']).filter(value =>{
     				return value.includes('connect.sid');
     			})[0];
        	// var connectionSid = unescape(/connect.sid=(.*?);/.exec(res1.headers['set-cookie'])[1]);

        	csrftoken = csrftoken.split(';')[0].replace('XSRF-TOKEN=','');
					connectionSid = connectionSid.split(';')[0].replace('connect.sid=','');
        	
        	loginMock._csrf = csrftoken;

        	console.log(res1.headers['set-cookie']);

        	console.log(csrftoken);
        	console.log(connectionSid);
        	

					agent
					.post('/api/login')
					.set('Content-Type', 'application/json')
					.set('Accept', 'application/json')
					.set('set-cookie', 'connect.sid=' + connectionSid)
					.set('set-cookie', 'XSRF-TOKEN=' + csrftoken)
					.set('XSRF-TOKEN', csrftoken) //set header for this test
					.send(loginMock)
					.expect(200)
					.end((err, res) => {
						if (err) {
							return done(err);
						} else {
							let token = res.body.token;
							
							console.log("token: " + token);

						  done(err);
						}
					});
				}
			});
		});

		afterEach(done => {
			// User.remove({}, err => { 
			// 	console.log('collection removed') 
			 	done();
			// });
		});
	});


	describe('---ERRORS---', () => {
		//TODO
	});
});