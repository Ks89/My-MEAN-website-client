import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from "rxjs/Subscription";

import { Project, ProjectService } from '../../../core/services/services';

@Component({
  selector: 'mmw-carousel',
  templateUrl: 'carousel.html'
})
export class CarouselComponent implements OnInit, OnDestroy {
  thumbs: Project[];

  subscription: Subscription;

  constructor(private projectService: ProjectService) {}

  ngOnInit() {
    this.subscription = this.projectService.getProjectsForHomepage().subscribe(
      val => {
        this.thumbs = val;
      }
    );
  }

  ngOnDestroy() {
    if(this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}