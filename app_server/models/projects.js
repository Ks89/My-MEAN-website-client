var mongoose = require('mongoose');

var authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    urlAvailable: {
        type: Boolean,
        required: true
    }
});

var projectHomeViewSchema = new mongoose.Schema({
    carouselImagePath: String,
    carouselText: String,
    thumbImagePath: String,
    thumbText: String,
    bigThumbImagePath: String,
    bigThumbText: String
});

var projectGallerySchema = new mongoose.Schema({
    thumb: String,
    img: String,
    description: String
});

var projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    iconPath: String,
    authors: [authorSchema],
    projectHomeView: projectHomeViewSchema,
    url: {
        type: String,
        required: true
    },
    description: String,
    tags: [String],
    changelog: [String],
    releases: [String],
    features: [String],
    futureExtensions: [String],
    gallery: [projectGallerySchema],
    filePaths: [String],
    license: {
        type: String,
        required: true
    },
    visible: {
      type: Boolean,
      required: true
  },
  lastUpdate: {
    type: Date,
    "default": Date.now
  }
});

mongoose.model('Project', projectSchema);