import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'mmw-about-page',
  templateUrl: 'about.html'
})
export class AboutComponent implements OnInit, OnDestroy {
  pageHeader: any = { title:'', strapline: '' };

  private i18nSubscription: Subscription;

  constructor(private translate: TranslateService) {}

  ngOnInit() {
    this.i18nSubscription = this.translate.get('ABOUT')
      .subscribe((res: any) => {
        this.pageHeader = {
          title: res['TITLE'],
          strapline: res['STRAPLINE']
        };
      });
  }

  ngOnDestroy() {
    if (this.i18nSubscription) {
      this.i18nSubscription.unsubscribe();
    }
  }
}
