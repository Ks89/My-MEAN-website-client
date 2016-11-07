'use strict';
process.env.NODE_ENV = 'test'; //before every other instruction

console.log("Starting with NODE_ENV=" + process.env.NODE_ENV);
console.log("process.env.CI is " + process.env.CI);

if(!process.env.CI || process.env.CI !== 'yes') {
  console.log("Initializing dotenv (requires .env file)")
  //to be able to use generateJwt I must import
  //dotenv (otherwise I cannot read process.env with the encryption key)
  require('dotenv').config();
}

var chai = require('chai');
var expect = chai.expect;

require('../app_server/models/users');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var passport = require('../app_server/controllers/authentication/passport');
var userId;

describe('passport', () => {

  before(done => {
    // Connecting to a local test database or creating it on the fly
    mongoose.connect('mongodb://localhost/test-db');
    User = mongoose.model('User');
    done();
  });

  describe('serializeUser and deserializeUser', () => {

    before(done => {
      var newUser = new User();
      newUser.save((err, savedUser) => {
        expect(err).to.be.null;
        userId = savedUser._id;
        done(err);
      });
    });

    describe('---YES---', () => {

      it('should check if the deserialized is correct', done => {
        // serialize
        // simply call the callback
        function mockedDoneSerialize(){};
        function serialize(user, mockedDoneSerialize) {
          mockedDoneSerialize();
        }

        // deserialize
        // call the callback with a userMock object
        // and check if _id is equals to the _id in my database
        // inserted by the `before` function
        var userMock = { id: '' };
        function mockedDoneDeserialize(err, userMock) {
          expect(userMock._id+"").to.be.equals(userId+"");
        };
        function deserialize(id, mockedDoneDeserialize) {
          mockedDoneDeserialize(null, id);
        }

        // create a passportRefMock (an object with come functions)
        // also `use`, because required by one `require` inside passport.js
        var passportRefMock = {
          serializeUser: function(serialize) { 
            // mocked serializeUser function
            serialize(userMock,mockedDoneSerialize);
          },
          deserializeUser: function(deserialize) { 
            // mocked deserializeUser function
            deserialize(userId,mockedDoneDeserialize);
          },
          use: function(strategy) {
            // mocked use function
          }
        }

        // call passport.js with the mocked infos
        // it will call done functions automatically, in particular
        // mockedDoneSerialize and mockedDoneDeserialize.
        // The first one is useless, but the second will check if the
        // userid in db is equals to the _id in the object, received by the function
        passport(passportRefMock);
        done();
      });

    });
    
    after(done => {
      User.remove({}, err => {
        console.log('collection removed')
        done(err);
      });
    });
  });
})
