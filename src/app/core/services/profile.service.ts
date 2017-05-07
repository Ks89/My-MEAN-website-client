import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

export class Response {
  constructor(public message: string) {}
}

@Injectable()
export class ProfileService {
  constructor(private http: Http) {}

  update(profile: any): Observable<Response> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });

    return this.http.post('/api/profile', profile, options)
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
