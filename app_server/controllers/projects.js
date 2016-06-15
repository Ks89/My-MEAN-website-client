var mongoose = require('mongoose');
var Project = mongoose.model('Project');
var logger = require('../utils/logger.js');

var Utils = require('../utils/util.js');

/* GET list of projects */
/* /api/projects */
module.exports.projectsList = function(req, res) {
  console.log('projectsList');
  Project.find({}, function(err, results) {
    if (err) {
      console.log('projectsList error:', err);
      Utils.sendJSONresponse(res, 404, err);
    } else {
      Utils.sendJSONresponse(res, 200, results);
    }
  });
};


/* GET list of projects that contains carouselImagePath for Homepage */
/* /api/projecthome */
module.exports.projectsListHomepage = function(req, res) {
  console.log('projectsListHomepage');
  Project
    .find({"projectHomeView.carouselImagePath": { $exists: true } })
    .lean().exec(function(err, results) {
      if (err) {
        console.log('projectsListHomepage error:', err);
        Utils.sendJSONresponse(res, 404, err);
      } else {
        Utils.sendJSONresponse(res, 200, results);
      }
    });
};

/* GET a project by the projectid */
/* /api/projects/:projectid */
module.exports.projectsReadOne = function(req, res) {
  console.log('Finding a Project', req.params);
  if (req.params && req.params.projectid) {
    Project
    .findById(req.params.projectid)
    .exec(function(err, project) {
      if (!project) {
        Utils.sendJSONresponse(res, 404, {
          "message": "projectid not found"
        });
      } else if (err) {
        console.log(err);
        Utils.sendJSONresponse(res, 404, err);
      } else {
        console.log(project);
        Utils.sendJSONresponse(res, 200, project);
      }
    });
  } else {
    console.log('No projectid specified');
    Utils.sendJSONresponse(res, 404, {
      "message": "No projectid in request"
    });
  }
};