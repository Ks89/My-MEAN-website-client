// 'user strict';
//process.env.NODE_ENV = 'test'; //before every other instruction
//
// var expect = require('chai').expect;
// var app = require('../app');
// var agent = require('supertest').agent(app);

// var User;
// var mongoose = require('mongoose');
// require('../app_server/models/users');

// var user;
// var mockedProfilePost;

// describe('users', () => {
// 	describe('---YES---', () => {

// 		beforeEach(done => {
// 			// Connecting to a local test database or creating it on the fly
// 			mongoose.connect('mongodb://localhost/test-db');
// 			User = mongoose.model('User');

// 			//fill db with some test data
// 			user = new User();
// 			user.local.name = 'username';
// 			user.local.email = 'email@email.it';
// 			user.setPassword('Password1');
// 		  	user.github.id = '1231232';
// 		  	user.github.token = 'TOKEN';
// 		  	user.github.email = 'email@email.it';
// 		  	user.github.name = 'username';
// 		  	user.github.username = 'username';
// 		  	user.github.profileUrl = 'http://fakeprofileurl.com/myprofile';
// 		  	user.profile = {
// 	      	name : 'usernameUpdated',
// 	      	surname : 'surnameUpdated',
// 	      	nickname : 'nicknameUpdated',
// 	      	email : 'email@emailprofile.it',
// 	      	updated : new Date(),
// 	      	visible : true
//      	}

//       user.save((err, prj) => {
//       	user._id = prj._id;
//       	done(err);
//       });
//     });

// 		it('should correctly update the profile by github id', done => {

// 			//FIXME

// 			mockedProfilePost = {
// 	    	localUserEmail: "",
// 	    	id: user.github.id,
// 	    	serviceName: "github",
// 	    	name: user.profile.name,
// 	    	surname: user.profile.surname,
// 	    	nickname: user.profile.nickname,
// 	    	email: user.profile.email
// 	    };

// 			agent
// 			.post('/api/profile')
// 			.set('Content-Type', 'application/json')
// 			.set('Accept', 'application/json')
// 			.send(mockedProfilePost)
// 			.expect(200)
// 			.end((err, res) => {
// 				if (err) {
// 					return done(err);
// 				} else {
// 					let usr = res.body;
					
// 					console.log(usr);

// 					done(err);
// 				}
// 			});
// 		});

// 		afterEach(done => {
// 			User.remove({}, err => { 
// 				console.log('collection removed') 
// 				done(err);
// 			});
// 		});
// 	});


// 	describe('---ERRORS---', () => {
// 		//here there are some test with empty user, because I destroyed the db 
// 		//in the afterEach above.
		
// 		it('should catch 404 not found and check the error message', done => {
// 			//TODO 
// 		});
// 	});
// });