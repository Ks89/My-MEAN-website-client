import {EventEmitter, Injectable} from '@angular/core';
import { Http } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';

import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/map';

export class Profile {}

@Injectable()
export class ProfileService {
  constructor(private http: Http) {}

  update(profile: any): Observable<Profile> {
    let body = JSON.stringify({ profile });
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.post('/api/profile', body, options)
      .map(response => response.json());
  }
}
