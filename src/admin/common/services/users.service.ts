import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
// import 'rxjs/add/operator/delay';
// import 'rxjs/add/operator/from';
import 'rxjs/add/operator/catch';


export class User {
  constructor(
    public _id: string,
    public local_name: string,
    public local_email: string) {
  }
}

const users: User[] = [
  {
    _id: 'id1',
    local_name: 'name1',
    local_email: 'email1'
  },
  {
    _id: 'id2',
    local_name: 'name2',
    local_email: 'email2'
  },
  {
    _id: 'id3',
    local_name: 'name3',
    local_email: 'email3'
  },
  {
    _id: 'id4',
    local_name: 'name4',
    local_email: 'email4'
  },
  {
    _id: 'id5',
    local_name: 'name5',
    local_email: 'email5'
  },
  {
    _id: 'id6',
    local_name: 'name6',
    local_email: 'email6'
  },
  {
    _id: 'id7',
    local_name: 'name7',
    local_email: 'email7'
  },
  {
    _id: 'id8',
    local_name: 'name8',
    local_email: 'email8'
  },
  {
    _id: 'id9',
    local_name: 'name9',
    local_email: 'email9'
  },
  {
    _id: 'id10',
    local_name: 'name10',
    local_email: 'email10'
  },
  {
    _id: 'id11',
    local_name: 'name11',
    local_email: 'email11'
  }
];

@Injectable()
export class UserService {
  constructor(private http: Http) {}

  getUsers(page: number, pageSize: number): Observable<User[]> {
    let upper = page * pageSize;
    let lower = upper - (pageSize - 1) - 1;
    console.log("upper: " + upper);
    console.log("lower: " + lower);
    // return  Observable.of(users).skip(1);

    // return Observable.of(users).take(users.length);
    return Observable.of(users);

  }

}
