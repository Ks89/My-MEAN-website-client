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

  //----------------------------------------------------------
  //------------------ local authentication ------------------
  //----------------------------------------------------------

  login(user: any): Observable<any> {
    return this.http.post('/api/login', user, this.options)
    .map(response => {
      this.sessionStorage.setItem('auth', response.json().token);
      response.json();
    }); //on error removeToken('auth');
  }

  register(user: any): Observable<any> {
    return this.http.post('/api/register', user, this.options)
    .map(response => {
      // saveToken('auth', data.token);
      this.sessionStorage.setItem('auth', response.json().token);
      response.json();
    }); //on error removeToken('auth');
  }

  reset(emailToken: any, newPassword: any): Observable<any> {
    let data = {
      newPassword : newPassword,
      emailToken : emailToken
    };
    return this.http.post('/api/resetNewPassword', data, this.options)
    .map(response => {
      // saveToken('auth', data.token);
      this.sessionStorage.setItem('auth', response.json().token);
      response.json();
    });
  }

  forgot(email: any): Observable<any> {
    return this.http.post('/api/reset', { email : email}, this.options)
    .map(response => response.json());
  }

  activate(emailToken: string, userName: string): Observable<any> {
    let data = {
      emailToken : emailToken,
      userName : userName
    };
    return this.http.post('/api/activateAccount', data, this.options)
    .map(response => response.json());
  }

  unlink(serviceName: string): Observable<any> {
    console.log("Called unlink " + serviceName);
    return this.http.get(`/api/unlink/${serviceName}`)
    .map(response => response.json());
  };

  //-----------------------------
  //--- 3dauth authentication ---
  //-----------------------------




  //---------------------------------------
  //--- local and 3dauth authentication ---
  //---------------------------------------
  //function to call the /users/:id REST API
  getUserById(id: string): Observable<any> {
    return this.http.get(`/api/users/${id}`)
    .map(response => response.json());
  };

  logout(): Observable<any> {
    console.log("Called authentication logout");
    this.sessionStorage.removeItem('auth');

    //call REST service to remove session data from redis
    return this.http.get('/api/logout')
    .map(response => response.json());
  };

  getTokenRedis(): Observable<any> {
    return this.http.get('/api/sessionToken')
    .map(response => response.json());
  };

  decodeJwtToken(jwtToken: string): Observable<any> {
    //TODO add an if(jwtToken) or something like that
    return this.http.get(`/api/decodeToken/${jwtToken}`)
    .map(response => response.json());
  };

};
