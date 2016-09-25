import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class ContactService {
  constructor(private _http: Http) {}

  sendFormWithCaptcha(contact: Object): Observable<Object> {
    return this._http.post('/api/email', contact)
      .map(response => response.json());
  }
}
