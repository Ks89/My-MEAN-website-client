import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AuthService } from '../../common/services';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'mmw-activate-page',
  templateUrl: 'activate.html'
})
export default class ActivateComponent implements OnInit, OnDestroy {
  public pageHeader: Object;
  public emailToken: string;
  public userName: string;
  public activateAlert: Object = { visible: false }; // hidden by default
  private subscription: Subscription;

  constructor(private authService: AuthService,
              private route: ActivatedRoute) {
    this.emailToken = route.snapshot.params['emailToken'];
    this.userName = route.snapshot.params['userName'];

    this.pageHeader = {
      title: 'Activate',
      strapline: ''
    };
  }

  ngOnInit() {
    this.onActivate();
  }

  private onActivate() {
    console.log('Calling activate...');

    this.authService.activate(this.emailToken, this.userName)
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

  ngOnDestroy(): any {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
