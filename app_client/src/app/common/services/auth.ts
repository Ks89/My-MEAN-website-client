import {EventEmitter, Injectable} from '@angular/core';
import { Http } from '@angular/http';
import { Headers, RequestOptions } from '@angular/http';

import {Observable} from 'rxjs/Observable';
import {forkJoin} from 'rxjs/observable/forkJoin';
import {of} from 'rxjs/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/reduce';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/from';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/concatMap';
import 'rxjs/add/operator/share';

@Injectable()
export class AuthService {
  private headers = new Headers({ 'Content-Type': 'application/json' });
  private options = new RequestOptions({ headers: this.headers });

  loginEvent: EventEmitter<any> = new EventEmitter();

  constructor(private http: Http) {}

  //----------------------------------------------------------
  //------------------ local authentication ------------------
  //----------------------------------------------------------

  login(user: any): Observable<any> {
    return this.http.post('/api/login', user, this.options)
    .map(response => {
      this.saveToken('auth', response.json().token);
      return response.json();
    }).map(res => {
      // this.loginStatus = res;
      console.log('Result is: ' + res);
      return res;
    }); //on error removeToken('auth');
  }

  register(user: any): Observable<any> {
    return this.http.post('/api/register', user, this.options).map(
      response => {
        console.log("Done register");
        console.log(response);
        this.saveToken('auth', response.json().token);
        return response;
      }); //removetoken on error
  }

  reset(emailToken: any, newPassword: any): Observable<any> {
    let data = {
      newPassword : newPassword,
      emailToken : emailToken
    };
    return this.http.post('/api/resetNewPassword', data, this.options)
    .map(response => {
      // saveToken('auth', data.token);
      this.saveToken('auth', response.json().token);
      return response.json();
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
    return this.http.get(`/api/unlink/${serviceName}`);
  };

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
    this.removeToken('auth');

    //call REST service to remove session data from redis
    return this.http.get('/api/logout')
    .map(response => response.json());
  }

  saveToken(key, token) {
    console.log('saving token with key: ' + key);
    window.sessionStorage.setItem(key, token);
  };

  getTokenRedis(): Observable<any> {
    return this.http.get('/api/sessionToken')
    .map(response => response.json());
  }

  decodeJwtToken(jwtToken: string): Observable<any> {
    //TODO add an if(jwtToken) or something like that
    return this.http.get(`/api/decodeToken/${jwtToken}`)
    .map(response => response.json());
  }

  //For 3dauth I must save the auth token, before that I can call isLoggedIn.
  //Obviously, with local auth I can manage all the process by myself, but for 3dauth after the callback
  //I haven't anything and I must call this method to finish this process.
  post3dAuthAfterCallback(): Observable<any> {
    return this.getTokenRedis()
    .map(tokenData => {
      console.log('token obtained from redis');
      console.log("sessionToken " + tokenData);
      if(!tokenData) return "sessionToken not valid";
      var tokenObj = JSON.parse(tokenData);
      console.log("tokenobj: " + tokenObj);
      if(tokenObj && tokenObj.token) {
        console.log("real token is: " + tokenObj.token);
        this.saveToken('auth', tokenObj.token);
        return tokenObj.token;
      } else {
        return "sessionToken not valid. Cannot obtain token";
      }
    });
  }

  //Used to know if you are logged in or not
  getLoggedUser(): Observable<any> {
    console.log("getLoggedUser entered");
    return this.getUserFromSessionStorage('auth')
    .map(res => {
      console.log("getLoggedUser map res entered");
      console.log(res);
      if(res == null || res === 'invalid-data') {
        console.log("getLoggedUser invalid");
        this.removeToken('auth');
        //TODO remove session data with logout
        console.log('INVALID DATA !!!!');
        // return Observable.throw(new Error('Invalid data!'));
        return "INVALID DATA";
      } else {
        console.log("getLoggedUser valid");
        var userData = JSON.parse(res);
        console.log(userData);
        var user = userData.user;
        console.log(user);
        return user;
      }
    },
    err => {
        console.log("getLoggedUser error ");
        console.log(err);
        return "getLoggedUser error";
    });
  }

  //-----------------------------------
  //--- others functions - not exposed
  //-----------------------------------
  getToken(key): string {
    return window.sessionStorage.getItem(key);
  }

  //it uses the sessionStorage's jwt token as parameter of decodeJwtToken rest service
  //to be able to return the decoded json user
  private getUserFromSessionStorage(key: string): Observable<any> {
    console.log("getUserFromSessionStorage called method");
    console.log("sessionStorage: ");
    console.log(this.getToken(key));
    var sessionToken = this.getToken(key);
    if(sessionToken) {
      console.log("getUserFromSessionStorage sessionToken " + sessionToken);
      return this.decodeJwtToken(sessionToken);
    } else {
      console.log("getUserFromSessionStorage sessionToken null or empty");
      return Observable.of(null);
    }
  }

  removeToken(key) {
    window.sessionStorage.removeItem(key);
  }
}
