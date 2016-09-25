import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

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
      .map(response => response.json());
  }
}
