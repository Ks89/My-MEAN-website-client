import {Injectable, Pipe, PipeTransform} from '@angular/core';

import { Project } from '../../services';

@Pipe({
  name: 'mmwProjectSearchPipe'
})
@Injectable()
export class ProjectSearchPipe implements PipeTransform {
  transform (projects: Project[], args: string): any {
    if(args === null || args === undefined) {
      return projects;
    }
    if (projects === null || projects.length === 0) {
      return projects;
    } else {
      return projects.filter(project => {
        return project.name.toLowerCase().includes(args.toLowerCase()) ||
               project.shortDescription.toLowerCase().includes(args.toLowerCase());
      });
    }
  }
}
