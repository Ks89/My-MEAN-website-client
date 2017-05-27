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
