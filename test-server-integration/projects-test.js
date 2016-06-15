'user strict';
var expect = require('chai').expect;
var app = require('../app');
var agent = require('supertest').agent(app);

var Project;
var mongoose = require('mongoose');
require('../app_server/models/projects');

var project;
var project2;

describe('projects', () => {
	describe('---YES---', () => {

		beforeEach(done => {
			// Connecting to a local test database or creating it on the fly
			mongoose.connect('mongodb://localhost/test-db');
			Project = mongoose.model('Project');

			//fill db with some test data
			project = new Project();
			project.name = 'MockedProject';
			project.url = 'fakeUrl';
			project.description = 'fakeDescription';
			project.license = 'fakeLicense';
			project.visible = true;
			project.gallery = {
				thumb: 'fakeThumbPath',
				img: 'fakeImgPath',
				description: 'glleryFakeDescription'
			};
			project.authors = {
				name: 'name',
				surname: 'surname',
				url: 'url',
				urlAvailable: true
			};

			project2 = new Project();
			project2.name = 'MockedProject2';
			project2.url = 'fakeUrl2';
			project2.description = 'fakeDescription2';
			project2.license = 'fakeLicense2';
			project2.visible = false;
			project2.gallery = {
				thumb: 'fakeThumbPath2',
				img: 'fakeImgPath2',
				description: 'glleryFakeDescription2'
			};
			project2.authors = {
				name: 'name2',
				surname: 'surname2',
				url: 'url2',
				urlAvailable: false
			};
			project2.projectHomeView = {
				carouselImagePath: 'fakeCarouselPath2'
		    // carouselText: 'fakeText2',
		    // thumbImagePath: 'fakeThumbPath2',
		    // thumbText: 'fakeText2',
		    // bigThumbImagePath: 'fakeBigThumbPath2',
		    // bigThumbText: 'fakeText2'
		  };
		  project.save((err, prj) => {
		  	if(err) {
		  		done(err);
		  	}
		  	project._id = prj._id;

		  	project2.save((err2, prj2) => {
		  		project2._id = prj2._id;
		  		done(err2);
		  	});
		  });
		});

		it('should correctly get a list of project', done => {
			agent
			.get('/api/projects')
	    .set('Content-Type', 'application/json') //set header for this test
	    .set('Accept', 'application/json')
	    .expect(200)
	    .end((err, res) => {
	    	if (err) {
	    		return done(err);
	    	} else {
	    		expect(res.body).to.be.not.null;
	    		expect(res.body).to.be.not.undefined;
	    		expect(res.body.length).to.be.equals(2);

	    		var prjToCheck;
	    		for(let prj of res.body) {
	    			if(prj.name === project.name) {
	    				prjToCheck = project;
	    			} else if(prj.name === project2.name) {
	    				expect(prj.projectHomeView.carouselImagePath).to.be.equals(project2.projectHomeView.carouselImagePath);
	    				expect(prj.projectHomeView.carouselText).to.be.equals(project2.projectHomeView.carouselText);
	    				expect(prj.projectHomeView.thumbImagePath).to.be.equals(project2.projectHomeView.thumbImagePath);
	    				expect(prj.projectHomeView.thumbText).to.be.equals(project2.projectHomeView.thumbText);
	    				expect(prj.projectHomeView.bigThumbImagePath).to.be.equals(project2.projectHomeView.bigThumbImagePath);
	    				expect(prj.projectHomeView.bigThumbText).to.be.equals(project2.projectHomeView.bigThumbText);
	    				prjToCheck = project2;
	    			} else {
	    				throw 'No project found';
	    			}

	    			expect(prj.name).to.be.equals(prjToCheck.name);
	    			expect(prj.url).to.be.equals(prjToCheck.url);
	    			expect(prj.description).to.be.equals(prjToCheck.description);
	    			expect(prj.license).to.be.equals(prjToCheck.license);
	    			expect(prj.visible).to.be.equals(prjToCheck.visible);
	    			expect(prj.gallery.thumb).to.be.equals(prjToCheck.gallery.thumb);
	    			expect(prj.gallery.img).to.be.equals(prjToCheck.gallery.img);
	    			expect(prj.gallery.description).to.be.equals(prjToCheck.gallery.description);
	    			expect(prj.authors.name).to.be.equals(prjToCheck.authors.name);
	    			expect(prj.authors.surname).to.be.equals(prjToCheck.authors.surname);
	    			expect(prj.authors.url).to.be.equals(prjToCheck.authors.url);
	    			expect(prj.authors.urlAvailable).to.be.equals(prjToCheck.authors.urlAvailable);
	    		}
	    		done(err);
	    	}
	    });
	  });


		it('should correctly get a list of projects that contains carouselImagePath', done => {
			agent
			.get('/api/projecthome')
	    .set('Content-Type', 'application/json') //set header for this test
	    .set('Accept', 'application/json')
	    .expect(200)
	    .end((err, res) => {
	    	if (err) {
	    		return done(err);
	    	} else {
	    		expect(res.body).to.be.not.null;
	    		expect(res.body).to.be.not.undefined;
	    		expect(res.body.length).to.be.equals(1);

	    		var prjToCheck;
	    		for(let prj of res.body) {
	    			if(prj.name === project2.name) {
	    				expect(prj.projectHomeView.carouselImagePath).to.be.equals(project2.projectHomeView.carouselImagePath);
	    				expect(prj.projectHomeView.carouselText).to.be.equals(project2.projectHomeView.carouselText);
	    				expect(prj.projectHomeView.thumbImagePath).to.be.equals(project2.projectHomeView.thumbImagePath);
	    				expect(prj.projectHomeView.thumbText).to.be.equals(project2.projectHomeView.thumbText);
	    				expect(prj.projectHomeView.bigThumbImagePath).to.be.equals(project2.projectHomeView.bigThumbImagePath);
	    				expect(prj.projectHomeView.bigThumbText).to.be.equals(project2.projectHomeView.bigThumbText);    			
		    			expect(prj.name).to.be.equals(project2.name);
		    			expect(prj.url).to.be.equals(project2.url);
		    			expect(prj.description).to.be.equals(project2.description);
		    			expect(prj.license).to.be.equals(project2.license);
		    			expect(prj.visible).to.be.equals(project2.visible);
		    			expect(prj.gallery.thumb).to.be.equals(project2.gallery.thumb);
		    			expect(prj.gallery.img).to.be.equals(project2.gallery.img);
		    			expect(prj.gallery.description).to.be.equals(project2.gallery.description);
		    			expect(prj.authors.name).to.be.equals(project2.authors.name);
		    			expect(prj.authors.surname).to.be.equals(project2.authors.surname);
		    			expect(prj.authors.url).to.be.equals(project2.authors.url);
		    			expect(prj.authors.urlAvailable).to.be.equals(project2.authors.urlAvailable);
		    		}
	    		}
	    		done(err);
	    	}
	    });
	  });


		it('should correctly get a single project by its id', done => {
			agent
			.get('/api/projects/' + project2._id)
	    .set('Content-Type', 'application/json') //set header for this test
	    .set('Accept', 'application/json')
	    .expect(200)
	    .end((err, res) => {
	    	if (err) {
	    		return done(err);
	    	} else {
	    		let prj = res.body;
	    		expect(prj).to.be.not.null;
	    		expect(prj).to.be.not.undefined;
					expect(prj.projectHomeView.carouselImagePath).to.be.equals(project2.projectHomeView.carouselImagePath);
					expect(prj.projectHomeView.carouselText).to.be.equals(project2.projectHomeView.carouselText);
					expect(prj.projectHomeView.thumbImagePath).to.be.equals(project2.projectHomeView.thumbImagePath);
					expect(prj.projectHomeView.thumbText).to.be.equals(project2.projectHomeView.thumbText);
					expect(prj.projectHomeView.bigThumbImagePath).to.be.equals(project2.projectHomeView.bigThumbImagePath);
					expect(prj.projectHomeView.bigThumbText).to.be.equals(project2.projectHomeView.bigThumbText);    			
	  			expect(prj.name).to.be.equals(project2.name);
	  			expect(prj.url).to.be.equals(project2.url);
	  			expect(prj.description).to.be.equals(project2.description);
	  			expect(prj.license).to.be.equals(project2.license);
	  			expect(prj.visible).to.be.equals(project2.visible);
	  			expect(prj.gallery.thumb).to.be.equals(project2.gallery.thumb);
	  			expect(prj.gallery.img).to.be.equals(project2.gallery.img);
	  			expect(prj.gallery.description).to.be.equals(project2.gallery.description);
	  			expect(prj.authors.name).to.be.equals(project2.authors.name);
	  			expect(prj.authors.surname).to.be.equals(project2.authors.surname);
	  			expect(prj.authors.url).to.be.equals(project2.authors.url);
	  			expect(prj.authors.urlAvailable).to.be.equals(project2.authors.urlAvailable);
		    	
	    		done(err);
	    	}
	    });
	  });

	  afterEach(done => {
			Project.remove({}, err => { 
				console.log('collection removed') 
				done(err);
			});
		});
	});

	
	describe('---ERRORS---', () => {
		//here there are some test with epty results, because I destroyed the db 
		//in the afterEach above.
		it('should catch 200 but with an empty array as response', done => {
			agent
			.get('/api/projects')
	    .set('Content-Type', 'application/json') //set header for this test
	    .set('Accept', 'application/json')
	    .expect(200)
	    .end((err, res) => {
	    	if (err) {
	    		return done(err);
	    	} else {
	    		expect(res.body).to.be.not.null;
	    		expect(res.body).to.be.not.undefined;
	    		expect(res.body.length).to.be.equals(0);
	    		done();
	    	}
	    });
	  });

		it('should catch 200 but with an empty array as response', done => {
			agent
			.get('/api/projecthome')
	    .set('Content-Type', 'application/json') //set header for this test
	    .set('Accept', 'application/json')
	    .expect(200) //Status code
	    // end handles the response
	    .end((err, res) => {
	    	if (err) {
	    		return done(err);
	    	} else {
	    		expect(res.body).to.be.not.null;
	    		expect(res.body).to.be.not.undefined;
	    		expect(res.body.length).to.be.equals(0);
	    		done();
	    	}
	    });
	  });

		it('should catch 404 not found and check the error message', done => {
			agent
			.get('/api/projects/' + 'fakeId')
	    .set('Content-Type', 'application/json') //set header for this test
	    .set('Accept', 'application/json')
	    .expect(404)
	    .end((err, res) => {
	    	if (err) {
	    		return done(err);
	    	} else {
	    		expect(res.body).to.be.not.null;
	    		expect(res.body).to.be.not.undefined;
	    		expect(res.body.message).to.be.equals('projectid not found');
	    		done();
	    	}
	    });
	  });
	});
});