'user strict';
process.env.NODE_ENV = 'test'; //before every other instruction

var expect = require('chai').expect;
var app = require('../app');
var agent = require('supertest').agent(app);

require('../app_server/models/projects');
var mongoose = require('mongoose');
var Project = mongoose.model('Project');

var project;
var project2;

const URL_PROJECTS = '/api/projects';
const URL_PROJECTHOME = '/api/projecthome';
const URL_SINGLE_PROJECT = URL_PROJECTS + "/";

describe('projects', () => {

	function insertProjectsTestDb(done) {
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
		}
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
	}

	function dropProjectCollectionTestDb(done) {
		Project.remove({}, err => done(err));
	}

	function getPartialGetRequest (apiUrl) {
		return agent
			.get(apiUrl)
			.set('Content-Type', 'application/json')
			.set('Accept', 'application/json');
	}

	describe('#projectsList()', () => {
		describe('---YES---', () => {

			before(done => insertProjectsTestDb(done));

			it('should correctly get a list of project', done => {
				getPartialGetRequest(URL_PROJECTS)
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

			after(done => dropProjectCollectionTestDb(done));
		});

		describe('---NO---', () => {

			before(done => dropProjectCollectionTestDb(done));
	
			it('should catch 200 but with an empty array as response', done => {
				getPartialGetRequest(URL_PROJECTS)
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
		});
	});

	describe('#projectsListHomepage()', () => {
		describe('---YES---', () => {

			before(done => insertProjectsTestDb(done));

			it('should correctly get a list of projects that contains carouselImagePath', done => {
				getPartialGetRequest(URL_PROJECTHOME)
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

			after(done => dropProjectCollectionTestDb(done));
		});

		describe('---NO---', () => {

			before(done => dropProjectCollectionTestDb(done));
	
			it('should catch 200 but with an empty array as response', done => {
				getPartialGetRequest(URL_PROJECTHOME)
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
		});
	});


	describe('#projectsReadOne()', () => {
		describe('---YES---', () => {

			before(done => insertProjectsTestDb(done));
			
			it('should correctly get a single project by its id', done => {
				getPartialGetRequest(URL_SINGLE_PROJECT + project2._id)
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

			after(done => dropProjectCollectionTestDb(done));
		});

		describe('---ERRORS---', () => {

			before(done => dropProjectCollectionTestDb(done));
	
			it('should catch 404 not found and check the error message', done => {
				getPartialGetRequest(URL_SINGLE_PROJECT + 'fake_id')
				.expect(404)
				.end((err, res) => {
					if (err) {
						return done(err);
					} else {
						expect(res.body).to.be.not.null;
						expect(res.body).to.be.not.undefined;
						expect(res.body.message).to.be.equals('Project not found');
						done();
					}
				});
			});
		});
	});
});