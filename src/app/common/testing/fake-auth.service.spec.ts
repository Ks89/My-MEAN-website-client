import { EventEmitter } from '@angular/core';
import { Observable } from "rxjs";

export const FAKE_BAD_EMAIL_TOKEN = 'bad@fake.it';
export const FAKE_ALREADY_EXISTING_EMAIL = 'already@existing.email';
export const FAKE_NOT_EXISTING_EMAIL = 'not@existing.email';
export const FAKE_BAD_PASSWORD = "fake bad password";
export const JWT_TOKEN = 'valid.jwt.token';

class User {
  constructor(
    public name: string,
    public email: string,
    public password: string
  ) {}
}

export class FakeAuthService {

  public loginEvent: EventEmitter<any> = new EventEmitter();

  login(user: User): Observable<any> {
    if(user.email !== FAKE_NOT_EXISTING_EMAIL && user.password !== FAKE_BAD_PASSWORD) {
      return Observable.of({
        "token": JWT_TOKEN
      });
    } else {
      return Observable.throw({
        _body :  JSON.stringify({"message":"Incorrect username or password. Or this account is not activated, check your mailbox."})
      });
    }
  }

  activate(emailToken: string, userName: string): Observable<any> {

    if(emailToken !== FAKE_BAD_EMAIL_TOKEN) {
      return Observable.of({
        "message": "An e-mail has been sent to " + emailToken + " with further instructions."
      });
    } else {
      return Observable.throw({
        _body :  JSON.stringify({"message":"No account with that token exists."})
      });
    }
  }

  forgot(email: any): Observable<any> {
    if(email !== FAKE_BAD_EMAIL_TOKEN) {
      return Observable.of({
        "email": email
      });
    } else {
      return Observable.throw({
        _body :  JSON.stringify({"message":"No account with that email address exists."})
      });
    }
  }

  reset(emailToken: any, newPassword: any): Observable<any> {
    if(emailToken !== FAKE_BAD_EMAIL_TOKEN) {
      return Observable.of({
        "message": `An e-mail has been sent to ${emailToken} with further instructions.`
      });
    } else {
      return Observable.throw({
        _body :  JSON.stringify({"message":"No account with that token exists."})
      });
    }
  }

  register(user: User): Observable<any> {
    if(user.email !== FAKE_ALREADY_EXISTING_EMAIL) {
      return Observable.of({
        "message": `User with email ${user.email} registered.`
      });
    } else {
      return Observable.throw({
        _body :  JSON.stringify({"message":"User already exists. Try to login."})
      });
    }
  }

  logout(): Observable<any> {
    //TODO FIXME add the real value
    return Observable.of({
      "message": `Logout called`
    });
  }

  post3dAuthAfterCallback(): Observable<any> {
    return Observable.of('fsdfsdf.543tr.gfweg');
  }

  getLoggedUser(): Observable<any> {
    console.log('getLoggedUser mock entered');
    return Observable.of({
      local: {
        email: "fake.local@email.it",
        name: "hgjhg"
      }
    });
  }
}

// I created this fake service to wrong-mock post3dAuthAfterCallback, because it doesn't receive input parameters
export class FakeWrongPost3dAuthService {

  post3dAuthAfterCallback(): Observable<any> {
    return Observable.throw('an error message');
  }
}

// I created this fake service to wrong-mock getLoggedUser, because it doesn't receive input parameters
export class FakeWrongPost3dLoggedUserAuthService {

  post3dAuthAfterCallback(): Observable<any> {
    return Observable.of('fsdfsdf.543tr.gfweg');
  }

  getLoggedUser(): Observable<any> {
    return Observable.throw('an error message');
  }
}