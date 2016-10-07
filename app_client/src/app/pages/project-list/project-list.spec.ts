import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA }          from '@angular/core';
import { By }              from '@angular/platform-browser';
import { DebugElement }    from '@angular/core';
import { Observable } from 'rxjs/Observable';

import ProjectListComponent from './project-list.component';
import { ProjectSearchPipe } from '../../common/pipes';
import { PROJECTS, FakeProjectService } from '../../common/services/fake-project.service.spec';
import { Project, ProjectService } from '../../common/services';

let comp:    ProjectListComponent;
let fixture: ComponentFixture<ProjectListComponent>;
let element:      DebugElement;
let projectService: any;
let projectServiceStub: any;
let spy: jasmine.Spy;


describe('ProjectListComponent', () => {
  beforeEach(() => {
    // projectServiceStub = {
    //   get getProjects: Observable.of([{}])
    // };

    TestBed.configureTestingModule({
      declarations: [ ProjectListComponent, ProjectSearchPipe ], // declare the test component
      providers: [
        { provide: ProjectService, useClass: FakeProjectService }
      ],
      // providers:    [ {provide: ProjectService, useValue: projectServiceStub } ],
      schemas:      [ NO_ERRORS_SCHEMA ]
    });
    fixture = TestBed.createComponent(ProjectListComponent);

    comp = fixture.componentInstance; // ProjectListComponent test instance

    fixture.detectChanges();

    fixture.whenStable().then(() => {
      // got the heroes and updated component
      // change detection updates the view
      fixture.detectChanges();
      // page = new Page();
    });

    // // ProjectService actually injected into the component
    // projectService = fixture.debugElement.injector.get(ProjectService);
    //
    // spy = spyOn(projectService, 'getProjects').and.returnValue(Observable.of([{}]));
  });

  it('should request login if not logged in', () => {

    //OBVIOUSLY NOT WORKING

    fixture.detectChanges(); // trigger data binding
    const element = fixture.debugElement;

    const values = element.queryAll(By.css('a'));

    expect(values.length).toBe(9);

    // expect(values[3].nativeElement.textContent).toBe('#/projects/57632b61009f08db1623b606');

    const pValues = element.queryAll(By.css('p.name'));

    expect(pValues.length).toBe(3);

    expect(pValues[0].nativeElement.textContent).toBe('dsffsduhfsduaf asfyhasfuas fy8shfuiqw fUWQHBFUIWEBQ fewhfuwfnoeiwb ewuhfiewn');

  });

});
