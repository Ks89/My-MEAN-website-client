import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/share';

import { TranslateService } from '@ngx-translate/core';

import { Project, ProjectService } from '../../core/services/services';

@Component({
  selector: 'mmw-home-page',
  styleUrls: ['home.scss'],
  templateUrl: 'home.html'
})
export class HomeComponent implements OnInit, OnDestroy {
  thumbs: Observable<Project[]>;

  pageHeader: any = { title:'', strapline: '' };
  message: string;

  private i18nSubscription: Subscription;

  constructor(private projectService: ProjectService,
              private translate: TranslateService) {
    this.message = 'Welcome to my website';
  }

  ngOnInit() {
    this.thumbs = this.projectService.getProjectsForHomepage().share();

    this.i18nSubscription = this.translate.get('HOME')
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
