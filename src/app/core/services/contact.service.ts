import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { handleError } from '../utils/util';

export const URL_API_EMAIL: string = '/api/email';

@Injectable()
export class ContactService {
  constructor(private httpClient: HttpClient) {}

  sendFormWithCaptcha(contact: Object): Observable<Object> {
    return this.httpClient.post(URL_API_EMAIL, contact)
      .catch(handleError);
  }
}
