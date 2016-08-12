import {EventEmitter, Injectable} from '@angular/core';
import {Http, URLSearchParams } from '@angular/http';
import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/map';


export class ProjectHomeView {
  constructor(
    _id: number,
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
    _id: number,
    thumb: string,
    img: string,
    description: string) {
  }
}


export class Project {
  constructor(
    _id: number,
    public name: string,
    public iconPath: string,
    public projectHomeView: Array<ProjectHomeView>,
    public url: string,
    public description: string,
    public tags: Array<string>,
    public changelog: Array<string>,
    public releases: Array<string>,
    public features: Array<string>,
    public futureExtensions: Array<string>,
    public gallery: Array<ProjectGallery>,
    public filePaths: Array<string>,
    public license: string,
    public visible: boolean) {
  }
}

@Injectable()
export class ProductService {
  searchEvent: EventEmitter = new EventEmitter();

  constructor(private http: Http) {}

  getProjects(): Observable<Project[]> {
    return this.http.get('/api/projects')
      .map(response => response.json());
  }

  getProjectsById(projectid: number): Observable<Project> {
    return this.http.get(`/api/projects/${projectid}`)
      .map(response => response.json());
  }

  getProjectsForHomepage(): Observable<Project[]> {
    return this.http.get('/api/projecthome')
      .map(response => response.json());
  }

}
