var mongoose = require('mongoose');
var Project = mongoose.model('Project');
var logger = require('../utils/logger.js');

var Utils = require('../utils/util.js');

/* GET list of projects */
/* /api/projects */
module.exports.projectsList = function(req, res) {
  console.log('projectsList');
  Project.find({}, (err, results) => {
    if (!results || err) {
      console.log('projectsList error:', err);
      Utils.sendJSONres(res, 404, "Project list not found");
      return;
    }
    if (results.length === 0) {
      console.log('projectsList is empty');
      res.status(204).end(); // no content (attention, don't use res.json() in this case)
    } else {
      Utils.sendJSONres(res, 200, results);
      return;
    }
  });
};


/* GET list of projects that contains carouselImagePath for Homepage */
/* /api/projecthome */
module.exports.projectsListHomepage = function(req, res) {
  console.log('projectsListHomepage');
  Project
    .find({"projectHomeView.carouselImagePath": { $exists: true } })
    .lean().exec((err, results) => {
      if (!results || err) {
        console.log('projectsListHomepage error:', err);
        Utils.sendJSONres(res, 404, "Project list homepage not found");
        return;
      }
      if (results.length === 0) {
        console.log('projectsListHomepage is empty');
        res.status(204).end(); // no content (attention, don't use res.json() in this case)
      } else {
        Utils.sendJSONres(res, 200, results);
        return;
      }
    });
};

/* GET a project by the projectid */
/* /api/projects/:projectid */
module.exports.projectsReadOne = function(req, res) {
  console.log('Finding a Project', req.params);
  if (!req.params.projectid) {
    Utils.sendJSONres(res, 400, "No projectid in request");
    return;
  }

  Project
  .findById(req.params.projectid)
  .exec((err, project) => {
    if (!project || err) {
      Utils.sendJSONres(res, 404, "Project not found");
    } else {
      console.log(project);
      Utils.sendJSONres(res, 200, project);
    }
  });
};
