import { EventEmitter, Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

export class ProjectHomeView {
  constructor(
    _id: string,
    carouselImagePath: string,
    carouselText: string,
    thumbImagePath: string,
    thumbText: string,
    bigThumbImagePath: string,
    bigThumbText: string) {
  }
}

export class ProjectGallery {
  constructor(
    _id: string,
    thumb: string,
    img: string,
    description: string) {
  }
}

export class Author {
  constructor(
    _id: string,
    name: string,
    surname: string,
    url: string,
    urlAvailable: boolean) {
  }
}


export class Project {
  constructor(
    public _id: string,
    public name: string,
    public url: string,
    public iconPath: string,
    public description: string,
    public shortDescription: string,
    public license: string,
    public licenseText: string,
    public visible: boolean,
    public projectHomeView: Array<ProjectHomeView>,
    public lastUpdate: string,
    public filePaths: Array<string>,
    public gallery: Array<ProjectGallery>,
    public futureExtensions: Array<string>,
    public features: Array<string>,
    public releases: Array<string>,
    public changelog: Array<string>,
    public tags: Array<string>,
    public authors: Array<Author>) {
  }
}

@Injectable()
export class ProjectService {
  public searchEvent: EventEmitter<any> = new EventEmitter();

  constructor(private http: Http) {}

  getProjects(): Observable<Project[]> {
    return this.http.get('/api/projects')
      .map(response => response.json());
  }

  getProjectsById(projectid: string): Observable<Project> {
    return this.http.get(`/api/projects/${projectid}`)
      .map(response => response.json());
  }

  getProjectsForHomepage(): Observable<Project[]> {
    return this.http.get('/api/projecthome')
      .map(response => response.json());
  }

}
