import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Project, ProjectService } from '../../services';

@Component({
  selector: 'mmw-carousel',
  templateUrl: 'carousel.html'
})
export default class CarouselComponent implements OnInit {
  public thumbs: Observable<Project[]>;

  constructor(private projectService: ProjectService) {}

  ngOnInit() {
    this.thumbs = this.projectService.getProjectsForHomepage().share();
  }
}
