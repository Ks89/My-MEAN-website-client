import { Observable } from "rxjs";

export class FakeAuthService {

  activate(emailToken: string, userName: string): Observable<any> {

    if(emailToken !== 'notexisting@mail.it') {
      return Observable.of({
        "message": "An e-mail has been sent to " + emailToken + " with further instructions."
      });
    } else {
      return Observable.of({
        "message":"No account with that token exists."
      });
    }
  }
}