var mongoose = require('mongoose');
var ProjMongoose = mongoose.model('Project');

// var Grid = require('gridfs-stream');
// Grid.mongo = mongoose.mongo;
// var gfs = new Grid(mongoose.connection.db);

var sendJSONresponse = function(res, status, content) {
  res.status(status);
  res.contentType('application/json');
  res.json(content);
};

// var varWithMethods = (function() {
//   var variable = 6371;

//   var method = function(param) {
//     return parseFloat(param * variable);
//   };

//   var anotherMethod = function(param) {
//     return parseFloat(param / variable);
//   };

//   return {
//     method: method,
//     anotherMethod: anotherMethod
//   };
// })();

/* GET list of projects */
module.exports.projectsList = function(req, res) {
  console.log('projectsList');
  ProjMongoose.find({}, function(err, results) {
    if (err) {
      console.log('projectsList error:', err);
      sendJSONresponse(res, 404, err);
    } else {
      sendJSONresponse(res, 200, results);
    }
  });
};


/* GET list of projects that contains carouselImagePath for Homepage */
module.exports.projectsListHomepage = function(req, res) {
  console.log('projectsListHomepage');
  ProjMongoose
    .find({"projectHomeView.carouselImagePath": { $exists: true } })
    .lean().exec(function(err, results) {
      if (err) {
        console.log('projectsListHomepage error:', err);
        sendJSONresponse(res, 404, err);
      } else {
        sendJSONresponse(res, 200, results);
      }
    });
};

/* GET a project by the id */
module.exports.projectsReadOne = function(req, res) {
  console.log('Finding a Project', req.params);
  if (req.params && req.params.projectid) {
    ProjMongoose
    .findById(req.params.projectid)
    .exec(function(err, project) {
      if (!project) {
        sendJSONresponse(res, 404, {
          "message": "projectid not found"
        });
        return;
      } else if (err) {
        console.log(err);
        sendJSONresponse(res, 404, err);
        return;
      }
      console.log(project);
      sendJSONresponse(res, 200, project);
    });
  } else {
    console.log('No projectid specified');
    sendJSONresponse(res, 404, {
      "message": "No projectid in request"
    });
  }
};


/* POST a new project */
/* /api/projects */
module.exports.projectsCreate = function(req, res) {

};

/* PUT /api/projects/:projectid */
module.exports.projectsUpdateOne = function(req, res) {

};

/* DELETE /api/projects/:projectid */
module.exports.projectsDeleteOne = function(req, res) {

};