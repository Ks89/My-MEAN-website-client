import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { handleError } from '../utils/util';

export const URL_API_PROJECTS: string = '/api/projects';
export const URL_API_PROJECTHOME: string = '/api/projecthome';

export class ProjectHomeView {
  constructor(
    public _id: string,
    public carouselImagePath: string,
    public carouselText: string,
    public thumbImagePath: string,
    public thumbText: string,
    public bigThumbImagePath: string,
    public bigThumbText: string) {
  }
}

export class ProjectGallery {
  constructor(
    public _id: string,
    public thumb: string,
    public img: string,
    public description: string) {
  }
}

export class Author {
  constructor(
    public _id: string,
    public name: string,
    public surname: string,
    public url: string,
    public urlAvailable: boolean) {
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
  constructor(private httpClient: HttpClient) {}

  getProjects(): Observable<Project[]> {
    return this.httpClient.get<Project[]>(URL_API_PROJECTS)
      .catch(handleError);
  }

  getProjectsById(projectid: string): Observable<Project> {
    return this.httpClient.get<Project>(`${URL_API_PROJECTS}/${projectid}`)
      .catch(handleError);
  }

  getProjectsForHomepage(): Observable<Project[]> {
    return this.httpClient.get<Project[]>(URL_API_PROJECTHOME)
      .catch(handleError);
  }
}
