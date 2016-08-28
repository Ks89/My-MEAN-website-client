import {EventEmitter, Injectable} from '@angular/core';
import { Http } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';

import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/map';

import {LocalStorage, SessionStorage} from "h5webstorage";

@Injectable()
export class AuthService {
  private headers = new Headers({ 'Content-Type': 'application/json' });
  private options = new RequestOptions({ headers: this.headers });

  constructor(private http: Http,
    private localStorage: LocalStorage,
    private sessionStorage: SessionStorage) {}

    //----------------------------
    //--- local authentication ---
    //----------------------------

    login(user: any): Observable<any> {
      this.localStorage.setItem("auth","test");

      return this.http.post('/api/login', user, this.options)
      .map(response => {
        // saveToken('auth', data.token);
        this.sessionStorage.setItem('auth', response.json().token);
        response.json();
      });
    }

    register(user: any): Observable<any> {
      this.localStorage.setItem("auth","test");

      return this.http.post('/api/register', user, this.options)
      .map(response => {
        // saveToken('auth', data.token);
        this.sessionStorage.setItem('auth', response.json().token);
        response.json();
      });
    }
  };
