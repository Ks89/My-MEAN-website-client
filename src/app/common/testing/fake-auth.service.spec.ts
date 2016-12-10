import { Observable } from "rxjs";

export const FAKE_BAD_EMAIL_TOKEN = 'bad@fake.it';
export const FAKE_ALREADY_EXISTING_EMAIL = 'already@esisting.email';

class User {
  constructor(
    public name: string,
    public email: string,
    public password: string
  ) {}
}

export class FakeAuthService {

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
}