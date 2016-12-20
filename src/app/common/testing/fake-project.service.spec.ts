import {ProjectHomeView, Project, Author, ProjectGallery} from '../services/projects.service';
import { Observable } from "rxjs";

export const HOMEVIEWS: ProjectHomeView[] = [
  {
    "_id": "57f4409c1ef2e2165ff70348",
    "carouselImagePath": "http://placehold.it/1000x400",
    "carouselText": "sdjs fshfs fhfsdhf",
    "thumbImagePath": "http://placehold.it/720x300",
    "thumbText": "sfsfasf",
    "bigThumbImagePath": "http://placehold.it/500x500",
    "bigThumbText": "dasdasdas"
  },
  {
    "_id":"57f7f29baef1d41fc4a7d782",
    "carouselImagePath":"http://placehold.it/1000x400",
    "carouselText":"sdjs fshfs fhfsdhf",
    "thumbImagePath":"http://placehold.it/720x300",
    "thumbText":"sfsfasf",
    "bigThumbImagePath":"http://placehold.it/500x500",
    "bigThumbText":"dasdasdas"
  },
  {
    "_id":"57f7f29baef1d41fc4a7d783",
    "carouselImagePath":"http://placehold.it/1000x400",
    "carouselText":"sdjs fshfs fhfsdhf",
    "thumbImagePath":"http://placehold.it/720x300",
    "thumbText":"sfsfasf",
    "bigThumbImagePath":"http://placehold.it/500x500",
    "bigThumbText":"dasdasdas"
  }
];

export const AUTHORS: Author[] = [
  {
    "_id": "4535345",
    "name":"dasdasdas",
    "surname":"dsadasd",
    "url":"http://shjdjhdj",
    "urlAvailable":true
  },{
    "_id": "4535346",
    "name":"dsfdsgsdgd",
    "surname":"werewweggew",
    "url":"http://dsgwgewg",
    "urlAvailable":true
  },{
    "_id": "4535347",
    "name":"jiomdwqdqw",
    "surname":"iuytdgbpl",
    "url":"http://mxiuwfybe",
    "urlAvailable":false
}];

export const PROJECTGALLERY_BYA: ProjectGallery[] = [
  {
    "_id": "389as811",
    "thumb": "assets/images/projects/byamanager/1.jpg",
    "img": "assets/images/projects/byamanager/1.jpg",
    "description": "Image 1"
  },
  {
    "_id": "389as812",
    "thumb": "assets/images/projects/byamanager/2.png",
    "img": "assets/images/projects/byamanager/2.png",
    "description": "Image 2"
  },
  {
    "_id": "389as813",
    "thumb": "assets/images/projects/byamanager/3.png",
    "img": "assets/images/projects/byamanager/3.png",
    "description": "Image 2"
  },
  {
    "_id": "389as814",
    "thumb": "assets/images/projects/byamanager/4.png",
    "img": "assets/images/projects/byamanager/4.png",
    "description": "Image 2"
  },
  {
    "_id": "389as815",
    "thumb": "assets/images/projects/byamanager/5.png",
    "img": "assets/images/projects/byamanager/5.png",
    "description": "Image 2"
  },
  {
    "_id": "389as816",
    "thumb": "assets/images/projects/byamanager/6.png",
    "img": "assets/images/projects/byamanager/6.png",
    "description": "Image 2"
  },
  {
    "_id": "389as817",
    "thumb": "assets/images/projects/byamanager/7.png",
    "img": "assets/images/projects/byamanager/7.png",
    "description": "Image 2"
  },
  {
    "_id": "389as818",
    "thumb": "assets/images/projects/byamanager/8.png",
    "img": "assets/images/projects/byamanager/8.png",
    "description": "Image 2"
  },
  {
    "_id": "389as819",
    "thumb": "assets/images/projects/byamanager/9.png",
    "img": "assets/images/projects/byamanager/9.png",
    "description": "Image 2"
  },
  {
    "_id": "389as820",
    "thumb": "assets/images/projects/byamanager/10.png",
    "img": "assets/images/projects/byamanager/10.png",
    "description": "Image 2"
  },
  {
    "_id": "389as821",
    "thumb": "assets/images/projects/byamanager/11.png",
    "img": "assets/images/projects/byamanager/11.png",
    "description": "Image 2"
  }
];

export const PROJECTGALLERY_SPF: ProjectGallery[] = [
  {
    "_id": "389as822",
    "thumb":"assets/images/projects/spf/1.png",
    "img":"assets/images/projects/spf/1.png",
    "description":"Image 1"
  },
  {
    "_id": "389as823",
    "thumb":"assets/images/projects/spf/2.png",
    "img":"assets/images/projects/spf/2.png",
    "description":"Image 2"
  }
];


export const PROJECTS: Project[] = [
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
    "projectHomeView": [HOMEVIEWS[0]],
    "lastUpdate": "2013-07-15T22:00:00.000Z",
    "filePaths": [],
    "gallery": [...PROJECTGALLERY_SPF],
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
    "authors": [AUTHORS[0], AUTHORS[1], AUTHORS[2]]
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
    "projectHomeView": [HOMEVIEWS[1]],
    "lastUpdate":"2013-07-15T22:00:00.000Z",
    "filePaths":[],
    "gallery":[...PROJECTGALLERY_BYA],
    "futureExtensions":["assets/html/projects/bya/future_extensions.html"],
    "features":["assets/html/projects/bya/features.html"],
    "releases":["assets/html/projects/bya/releases.html"],
    "changelog":["assets/html/projects/bya/changelog.html"],
    "tags":["java se","maven","university"],
    "authors": [...AUTHORS]
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
    "projectHomeView": [HOMEVIEWS[2]],
    "lastUpdate":"2013-07-15T22:00:00.000Z",
    "filePaths":[],
    "gallery":[...PROJECTGALLERY_SPF],
    "futureExtensions":["assets/html/projects/bya/future_extensions.html"],
    "features":["assets/html/projects/bya/features.html"],
    "releases":["assets/html/projects/bya/releases.html"],
    "changelog":["assets/html/projects/bya/changelog.html"],
    "tags":["java se","maven","university"],
    "authors": [...AUTHORS]
    }
];

export class FakeProjectService {

  getProjects(): Observable<Project[]> {
    return Observable.of(PROJECTS);
  }

  getProjectsById(projectid: string): Observable<Project[]> {
    return Observable.of(PROJECTS.filter((val, index) => {
      return val._id === projectid;
    }));
  }

  getProjectsForHomepage(): Observable<Project[]> {
    return Observable.of(PROJECTS);
  }
}