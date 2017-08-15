import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { handleError } from '../utils/util';

export const URL_API_PROFILE: string = '/api/profile';

export class Response {
  constructor(public message: string) {}
}

@Injectable()
export class ProfileService {
  constructor(private httpClient: HttpClient) {}

  update(profile: any): Observable<Response> {
    return this.httpClient.post<Response>(URL_API_PROFILE, profile)
      .catch(handleError);
  }
}
