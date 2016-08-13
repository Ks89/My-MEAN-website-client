import {Component} from '@angular/core';
import {Observable} from "rxjs/Observable";

import {Project, ProjectService} from '../../services/project-service';
import CarouselComponent from '../../common/carousel/carousel';


@Component({
  selector: 'home-page',
  providers: [],
  directives: [
    CarouselComponent
  ],
  styleUrls: ['app/pages/home/home.css'],
  templateUrl: 'app/pages/home/home.html'
})
export default class HomeComponent {
  products: Observable<Project[]>;
  thumbs: Observable<Project[]>;

  constructor(private productService: ProjectService) {
    this.products = this.productService.getProjects();
    this.thumbs = this.productService.getProjectsForHomepage();
  }
}
