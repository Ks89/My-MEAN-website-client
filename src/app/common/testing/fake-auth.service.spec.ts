import { EventEmitter } from '@angular/core';
import { Observable } from "rxjs";

export const FAKE_OK_EMAIL_TOKEN = 'fake@email.it';
export const FAKE_OK_USERNAME = 'user name';
export const FAKE_OK_NICKNAME = 'nickname';
export const FAKE_OK_NAME = 'name';
export const FAKE_OK_SURNAME = 'surname';
export const FAKE_BAD_EMAIL_TOKEN = 'bad@fake.it';
export const FAKE_ALREADY_EXISTING_EMAIL = 'already@existing.email';
export const FAKE_NOT_EXISTING_EMAIL = 'not@existing.email';
export const FAKE_BAD_PASSWORD = "fake bad password";
export const FAKE_JWT_TOKEN = 'valid.jwt.token';
export const FAKE_ROOT_USER_ID = '5848543a2f7cb00c08a45450';
export const FAKE_USER_LOCAL = {
  email: FAKE_OK_EMAIL_TOKEN,
  name: FAKE_OK_USERNAME
};
export const FAKE_USER_GITHUB = {
  email: FAKE_OK_EMAIL_TOKEN,
  id: "352523",
  name: FAKE_OK_USERNAME
};
export const FAKE_USER_GOOGLE = {
  email: FAKE_OK_EMAIL_TOKEN,
  id: "7325982735892",
  name: FAKE_OK_USERNAME
};
export const FAKE_USER_FACEBOOK = {
  email: FAKE_OK_EMAIL_TOKEN,
  id: "7325982735892",
  name: FAKE_OK_USERNAME
};
export const FAKE_USER_PROFILE = {
  email: FAKE_OK_EMAIL_TOKEN,
  name: FAKE_OK_NAME,
  nickname: FAKE_OK_NICKNAME,
  surname: FAKE_OK_SURNAME,
  visible: true
};

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
        "token": FAKE_JWT_TOKEN
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
    return Observable.of(FAKE_JWT_TOKEN);
  }

  getLoggedUser(): Observable<any> {
    console.log('getLoggedUser mock entered');
    return Observable.of({
      local: FAKE_USER_LOCAL
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
    return Observable.of(FAKE_JWT_TOKEN);
  }

  getLoggedUser(): Observable<any> {
    return Observable.throw('an error message');
  }
}




// I created this fake service to mock a logged user with profile info already available
export class FakeLocalUserWithProfileAuthService {

  public loginEvent: EventEmitter<any> = new EventEmitter();

  post3dAuthAfterCallback(): Observable<any> {
    return Observable.of(FAKE_JWT_TOKEN);
  }

  getLoggedUser(): Observable<any> {
    return Observable.of({
      _id: FAKE_ROOT_USER_ID,
      local: FAKE_USER_LOCAL,
      profile: FAKE_USER_PROFILE
    });
  }
}

// I created this fake service to mock a logged user as both local and github
export class FakeUser2ServicesAuthService {

  public loginEvent: EventEmitter<any> = new EventEmitter();

  post3dAuthAfterCallback(): Observable<any> {
    return Observable.of(FAKE_JWT_TOKEN);
  }

  getLoggedUser(): Observable<any> {
    return Observable.of({
      _id: FAKE_ROOT_USER_ID,
      local: FAKE_USER_LOCAL,
      github: FAKE_USER_GITHUB,
      google: FAKE_USER_GOOGLE,
      profile: FAKE_USER_PROFILE
    });
  }
}

// I created this fake service to mock a logged user as both google and github without local user
export class FakeUser2ServicesNoLocalAuthService {

  public loginEvent: EventEmitter<any> = new EventEmitter();

  post3dAuthAfterCallback(): Observable<any> {
    return Observable.of(FAKE_JWT_TOKEN);
  }

  getLoggedUser(): Observable<any> {
    return Observable.of({
      _id: FAKE_ROOT_USER_ID,
      github: FAKE_USER_GITHUB,
      google: FAKE_USER_GOOGLE
    });
  }
}


// I created this fake service to mock a logged user as both google, facebook and github (without local)
export class FakeUser3ServicesNoLocalAuthService {

  public loginEvent: EventEmitter<any> = new EventEmitter();

  post3dAuthAfterCallback(): Observable<any> {
    return Observable.of(FAKE_JWT_TOKEN);
  }

  getLoggedUser(): Observable<any> {
    return Observable.of({
      _id: FAKE_ROOT_USER_ID,
      github: FAKE_USER_GITHUB,
      google: FAKE_USER_GOOGLE,
      facebook: FAKE_USER_FACEBOOK,
      profile: FAKE_USER_PROFILE
    });
  }
}