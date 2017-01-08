import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class ContactService {
  constructor(private http: Http) {}

  sendFormWithCaptcha(contact: any): Observable<Object> {
    return this.http.post('/api/email', contact)
      .map(response => response.json())
      .catch(this.handleError);
  }

  private handleError (error: any) {
    // TODO In a real world app, we might send the error to remote logging infrastructure
    let errMsg = error.message || 'Server error';
    console.error(errMsg); // log to console instead
    return Observable.throw(new Error(errMsg));
  }
}
