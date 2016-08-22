import {EventEmitter, Injectable} from '@angular/core';
import { Http } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';

import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/map';

import { LocalStorageService } from 'angular-2-local-storage';

@Injectable()
export class AuthService {
  constructor(private http: Http, private localStorageService: LocalStorageService) {}

  login(user: any): Observable<any> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    this.localStorageService.set('auth', "experiment");

    return this.http.post('/api/login', user, options)
      .map(response => {
        // saveToken('auth', data.token);
        this.localStorageService.set('auth', response.json().token);
        response.json();
      });
  }
};
