import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/operator/concatAll';
import 'rxjs/add/operator/do';

import { AuthService } from '../../core/services/services';

@Component({
  selector: 'mmw-activate-page',
  templateUrl: 'activate.html'
})
export class ActivateComponent implements OnInit, OnDestroy {
  pageHeader: any;
  emailToken: string;
  userName: string;
  activateAlert: any = { visible: false }; // hidden by default

  queryParams$: Observable<any>;

  private activateSubscription: Subscription;

  constructor(private authService: AuthService, private route: ActivatedRoute) {
    const emailToken$: Observable<string> = this.route.queryParams
      .map(params => params['emailToken'] || 'Not valid');

    const userName$: Observable<string> = this.route.queryParams
      .map(params => params['userName'] || 'Not valid')
      .do(val => this.userName = val);

    this.queryParams$ = Observable.combineLatest(emailToken$, userName$,
      (emailToken, userName) => ({emailToken, userName}));

    this.pageHeader = {
      title: 'Activate',
      strapline: ''
    };
  }

  ngOnInit() {
    this.onActivate();
  }

  ngOnDestroy() {
    if (this.activateSubscription) {
      this.activateSubscription.unsubscribe();
    }
  }

  private onActivate() {
    console.log('Calling activate...');

    this.activateSubscription = this.queryParams$
      .map(params => this.authService.activate(params.emailToken, params.userName))
      .concatAll() // equivalent to mergeAll(1)
      .subscribe(response => {
          console.log('Response');
          console.log(response);
          this.activateAlert = {
            visible: true,
            status: 'success',
            strong : 'Success',
            message: response.message
          };
        },
        err => {
          console.error(err);
          this.activateAlert = {
            visible: true,
            status: 'danger',
            strong : 'Danger',
            message: JSON.parse(err._body).message
          };
        },
        () => console.log('Done')
      );
  }
}
