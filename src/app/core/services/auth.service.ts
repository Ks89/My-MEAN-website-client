import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';

export const URL_API_LOGIN: string = '/api/login';
export const URL_API_REGISTER: string = '/api/register';
export const URL_API_RESET: string = '/api/resetNewPassword';
export const URL_API_FORGOT: string = '/api/reset';
export const URL_API_ACTIVATE: string = '/api/activateAccount';
export const URL_API_UNLINK: string = '/api/unlink';
export const URL_API_USERS: string = '/api/users';
export const URL_API_LOGOUT: string = '/api/logout';
export const URL_API_SESSION_TOKEN: string = '/api/sessionToken';
export const URL_API_DECODE_TOKEN: string = '/api/decodeToken';

  @Injectable()
export class AuthService {
  public loginEvent: EventEmitter<any> = new EventEmitter();

  constructor(private httpClient: HttpClient) {}

  // ----------------------------------------------------------
  // ------------------ local authentication ------------------
  // ----------------------------------------------------------

  login(user: any): Observable<any> {
    return this.httpClient.post(URL_API_LOGIN, user)
      .map(response => {
        console.log(response);
        if (!response) {
          return Observable.throw(new Error('response body is empty'));
          // return this.handleError('response body is empty');
        } else {
          this.saveToken('auth', response['token']);
          return response;
        }
      }).catch((error: HttpErrorResponse) => {
        this.removeToken('auth');
        return Observable.throw(error.error);
      });
  }

  register(user: any): Observable<any> {
    return this.httpClient.post(URL_API_REGISTER, user)
      .map(response => {
        console.log('Done register, response is:');
        console.log(response);
        return response;
      }).catch((error: HttpErrorResponse) => {
        this.removeToken('auth');
        return Observable.throw(error.error);
      });
  }

  reset(emailToken: any, newPassword: any): Observable<any> {
    let data = {
      newPassword: newPassword,
      emailToken: emailToken
    };
    return this.httpClient.post(URL_API_RESET, data)
      .map(response => {
        this.removeToken('auth'); // TODO check if it's correct to remove or I have to save it
        return response;
      });
  }

  forgot(email: any): Observable<any> {
    return this.httpClient.post(URL_API_FORGOT, {email: email});
  }

  activate(emailToken: string, userName: string): Observable<any> {
    let data = {
      emailToken: emailToken,
      userName: userName
    };
    return this.httpClient.post(URL_API_ACTIVATE, data);
  }

  unlink(serviceName: string): Observable<any> {
    console.log('Called unlink ' + serviceName);
    return this.httpClient.get(`${URL_API_UNLINK}/${serviceName}`);
  }

  // ---------------------------------------
  // --- local and 3dauth authentication ---
  // ---------------------------------------
  // function to call the /users/:id REST API
  getUserById(id: string): Observable<any> {
    return this.httpClient.get(`${URL_API_USERS}/${id}`);
  }

  logout(): Observable<any> {
    console.log('Called authentication logout');
    this.removeToken('auth');

    // call REST service to remove session data from redis
    return this.httpClient.get(URL_API_LOGOUT);
  }

  saveToken(key: any, token: any) {
    console.log('saving token with key: ' + key);
    window.sessionStorage.setItem(key, token);
  }

  getTokenRedis(): Observable<any> {
    return this.httpClient.get(URL_API_SESSION_TOKEN);
  }

  decodeJwtToken(jwtToken: string): Observable<any> {
    // TODO add an if (jwtToken) or something like that
    return this.httpClient.get(`${URL_API_DECODE_TOKEN}/${jwtToken}`);
  }

  // For 3dauth I must save the auth token, before that I can call isLoggedIn.
  // Obviously, with local auth I can manage all the process by myself, but for 3dauth after the callback
  // I haven't anything and I must call this method to finish this process.
  post3dAuthAfterCallback(): Observable<any> {
    return this.getTokenRedis()
      .map(tokenData => {
        console.log('token obtained from redis');
        console.log('sessionToken ', tokenData);
        if (!tokenData) {
          return 'sessionToken not valid';
        }

        console.log('tokenData ', tokenData);
        if (tokenData && tokenData.token) {
          console.log('real token is ', tokenData.token);
          this.saveToken('auth', tokenData.token);
          return tokenData.token;
        } else {
          return 'sessionToken not valid. Cannot obtain token';
        }
      });
  }

  // Used to know if you are logged in or not
  getLoggedUser(): Observable<any> {
    console.log('getLoggedUser entered');
    return this.getUserFromSessionStorage('auth')
      .map(res => {
        console.log('getLoggedUser map res entered');
        console.log(res);
        if (res === null || res === 'invalid-data') {
          console.log('getLoggedUser invalid');
          this.removeToken('auth');
          console.log('INVALID DATA !!!!');
          //  return Observable.throw(new Error('Invalid data!'));
          return 'INVALID DATA';
        } else {
          console.log('getLoggedUser valid');
          console.log(res);
          const user = res.user;
          console.log(user);
          return user;
        }
      });
  }

  // -----------------------------------
  // --- others functions - not exposed
  // -----------------------------------
  getToken(key: any): string {
    const sessionAuth: string | void = window.sessionStorage.getItem(key);

    if (!sessionAuth || sessionAuth === 'undefined' || sessionAuth === 'null') {
      return undefined;
    }

    return sessionAuth;
  }

  removeToken(key: any) {
    window.sessionStorage.removeItem(key);
  }

  // it uses the sessionStorage's jwt token as parameter of decodeJwtToken rest service
  // to be able to return the decoded json user
  private getUserFromSessionStorage(key: string): Observable<any> {
    console.log('getUserFromSessionStorage called method');
    console.log('sessionStorage: ');
    console.log(this.getToken(key));
    const sessionToken = this.getToken(key);
    if (sessionToken) {
      console.log('getUserFromSessionStorage sessionToken ' + sessionToken);
      return this.decodeJwtToken(sessionToken);
    } else {
      console.log('getUserFromSessionStorage sessionToken null or empty');
      // FIXME find a better solution
      return Observable.of(null);
    }
  }
}



