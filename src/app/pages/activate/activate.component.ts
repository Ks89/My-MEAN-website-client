import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/operator/concatAll';
import 'rxjs/add/operator/do';

import { TranslateService } from '@ngx-translate/core';

import { AuthService } from '../../core/services/services';

@Component({
  selector: 'mmw-activate-page',
  templateUrl: 'activate.html'
})
export class ActivateComponent implements OnInit, OnDestroy {
  pageHeader: any = { title:'', strapline: '' };
  emailToken: string;
  userName: string;
  activateAlert: any = { visible: false }; // hidden by default

  queryParams$: Observable<any>;

  private activateSubscription: Subscription;
  private i18nSubscription: Subscription;

  constructor(private authService: AuthService,
              private route: ActivatedRoute,
              private translate: TranslateService) {

    const emailToken$: Observable<string> = this.route.queryParams
      .map(params => params['emailToken'] || 'Not valid');

    const userName$: Observable<string> = this.route.queryParams
      .map(params => params['userName'] || 'Not valid')
      .do(val => this.userName = val);

    this.queryParams$ = Observable
      .combineLatest(emailToken$, userName$, (emailToken, userName) => ({emailToken, userName}));
  }

  ngOnInit() {
    this.onActivate();

    this.i18nSubscription = this.translate.get('ACTIVATE')
      .subscribe((res: any) => {
        this.pageHeader = {
          title: res['TITLE'],
          strapline: res['STRAPLINE']
        };
      });
  }

  ngOnDestroy() {
    if (this.activateSubscription) {
      this.activateSubscription.unsubscribe();
    }

    if (this.i18nSubscription) {
      this.i18nSubscription.unsubscribe();
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
            strong : 'Error',
            message: err.message
          };
        },
        () => console.log('Done')
      );
  }
}
