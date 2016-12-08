import { Observable } from "rxjs";

class FakeContact {
  constructor(
    public response: string, //google recaptcha response
    public emailFormData: {
      email: string,
      messageText: string,
      object: string
    }
  ) {}
}

export class FakeContactService {

  sendFormWithCaptcha(contact: FakeContact): Observable<Object> {
    if(!contact.response) {
      return Observable.throw({
        _body :  JSON.stringify({message: ["missing-input-response"]})
      });
    } else {
      return Observable.of({ "message": contact.emailFormData.email });
    }

  }
}