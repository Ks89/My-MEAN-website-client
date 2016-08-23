import {EventEmitter, Injectable} from '@angular/core';
import { Http } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';

import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/map';

import {LocalStorage, SessionStorage} from "h5webstorage";

@Injectable()
export class AuthService {
  constructor(private http: Http,
    private localStorage: LocalStorage,
    private sessionStorage: SessionStorage) {}

  login(user: any): Observable<any> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    this.localStorage.setItem("auth","local");
    this.sessionStorage.setItem("auth", "session");

    return this.http.post('/api/login', user, options)
      .map(response => {
        // saveToken('auth', data.token);
        this.localStorage.setItem('auth', response.json().token);
        response.json();
      });
  }
};
