import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Observable} from "rxjs/Observable";
import PageHeaderComponent from '../../common/pageHeader/pageHeader';
import {Project, ProjectService} from '../../services/project-service';
//import {ImageModal} from '../../../node_modules/angular2-image-popup/directives/angular2-image-popup/image-modal-popup';

@Component({
  selector: 'projectDetail-page',
  providers: [],
  directives: [PageHeaderComponent /*, ImageModal*/],
  styleUrls: ['app/pages/projectDetail/bs_doc.css'],
  templateUrl: 'app/pages/projectDetail/projectDetail.html'
})
export default class ProjectDetailComponent {
  projects: Observable<Project[]>;
  projectId: string;
  pageHeader: any;


  // openModalWindow:boolean=false;
  //   imagePointer:number;
  //   images = [
  //     { thumb: '../../../../public/images/projects/byamanager/1.png', img: '../../../../public/images/projects/byamanager/1.png', description: 'Image 1' },
  //     { thumb: '../../../../public/images/projects/byamanager/1.png', img: '../../../../public/images/projects/byamanager/1.png', description: 'Image 2' },
  //     { thumb: '../../../../public/images/projects/byamanager/1.png', img: '../../../../public/images/projects/byamanager/1.png', description: 'Image 3' },
  //     { thumb: '../../../../public/images/projects/byamanager/1.png', img: '../../../../public/images/projects/byamanager/1.png', description: 'Image 4' },
  //     { thumb: '../../../../public/images/projects/byamanager/1.png', img: '../../../../public/images/projects/byamanager/1.png', description: 'Image 5' }
  //   ];

  constructor(route: ActivatedRoute, private projectService: ProjectService) {
    this.projectId = route.snapshot.params['projectId'];
    this.projects = this.projectService.getProjects();

    this.pageHeader = {
      title: 'Project',
      strapline: ''
    };
  }

  // OpenImageModel(imageSrc,images) {
  //    //alert('OpenImages');
  //    var imageModalPointer;
  //    for (var i = 0; i < images.length; i++) {
  //           if (imageSrc === images[i].img) {
  //             imageModalPointer = i;
  //             console.log('jhhl',i);
  //             break;
  //           }
  //      }
  //    this.openModalWindow = true;
  //    this.images = images;
  //    this.imagePointer  = imageModalPointer;
  //  }
  //  cancelImageModel() {
  //    this.openModalWindow = false;
  //  }
}
