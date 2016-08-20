import {Injectable, Pipe, PipeTransform} from '@angular/core';
import {Project} from '../../services/projects';

@Pipe({
  name: 'projectSearchPipe'
})
@Injectable()
export class ProjectSearchPipe implements PipeTransform {
  transform(projects: Project[], args: string): any {
    if(projects === null || projects.length == 0) {
      return projects;
    } else {
      return projects.filter(project => {
        return project.name.toLowerCase().includes(args.toLowerCase()) ||
               project.shortDescription.toLowerCase().includes(args.toLowerCase());
      });
    }
  }
}
