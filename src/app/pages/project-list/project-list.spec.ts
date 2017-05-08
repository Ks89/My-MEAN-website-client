import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { StoreModule } from "@ngrx/store";

import { ProjectListComponent } from './project-list.component';
import { PROJECTS, FakeProjectService } from '../../shared/testing/fake-project.service.spec';
import { ProjectService } from '../../core/services/services';
import { RouterLinkStubDirective, RouterOutletStubComponent, RouterStub } from "../../shared/testing/router-stubs.spec";
import { SharedModule } from "../../shared/shared.module";
import { pageNum } from "../../shared/reducers/page-num.reducer";

let comp: ProjectListComponent;
let fixture: ComponentFixture<ProjectListComponent>;
let router: RouterStub;
let links: RouterLinkStubDirective[];
let linkDes: DebugElement[];

const BASEURL= '/projects/';

function initTestBed() {
  router = new RouterStub();

  TestBed.configureTestingModule({
    imports: [FormsModule, ReactiveFormsModule, SharedModule, NgbModule.forRoot(), StoreModule.provideStore({pageNum: pageNum}),],
    declarations: [ ProjectListComponent, RouterLinkStubDirective, RouterOutletStubComponent  ],
    // schemas:      [ NO_ERRORS_SCHEMA ]
  }).overrideComponent(ProjectListComponent, {
    set: {
      providers: [
        { provide: Router, useValue: router },
        { provide: ProjectService, useClass: FakeProjectService }
      ]
    }
  }); // not necessary with webpack .compileComponents();

  fixture = TestBed.createComponent(ProjectListComponent);
  comp = fixture.componentInstance; // ProjectListComponent test instance

  fixture.detectChanges();
  return fixture.whenStable().then(() => fixture.detectChanges());
}

describe('ProjectListComponent', () => {
  beforeEach(async(() => initTestBed()));

  it('can instantiate it', () => expect(comp).not.toBeNull());

  describe('---YES---', () => {

    beforeEach(() => {
      fixture.detectChanges();
      linkDes = fixture.debugElement.queryAll(By.directive(RouterLinkStubDirective));
      links = linkDes.map(de => de.injector.get(RouterLinkStubDirective) as RouterLinkStubDirective);
    });

    it('can display the projectlist page', () => {
      const element: DebugElement = fixture.debugElement;

      const title: DebugElement[] = element.queryAll(By.css('h1'));
      expect(title.length).toBe(1);
      expect(title[0].nativeElement.textContent.trim()).toBe('Projects');

      const message: DebugElement[] = element.queryAll(By.css('small'));
      expect(message.length).toBe(1); //because pageHeader has a <small> badge in its template
      expect(message[0].nativeElement.textContent.trim()).toBe('');
    });

    it('should check if projects are displayed correctly', () => {
      const element: DebugElement = fixture.debugElement;

      const values: DebugElement[] = element.queryAll(By.css('a'));
      expect(values.length).toBe(14); // because I have to count also page links

      // const projectLeftHrefs: DebugElement[] = element.queryAll(By.css('div.media-left a'));
      // expect(projectLeftHrefs.length).toBe(3);
      // expect(projectLeftHrefs[0].nativeElement.getAttribute('href')).toBe(BASEURL + PROJECTS[0]._id);
      // expect(projectLeftHrefs[1].nativeElement.getAttribute('href')).toBe(BASEURL + PROJECTS[1]._id);
      // expect(projectLeftHrefs[2].nativeElement.getAttribute('href')).toBe(BASEURL + PROJECTS[2]._id);

      const projectLeftImages: DebugElement[] = element.queryAll(By.css('img.d-flex.mr-3'));
      expect(projectLeftImages.length).toBe(3);
      expect(projectLeftImages[0].nativeElement.getAttribute('src')).toBe(PROJECTS[0].iconPath);
      expect(projectLeftImages[1].nativeElement.getAttribute('src')).toBe(PROJECTS[1].iconPath);
      expect(projectLeftImages[2].nativeElement.getAttribute('src')).toBe(PROJECTS[2].iconPath);

      const projectHeaders: DebugElement[] = element.queryAll(By.css('h4.mt-0.mb-1 a'));
      expect(projectHeaders.length).toBe(6);
      expect(projectHeaders[1].nativeElement.textContent).toBe(PROJECTS[0].name);
      expect(projectHeaders[3].nativeElement.textContent).toBe(PROJECTS[1].name);
      expect(projectHeaders[5].nativeElement.textContent).toBe(PROJECTS[2].name);
      // expect(projectHeaders[1].nativeElement.getAttribute('href')).toBe(BASEURL + PROJECTS[0]._id);
      // expect(projectHeaders[3].nativeElement.getAttribute('href')).toBe(BASEURL + PROJECTS[1]._id);
      // expect(projectHeaders[5].nativeElement.getAttribute('href')).toBe(BASEURL + PROJECTS[2]._id);
      // because there are also github icons
      // expect(projectHeaders[0].nativeElement.getAttribute('src')).toBe(PROJECTS[0].iconPath);
      // expect(projectHeaders[2].nativeElement.getAttribute('src')).toBe(PROJECTS[1].iconPath);
      // expect(projectHeaders[4].nativeElement.getAttribute('src')).toBe(PROJECTS[2].iconPath);
      expect(projectHeaders[0].nativeElement.getAttribute('href')).toBe(PROJECTS[0].url);
      expect(projectHeaders[2].nativeElement.getAttribute('href')).toBe(PROJECTS[1].url);
      expect(projectHeaders[4].nativeElement.getAttribute('href')).toBe(PROJECTS[2].url);

      const shortDescriptions: DebugElement[] = element.queryAll(By.css('p.name'));
      expect(shortDescriptions.length).toBe(3);
      expect(shortDescriptions[0].nativeElement.textContent).toBe(PROJECTS[0].shortDescription);
      expect(shortDescriptions[1].nativeElement.textContent).toBe(PROJECTS[1].shortDescription);
      expect(shortDescriptions[2].nativeElement.textContent).toBe(PROJECTS[2].shortDescription);

      const badges: DebugElement[] = element.queryAll(By.css('span.badge.badge-warning'));
      expect(badges.length).toBe(9);
      expect(badges[0].nativeElement.textContent.trim()).toBe(PROJECTS[0].tags[0]);
      expect(badges[1].nativeElement.textContent.trim()).toBe(PROJECTS[0].tags[1]);
      expect(badges[2].nativeElement.textContent.trim()).toBe(PROJECTS[0].tags[2]);
      expect(badges[3].nativeElement.textContent.trim()).toBe(PROJECTS[1].tags[0]);
      expect(badges[4].nativeElement.textContent.trim()).toBe(PROJECTS[1].tags[1]);
      expect(badges[5].nativeElement.textContent.trim()).toBe(PROJECTS[1].tags[2]);
      expect(badges[6].nativeElement.textContent.trim()).toBe(PROJECTS[2].tags[0]);
      expect(badges[7].nativeElement.textContent.trim()).toBe(PROJECTS[2].tags[1]);
      expect(badges[8].nativeElement.textContent.trim()).toBe(PROJECTS[2].tags[2]);

      const timelineHeader: DebugElement = element.query(By.css('h3#timeline'));
      expect(timelineHeader.nativeElement.textContent).toBe(comp.sidebarTitle);

      const timelineTitles: DebugElement[] = element.queryAll(By.css('h4.timeline-title'));
      expect(timelineTitles.length).toBe(5);
      expect(timelineTitles[0].nativeElement.textContent).toBe(comp.sidebar.timeline[0].title);
      expect(timelineTitles[1].nativeElement.textContent).toBe(comp.sidebar.timeline[1].title);
      expect(timelineTitles[2].nativeElement.textContent).toBe(comp.sidebar.timeline[2].title);
      expect(timelineTitles[3].nativeElement.textContent).toBe(comp.sidebar.timeline[3].title);
      expect(timelineTitles[4].nativeElement.textContent).toBe(comp.sidebar.timeline[4].title);

      const timelineTexts: DebugElement[] = element.queryAll(By.css('div.timeline-body p'));
      expect(timelineTexts.length).toBe(5);
      expect(timelineTexts[0].nativeElement.textContent).toBe(comp.sidebar.timeline[0].body);
      expect(timelineTexts[1].nativeElement.textContent).toBe(comp.sidebar.timeline[1].body);
      expect(timelineTexts[2].nativeElement.textContent).toBe(comp.sidebar.timeline[2].body);
      expect(timelineTexts[3].nativeElement.textContent).toBe(comp.sidebar.timeline[3].body);
      expect(timelineTexts[4].nativeElement.textContent).toBe(comp.sidebar.timeline[4].body);

      const timelineIconBadge: DebugElement = element.query(By.css('div.timeline-badge.badge i'));
      expect(timelineIconBadge.nativeElement.getAttribute('class')).toBe('fa fa-' + comp.sidebar.timeline[0].icon);
      const timelineIconDanger: DebugElement = element.query(By.css('div.timeline-badge.danger i'));
      expect(timelineIconDanger.nativeElement.getAttribute('class')).toBe('fa fa-' + comp.sidebar.timeline[1].icon);
      const timelineIconWarning: DebugElement = element.query(By.css('div.timeline-badge.warning i'));
      expect(timelineIconWarning.nativeElement.getAttribute('class')).toBe('fa fa-' + comp.sidebar.timeline[2].icon);
      const timelineIconInfo: DebugElement = element.query(By.css('div.timeline-badge.info i'));
      expect(timelineIconInfo.nativeElement.getAttribute('class')).toBe('fa fa-' + comp.sidebar.timeline[3].icon);
      const timelineIconSuccess: DebugElement = element.query(By.css('div.timeline-badge.success i'));
      expect(timelineIconSuccess.nativeElement.getAttribute('class')).toBe('fa fa-' + comp.sidebar.timeline[4].icon);
    });

    // Test filtering utility
    it('should filter a valid project with null/undefined value', () => {
      expect(comp.filterCallback(PROJECTS[0], null)).toBeTruthy();
      expect(comp.filterCallback(PROJECTS[0], undefined)).toBeTruthy();
    });

    it('should filter a valid project by name', () => {
      expect(comp.filterCallback(PROJECTS[0], 'BYA')).toBeTruthy();
      expect(comp.filterCallback(PROJECTS[0], 'bya')).toBeTruthy();
      expect(comp.filterCallback(PROJECTS[0], 'bYA')).toBeTruthy();
    });

    it('should filter a valid project by shortDescription', () => {
      expect(comp.filterCallback(PROJECTS[0], '1')).toBeTruthy();
      expect(comp.filterCallback(PROJECTS[0], ' 1')).toBeTruthy();
      expect(comp.filterCallback(PROJECTS[0], 'short description 1')).toBeTruthy();
      expect(comp.filterCallback(PROJECTS[0], 'SHORT DESCRIPTION 1')).toBeTruthy();
      expect(comp.filterCallback(PROJECTS[0], 'Description 1')).toBeTruthy();
    });
  });

  describe('---YES---', () => {
    // Test filtering utility
    it('should filter a null/undefined project with a null/undefined value', () => {
      expect(comp.filterCallback(null, null)).toBeTruthy();
      expect(comp.filterCallback(undefined, null)).toBeTruthy();
      expect(comp.filterCallback(null, undefined)).toBeTruthy();
      expect(comp.filterCallback(undefined, undefined)).toBeTruthy();
    });

    it('should filter a null/undefined project with a valid value', () => {
      expect(comp.filterCallback(null, '')).toBeFalsy();
      expect(comp.filterCallback(undefined, '')).toBeFalsy();
    });

    it('should filter a valid project with a valid missing value', () => {
      expect(comp.filterCallback(PROJECTS[1], 'Bya')).toBeFalsy();
    });
  });
});
