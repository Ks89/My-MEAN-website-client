import {EventEmitter, Injectable} from '@angular/core';
import { Http } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';

import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/map';

@Injectable()
export class AuthService {
  constructor(private http: Http) {}

  login(user: any): Observable<any> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.post('/api/login', user, options)
      .map(response => {
        // saveToken('auth', data.token);
        response.json();
      });
  }
};
