import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA }          from '@angular/core';
import { By }              from '@angular/platform-browser';
import { DebugElement }    from '@angular/core';
import { Observable } from 'rxjs/Observable';

import ProjectListComponent from './project-list.component';
import { ProjectSearchPipe } from '../../common/pipes';
import { PROJECTS, FakeProjectService } from '../../common/testing/fake-project.service.spec';
import { Project, ProjectService } from '../../common/services';

let comp:    ProjectListComponent;
let fixture: ComponentFixture<ProjectListComponent>;
let element:      DebugElement;
let projectService: any;
let projectServiceStub: any;
let spy: jasmine.Spy;

const baseUrl = '#/projects/';

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

    const projectHeaders = element.queryAll(By.css('h4.media-heading a'));
    expect(projectHeaders.length).toBe(6);
    expect(projectHeaders[1].nativeElement.textContent).toBe(PROJECTS[0].name);
    expect(projectHeaders[3].nativeElement.textContent).toBe(PROJECTS[1].name);
    expect(projectHeaders[5].nativeElement.textContent).toBe(PROJECTS[2].name);
    // expect(projectHeaders[1].nativeElement.href).toBe(baseUrl + PROJECTS[0]._id);
    // expect(projectHeaders[3].nativeElement.href).toBe(baseUrl + PROJECTS[1]._id);
    // expect(projectHeaders[5].nativeElement.href).toBe(baseUrl + PROJECTS[2]._id);
    //because there are also github icons
    expect(projectHeaders[0].nativeElement.href).toBe(PROJECTS[0].url);
    expect(projectHeaders[2].nativeElement.href).toBe(PROJECTS[1].url);
    expect(projectHeaders[4].nativeElement.href).toBe(PROJECTS[2].url);

    const shortDescriptions = element.queryAll(By.css('p.name'));
    expect(shortDescriptions.length).toBe(3);
    expect(shortDescriptions[0].nativeElement.textContent).toBe(PROJECTS[0].shortDescription);
    expect(shortDescriptions[1].nativeElement.textContent).toBe(PROJECTS[1].shortDescription);
    expect(shortDescriptions[2].nativeElement.textContent).toBe(PROJECTS[2].shortDescription);

    const tags = element.queryAll(By.css('span.tag.tag-pill.tag-warning'));
    expect(tags.length).toBe(9);
    expect(tags[0].nativeElement.textContent.trim()).toBe(PROJECTS[0].tags[0]);
    expect(tags[1].nativeElement.textContent.trim()).toBe(PROJECTS[0].tags[1]);
    expect(tags[2].nativeElement.textContent.trim()).toBe(PROJECTS[0].tags[2]);
    expect(tags[3].nativeElement.textContent.trim()).toBe(PROJECTS[1].tags[0]);
    expect(tags[4].nativeElement.textContent.trim()).toBe(PROJECTS[1].tags[1]);
    expect(tags[5].nativeElement.textContent.trim()).toBe(PROJECTS[1].tags[2]);
    expect(tags[6].nativeElement.textContent.trim()).toBe(PROJECTS[2].tags[0]);
    expect(tags[7].nativeElement.textContent.trim()).toBe(PROJECTS[2].tags[1]);
    expect(tags[8].nativeElement.textContent.trim()).toBe(PROJECTS[2].tags[2]);

    const timelineHeader = element.query(By.css('h3#timeline'));
    expect(timelineHeader.nativeElement.textContent).toBe(comp.sidebarTitle);

    const timelineTitles = element.queryAll(By.css('h4.timeline-title'));
    expect(timelineTitles.length).toBe(5);
    expect(timelineTitles[0].nativeElement.textContent).toBe(comp.sidebar.timeline[0].title);
    expect(timelineTitles[1].nativeElement.textContent).toBe(comp.sidebar.timeline[1].title);
    expect(timelineTitles[2].nativeElement.textContent).toBe(comp.sidebar.timeline[2].title);
    expect(timelineTitles[3].nativeElement.textContent).toBe(comp.sidebar.timeline[3].title);
    expect(timelineTitles[4].nativeElement.textContent).toBe(comp.sidebar.timeline[4].title);

    const timelineTexts = element.queryAll(By.css('div.timeline-body p'));
    expect(timelineTexts.length).toBe(5);
    expect(timelineTexts[0].nativeElement.textContent).toBe(comp.sidebar.timeline[0].body);
    expect(timelineTexts[1].nativeElement.textContent).toBe(comp.sidebar.timeline[1].body);
    expect(timelineTexts[2].nativeElement.textContent).toBe(comp.sidebar.timeline[2].body);
    expect(timelineTexts[3].nativeElement.textContent).toBe(comp.sidebar.timeline[3].body);
    expect(timelineTexts[4].nativeElement.textContent).toBe(comp.sidebar.timeline[4].body);

    // const timelineIconBadge = element.query(By.css('div.timeline-badge.badge i'));
    // expect(timelineIconBadge.nativeElement.classes['fa fa-' + comp.sidebar.timeline[0].icon]).toBe(true, 'it is ok');
    // const timelineIconDanger = element.query(By.css('div.timeline-badge.danger i'));
    // expect(timelineIconDanger.nativeElement.css).toBe('fa fa-' + comp.sidebar.timeline[1].icon);
    // const timelineIconWarning = element.query(By.css('div.timeline-badge.warning i'));
    // expect(timelineIconWarning.nativeElement.css).toBe('fa fa-' + comp.sidebar.timeline[2].icon);
    // const timelineIconInfo = element.query(By.css('div.timeline-badge.info i'));
    // expect(timelineIconInfo.nativeElement.css).toBe('fa fa-' + comp.sidebar.timeline[3].icon);
    // const timelineIconSuccess = element.query(By.css('div.timeline-badge.success i'));
    // expect(timelineIconSuccess.nativeElement.css).toBe('fa fa-' + comp.sidebar.timeline[4].icon);

  });

  // it('should request login if not logged in', fakeAsync(() => {
  //   tick();
  //   fixture.detectChanges(); // trigger data binding
  //   const element = fixture.debugElement;
  //
  //   const inputFilterEl: HTMLInputElement = element.query(By.css('input')).nativeElement;
  //   inputFilterEl.value = "BY";
  //
  //   tick();
  //   fixture.detectChanges();
  //
  //   inputFilterEl.dispatchEvent(newEvent('input'));
  //   inputFilterEl.dispatchEvent(new Event('input',{"bubbles":true, "cancelable":false}));
  //
  //   tick();
  //   fixture.detectChanges();
  //
  //   // expect(inputFilterEl.value).toBe("BY", 'component hero has new name');
  //   //fixture.detectChanges();
  //   expect(inputFilterEl.value).toBe("BY", 'component hero has new name');
  //
  //   const projectHeadersFiltered = element.queryAll(By.css('h4.media-heading a'));
  //   expect(projectHeadersFiltered.length).toBe(3);
  //   expect(projectHeadersFiltered[1].nativeElement.textContent).toBe(PROJECTS[0].name);
  //
  // });

});

function newEvent(eventName: string, bubbles = false, cancelable = false) {
  let evt = document.createEvent('CustomEvent');  // MUST be 'CustomEvent'
  evt.initCustomEvent(eventName, bubbles, cancelable, null);
  return evt;
}
