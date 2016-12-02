import { Observable } from "rxjs";

export class FakeAuthService {

  activate(emailToken: string, userName: string): Observable<any> {
    return Observable.of({
      "message":"An e-mail has been sent to " + emailToken + " with further instructions."
    });
  }
}