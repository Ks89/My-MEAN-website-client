/*
 * Copyright (C) 2015-2017 Stefano Cappa
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/delay';
import 'rxjs/add/observable/of';

const menu: any = [
  {
    path: '',
    children: [
      {
        path: '',
        data: {
          menu: {
            title: 'Dashboard',
            icon: 'ion-android-dashboard',
            selected: false,
            expanded: false,
            order: 0
          }
        }
      },
      {
        path: '',
        data: {
          menu: {
            title: 'Users',
            icon: 'ion-edit',
            selected: false,
            expanded: false,
            order: 100,
          }
        },
        children: [
          {
            path: 'allUsers',
            data: {
              menu: {
                title: 'All',
                url: 'allUsers'
              }
            }
          }
        ]
      },
      {
        path: '',
        data: {
          menu: {
            title: 'Newsletter',
            icon: 'ion-gear-a',
            selected: false,
            expanded: false,
            order: 250,
          }
        },
        children: [
          {
            path: 'newsletterSearch',
            data: {
              menu: {
                title: 'Search',
                url: 'newsletterSearch'
              }
            }
          }
        ]
      },
      {
        path: '',
        data: {
          menu: {
            title: 'Github',
            url: 'http://github.com/ks89',
            icon: 'ion-android-exit',
            order: 800,
            target: '_blank'
          }
        }
      }
    ]
  }
];

@Injectable()
export class MenuService {
  constructor(private http: Http) {}

  getMenu(): Observable<any[]> {
    return Observable.of(menu).delay(500);

  }

}
