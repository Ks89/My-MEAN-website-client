import {Component} from '@angular/core';
import {Observable} from "rxjs/Observable";

import {Project, ProductService} from '../../services/product-service';
import CarouselComponent from '../carousel/carousel';


@Component({
  selector: 'auction-home-page',
  providers: [],
  directives: [
    CarouselComponent
  ],
  styleUrls: ['app/components/home/home.css'],
  templateUrl: 'app/components/home/home.html'
})
export default class HomeComponent {
  products: Observable<Project[]>;
  bigThumbs: Observable<Project[]>;
  thumbs: Observable<Project[]>;

  constructor(private productService: ProductService) {
    this.products = this.productService.getProjects();
    this.bigThumbs = this.productService.getProjectsForHomepage();
    this.thumbs = this.productService.getProjectsForHomepage();

    this.productService.searchEvent
      .subscribe(
        params => this.products = this.productService.searchEvent(params),
          err =>  console.log("Can't get products. Error code: %s, URL: %s "),
        () => console.log('DONE')
      );
  }
}
