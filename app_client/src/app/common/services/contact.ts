import {EventEmitter, Injectable, OnInit} from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import {Observable} from "rxjs/Observable";
import 'rxjs/add/operator/map';

@Injectable()
export class ContactService {
  constructor(private _http: Http) {}

  sendFormWithCaptcha(contact: Object): Observable<Object> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this._http.post('/api/email', contact)
      .map(response => response.json());
  }
}
