import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'mmw-cv-page',
  templateUrl: 'cv.html'
})
export class CvComponent implements OnInit, OnDestroy {
  pageHeader: any = { title:'', strapline: '' };

  private i18nSubscription: Subscription;

  constructor(private translate: TranslateService) {}

  ngOnInit() {
    this.i18nSubscription = this.translate.get('CV')
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
