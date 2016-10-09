import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Http } from '@angular/http';


import { ProjectHomeView, ProjectGallery, Author, Project, ProjectService } from '../services/projects.service';

var homeView: ProjectHomeView = {
  "_id": "57f4409c1ef2e2165ff70348",
  "carouselImagePath": "http://placehold.it/1000x400",
  "carouselText": "sdjs fshfs fhfsdhf",
  "thumbImagePath": "http://placehold.it/720x300",
  "thumbText": "sfsfasf",
  "bigThumbImagePath": "http://placehold.it/500x500",
  "bigThumbText": "dasdasdas"
};

export var PROJECTS: Project[] = [
  {
    "_id": "57632b61009f08db1623b606",
    "name": "BYAManager prj",
    "url": "https://github.com/Ks89/BYAManager",
    "iconPath": "assets/images/projects/project_icons/byamanager.png",
    "description": "assets/html/projects/bya/description.html",
    "shortDescription": "short description 1",
    "license": "apache-v2",
    "licenseText": "assets/html/projects/bya/license.html",
    "visible": true,
    "projectHomeView": [homeView],
    "lastUpdate": "2013-07-15T22:00:00.000Z",
    "filePaths": [],
    "gallery": [
      {
        "thumb": "assets/images/projects/byamanager/1.jpg",
        "img": "assets/images/projects/byamanager/1.jpg",
        "description": "Image 1"
      },
      {
        "thumb": "assets/images/projects/byamanager/2.png",
        "img": "assets/images/projects/byamanager/2.png",
        "description": "Image 2"
      },
      {
        "thumb": "assets/images/projects/byamanager/3.png",
        "img": "assets/images/projects/byamanager/3.png",
        "description": "Image 2"
      },
      {
        "thumb": "assets/images/projects/byamanager/4.png",
        "img": "assets/images/projects/byamanager/4.png",
        "description": "Image 2"
      },
      {
        "thumb": "assets/images/projects/byamanager/5.png",
        "img": "assets/images/projects/byamanager/5.png",
        "description": "Image 2"
      },
      {
        "thumb": "assets/images/projects/byamanager/6.png",
        "img": "assets/images/projects/byamanager/6.png",
        "description": "Image 2"
      },
      {
        "thumb": "assets/images/projects/byamanager/7.png",
        "img": "assets/images/projects/byamanager/7.png",
        "description": "Image 2"
      },
      {
        "thumb": "assets/images/projects/byamanager/8.png",
        "img": "assets/images/projects/byamanager/8.png",
        "description": "Image 2"
      },
      {
        "thumb": "assets/images/projects/byamanager/9.png",
        "img": "assets/images/projects/byamanager/9.png",
        "description": "Image 2"
      },
      {
        "thumb": "assets/images/projects/byamanager/10.png",
        "img": "assets/images/projects/byamanager/10.png",
        "description": "Image 2"
      },
      {
        "thumb": "assets/images/projects/byamanager/11.png",
        "img": "assets/images/projects/byamanager/11.png",
        "description": "Image 2"
      }
    ],
    "futureExtensions": [
      "assets/html/projects/bya/future_extensions.html"
    ],
    "features": [
      "assets/html/projects/bya/features.html"
    ],
    "releases": [
      "assets/html/projects/bya/releases.html"
    ],
    "changelog": [
      "assets/html/projects/bya/changelog.html"
    ],
    "tags": ["java se", "maven", "university"],
    "authors": [
      {
        "name": "dasdasdas",
        "surname": "dsadasd",
        "url": "http://shjdjhdj",
        "urlAvailable": true
      },
      {
        "name": "dsfdsgsdgd",
        "surname": "werewweggew",
        "url": "http://dsgwgewg",
        "urlAvailable": true
      },
      {
        "name": "jiomdwqdqw",
        "surname": "iuytdgbpl,",
        "url": "http://mxiuwfybe",
        "urlAvailable": false
      }
    ]
  },
  {
    "_id":"57632b61009f08db1623b605",
    "name":"SPF prj",
    "url":"https://github.com/deib-polimi/SPF2",
    "iconPath":"assets/images/projects/project_icons/spf.png",
    "description":"assets/html/projects/bya/description.html",
    "shortDescription":"short description 2",
    "license":"apache-v2",
    "licenseText":"assets/html/projects/bya/license.html",
    "visible":true,
    "projectHomeView": [{
      "carouselImagePath":"http://placehold.it/1000x400",
      "carouselText":"sdjs fshfs fhfsdhf",
      "thumbImagePath":"http://placehold.it/720x300",
      "thumbText":"sfsfasf",
      "bigThumbImagePath":"http://placehold.it/500x500",
      "bigThumbText":"dasdasdas",
      "_id":"57f7f29baef1d41fc4a7d782"
    }],
    "lastUpdate":"2013-07-15T22:00:00.000Z",
    "filePaths":[],
    "gallery":[{
        "thumb":"assets/images/projects/spf/1.png",
        "img":"assets/images/projects/spf/1.png",
        "description":"Image 1"},{"thumb":"assets/images/projects/spf/2.png",
        "img":"assets/images/projects/spf/2.png",
        "description":"Image 2"
    }],
    "futureExtensions":["assets/html/projects/bya/future_extensions.html"],
    "features":["assets/html/projects/bya/features.html"],
    "releases":["assets/html/projects/bya/releases.html"],
    "changelog":["assets/html/projects/bya/changelog.html"],
    "tags":["java se","maven","university"],
    "authors":[{
        "name":"dasdasdas",
        "surname":"dsadasd",
        "url":"http://shjdjhdj",
        "urlAvailable":true},{
        "name":"dsfdsgsdgd",
        "surname":"werewweggew",
        "url":"http://dsgwgewg",
        "urlAvailable":true},{
        "name":"jiomdwqdqw",
        "surname":"iuytdgbp",
        "url":"http://mxiuwfybe",
        "urlAvailable":false
      }]
  },
  {
    "_id":"57632b61009f08db1623b607",
    "name":"Superapp",
    "url":"https://github.com/Ks89/superapp",
    "iconPath":"assets/images/projects/project_icons/superapp.png",
    "description":"assets/html/projects/bya/description.html",
    "shortDescription":"short description 3",
    "license":"apache-v2",
    "licenseText":"assets/html/projects/bya/license.html",
    "visible":true,
    "projectHomeView":[{
      "carouselImagePath":"http://placehold.it/1000x400",
      "carouselText":"sdjs fshfs fhfsdhf",
      "thumbImagePath":"http://placehold.it/720x300",
      "thumbText":"sfsfasf",
      "bigThumbImagePath":"http://placehold.it/500x500",
      "bigThumbText":"dasdasdas",
      "_id":"57f7f29baef1d41fc4a7d783"
    }],
    "lastUpdate":"2013-07-15T22:00:00.000Z",
    "filePaths":[],
    "gallery":[
      {
        "thumb":"assets/images/projects/superapp/1.png",
        "img":"assets/images/projects/superapp/1.png",
        "description":"Image 1"
      },{
        "thumb":"assets/images/projects/superapp/2.png",
        "img":"assets/images/projects/superapp/2.png",
        "description":"Image 2"
      }
    ],
    "futureExtensions":["assets/html/projects/bya/future_extensions.html"],
    "features":["assets/html/projects/bya/features.html"],
    "releases":["assets/html/projects/bya/releases.html"],
    "changelog":["assets/html/projects/bya/changelog.html"],
    "tags":["java se","maven","university"],
    "authors":[
      {
        "name":"dasdasdas",
        "surname":"dsadasd",
        "url":"http://shjdjhdj",
        "urlAvailable":true
      },{
        "name":"dsfdsgsdgd",
        "surname":"werewweggew",
        "url":"http://dsgwgewg",
        "urlAvailable":true
      },{
        "name":"jiomdwqdqw",
        "surname":"iuytdgbpl",
        "url":"http://mxiuwfybe",
        "urlAvailable":false
      }]
    }
];

export class FakeProjectService implements ProjectService {
  projects = PROJECTS.map(h => h);

  getProjects(): Observable<Project[]> {
    return Observable.of(this.projects);
  }

  getProjectsById(projectid: string): Observable<Project> {
    return Observable.of(this.projects[0]);
  }

  getProjectsForHomepage(): Observable<Project[]> {
    return Observable.of(this.projects);
  }

}
