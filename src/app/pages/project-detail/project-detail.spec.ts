/*
 * Copyright (C) 2015-2017 Stefano Cappa
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { Router } from "@angular/router";
import { By } from '@angular/platform-browser';

import { ProjectDetailComponent } from './project-detail.component';
import { RouterLinkStubDirective, RouterOutletStubComponent, ActivatedRoute, ActivatedRouteStub, RouterStub }   from '../../shared/testing/router-stubs.spec';
import { ProjectService } from "../../shared/services/projects.service";
import { FakeProjectService, PROJECTS, WRONG_PROJECT_ID } from '../../shared/testing/fake-project.service.spec';
import { PageHeaderComponent } from "../../shared/components/page-header/page-header.component";
import { ModalGalleryModule } from "angular-modal-gallery";

let comp: ProjectDetailComponent;
let fixture: ComponentFixture<ProjectDetailComponent>;
let activatedRoute: ActivatedRouteStub;
let router: RouterStub;
let links: RouterLinkStubDirective[];
let linkDes: DebugElement[];

const DEFAULT_PROJECT_TITLE = 'Project';

function initTestBed(projectId) {
  activatedRoute = new ActivatedRouteStub();
  activatedRoute.testParams = { projectId: projectId };

  TestBed.configureTestingModule({
    imports: [ ModalGalleryModule.forRoot() ],
    declarations: [ ProjectDetailComponent, PageHeaderComponent, RouterLinkStubDirective, RouterOutletStubComponent ],
    // schemas:      [ NO_ERRORS_SCHEMA ]
  }).overrideComponent(ProjectDetailComponent, {
    set: {
      providers: [
        { provide: Router, useValue: router },
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: ProjectService, useClass: FakeProjectService }
      ]
    }
  }); // not necessary with webpack .compileComponents();

  fixture = TestBed.createComponent(ProjectDetailComponent);
  comp = fixture.componentInstance;

  fixture.detectChanges();
  return fixture.whenStable().then(() => fixture.detectChanges());
}


describe('ProjectDetailComponent', () => {
  beforeEach( async(() => initTestBed(PROJECTS[0]._id)));

  it('can instantiate it', () => expect(comp).not.toBeNull());

  describe('---YES---', () => {
    beforeEach(() => {
      fixture.detectChanges();
      linkDes = fixture.debugElement.queryAll(By.directive(RouterLinkStubDirective));
      links = linkDes.map(de => de.injector.get(RouterLinkStubDirective) as RouterLinkStubDirective);
    });

    it('should display the sidebar', () => checkSidebar(fixture.debugElement));

    it('should display the project detail page', () => {
      const element: DebugElement = fixture.debugElement;

      checkTitles(element, PROJECTS[0].name);

      const description: DebugElement = element.query(By.css('section#Description div'));
      expect(description.nativeElement.textContent.trim()).toBe(PROJECTS[0].description);

      const changelog: DebugElement = element.query(By.css('div#Changelog div'));
      expect(changelog.nativeElement.textContent.trim()).toBe(PROJECTS[0].changelog[0]);

      const releases: DebugElement = element.query(By.css('div#Releases div'));
      expect(releases.nativeElement.textContent.trim()).toBe(PROJECTS[0].releases[0]);

      const features: DebugElement = element.query(By.css('section#Features div'));
      expect(features.nativeElement.textContent.trim()).toBe(PROJECTS[0].features[0]);

      const futureExtensions: DebugElement = element.query(By.css('section#FutureExtensions div'));
      expect(futureExtensions.nativeElement.textContent.trim()).toBe(PROJECTS[0].futureExtensions[0]);

      // TODO find a way to test this - probably it's impossible
      // const video: DebugElement[] = element.queryAll(By.css('section#Video div'));
      // expect(video.length).toBe(1);
      // expect(video[0].nativeElement.textContent.trim()).toBe(PROJECTS[0].video);

      const images: DebugElement[] = element.queryAll(By.css('img.ng-thumb'));
      expect(images.length).toBe(PROJECTS[0].gallery.length);
      expect(images[0].nativeElement.getAttribute('src')).toBe(PROJECTS[0].gallery[0].thumb);
      expect(images[1].nativeElement.getAttribute('src')).toBe(PROJECTS[0].gallery[1].thumb);
      expect(images[2].nativeElement.getAttribute('src')).toBe(PROJECTS[0].gallery[2].thumb);
      expect(images[3].nativeElement.getAttribute('src')).toBe(PROJECTS[0].gallery[3].thumb);
      expect(images[4].nativeElement.getAttribute('src')).toBe(PROJECTS[0].gallery[4].thumb);
      expect(images[5].nativeElement.getAttribute('src')).toBe(PROJECTS[0].gallery[5].thumb);
      expect(images[6].nativeElement.getAttribute('src')).toBe(PROJECTS[0].gallery[6].thumb);
      expect(images[7].nativeElement.getAttribute('src')).toBe(PROJECTS[0].gallery[7].thumb);
      expect(images[8].nativeElement.getAttribute('src')).toBe(PROJECTS[0].gallery[8].thumb);
      expect(images[9].nativeElement.getAttribute('src')).toBe(PROJECTS[0].gallery[9].thumb);
      expect(images[10].nativeElement.getAttribute('src')).toBe(PROJECTS[0].gallery[10].thumb);

      const license: DebugElement = element.query(By.css('section#License div'));
      expect(license.nativeElement.textContent.trim()).toBe(PROJECTS[0].licenseText);
    });
  });

  describe('---ERROR---', () => {
    beforeEach( async(() => {
      TestBed.resetTestingModule();
      return initTestBed(WRONG_PROJECT_ID);
    }));

    it('should display the sidebar', () => checkSidebar(fixture.debugElement));

    it('should NOT display the project detail, because project._id is wrong', () => {
      const element: DebugElement = fixture.debugElement;

      checkTitles(element, DEFAULT_PROJECT_TITLE);

      // FIXME Broken with Internet Explorer on AppVeyor, instead of '' there is a 'null'. Why?
      // const description: DebugElement = element.query(By.css('section#Description div'));
      // expect(description.nativeElement.textContent.trim()).toBe('');
      //
      // const changelog: DebugElement = element.query(By.css('div#Changelog div'));
      // expect(changelog.nativeElement.textContent.trim()).toBe('');
      //
      // const releases: DebugElement = element.query(By.css('div#Releases div'));
      // expect(releases.nativeElement.textContent.trim()).toBe('');
      //
      // const features: DebugElement = element.query(By.css('section#Features div'));
      // expect(features.nativeElement.textContent.trim()).toBe('');
      //
      // const futureExtensions: DebugElement = element.query(By.css('section#FutureExtensions div'));
      // expect(futureExtensions.nativeElement.textContent.trim()).toBe('');

      // TODO find a way to test this - probably it's impossible
      // const video: DebugElement[] = element.queryAll(By.css('section#Video div'));
      // expect(video.length).toBe(1);
      // expect(video[0].nativeElement.textContent.trim()).toBe('');

      const images: DebugElement[] = element.queryAll(By.css('img.ng-thumb'));
      expect(images.length).toBe(0);

      // FIXME Broken with Internet Explorer on AppVeyor, instead of '' there is a 'null'. Why?
      // const license: DebugElement = element.query(By.css('section#License div'));
      // expect(license.nativeElement.textContent.trim()).toBe('');
    });
  });
});

function checkSidebar(element: DebugElement) {
  expect(element.query(By.css('a#Description')).nativeElement.textContent.trim()).toBe('Description');
  expect(element.query(By.css('a#News')).nativeElement.textContent.trim()).toBe('News');
  expect(element.query(By.css('a#Features')).nativeElement.textContent.trim()).toBe('Features');
  expect(element.query(By.css('a#FutureExtensions')).nativeElement.textContent.trim()).toBe('Future extensions');
  expect(element.query(By.css('a#Video')).nativeElement.textContent.trim()).toBe('Video');
  expect(element.query(By.css('a#Images')).nativeElement.textContent.trim()).toBe('Images');
  expect(element.query(By.css('a#License')).nativeElement.textContent.trim()).toBe('License');

  // check links
  expect(element.query(By.css('a#Description')).nativeElement.getAttribute('href')).toBe('#Description');
  expect(element.query(By.css('a#News')).nativeElement.getAttribute('href')).toBe('#News');
  expect(element.query(By.css('a#Features')).nativeElement.getAttribute('href')).toBe('#Features');
  expect(element.query(By.css('a#FutureExtensions')).nativeElement.getAttribute('href')).toBe('#FutureExtensions');
  expect(element.query(By.css('a#Video')).nativeElement.getAttribute('href')).toBe('#Video');
  expect(element.query(By.css('a#Images')).nativeElement.getAttribute('href')).toBe('#Images');
  expect(element.query(By.css('a#License')).nativeElement.getAttribute('href')).toBe('#License');
}

function checkTitles(element: DebugElement, projectName: string) {
  const h1: DebugElement[] = element.queryAll(By.css('h1'));
  expect(h1.length).toBe(1); // without a valid id, title will be simply `Project`

  if(projectName === DEFAULT_PROJECT_TITLE) {
    expect(h1[0].nativeElement.textContent.trim()).toBe('');
  } else {
    expect(h1[0].nativeElement.textContent.trim()).toBe(projectName);
  }

  const h3: DebugElement[] = element.queryAll(By.css('h3'));
  expect(h3.length).toBe(7);
  expect(h3[0].nativeElement.textContent.trim()).toBe('Description');
  expect(h3[1].nativeElement.textContent.trim()).toBe('News');
  expect(h3[2].nativeElement.textContent.trim()).toBe('Features');
  expect(h3[3].nativeElement.textContent.trim()).toBe('Future extensions');
  expect(h3[4].nativeElement.textContent.trim()).toBe('Video');
  expect(h3[5].nativeElement.textContent.trim()).toBe('Images');
  expect(h3[6].nativeElement.textContent.trim()).toBe('License');

  const h4: DebugElement[] = element.queryAll(By.css('h4'));
  expect(h4.length).toBe(2);
  expect(h4[0].nativeElement.textContent.trim()).toBe('Changelog');
  expect(h4[1].nativeElement.textContent.trim()).toBe('Releases');
}