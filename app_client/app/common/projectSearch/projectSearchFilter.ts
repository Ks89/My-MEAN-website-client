import {Injectable, Pipe, PipeTransform} from '@angular/core';
import {Project} from '../../services/project-service';

@Pipe({
  name: 'projectSearchFilter'
})
@Injectable()
export class ProjectSearchFilter implements PipeTransform {
  transform(projects: Project[], args: any[]): any {
    //if(projects !== null && projects.length>=0)  {
      //return projects.filter(project => project.name.toLowerCase().indexOf(args[0].toLowerCase()) !== -1);
    // } else {

      args = ['By'];
      
      console.log("projects: " + projects);
      console.log("args: " + args);
      if(projects === null || projects.length==0 || args==null || args[0] == null) {
        console.log("projects null or args?");
        return projects;
      } else {
        return projects.filter(project => {
          console.log("prj: " + project);
          console.log("args[0]: " + args[0]);
          return project.name.toLowerCase().indexOf(args[0].toLowerCase()) !== -1;
        });
      }
    // }
  }
}
