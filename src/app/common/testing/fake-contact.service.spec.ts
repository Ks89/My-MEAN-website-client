import { Observable } from "rxjs";

export class FakeContactService {

  sendFormWithCaptcha(contact: any): Observable<Object> {
    return Observable.of({ "message": contact.emailFormData.email });
  }
}