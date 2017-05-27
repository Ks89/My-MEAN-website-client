import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class ContactService {
  constructor(private http: Http) {}

  sendFormWithCaptcha(contact: Object): Observable<Object> {
    return this.http.post('/api/email', contact)
      .map(response => response.json())
      .catch(this.handleError);
  }

  private handleError(error: any) {
    // TODO add remote logging infrastructure
    let message: string;
    if(error && error._body) {
      message = JSON.parse(error._body).message;
    }
    console.error(message); // log to console instead
    return Observable.throw(new Error(message));
  }
}
