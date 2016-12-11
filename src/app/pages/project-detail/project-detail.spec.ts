/*
 * Copyright (C) 2015-2016 Stefano Cappa
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
import { By } from '@angular/platform-browser';

import ProjectDetailComponent from './project-detail.component';
import { RouterLinkStubDirective, RouterOutletStubComponent, ActivatedRoute, ActivatedRouteStub, RouterStub }   from '../../common/testing/router-stubs.spec';
import { ProjectService } from "../../common/services/projects.service";
import { FakeProjectService, PROJECTS } from '../../common/testing/fake-project.service.spec';
import PageHeaderComponent from "../../common/components/page-header/page-header.component";
import { ImageModal } from 'angular2-image-popup/directives/angular2-image-popup/image-modal-popup';
import { Router } from "@angular/router";

let comp: ProjectDetailComponent;
let fixture: ComponentFixture<ProjectDetailComponent>;
let activatedRoute: ActivatedRouteStub;
let router: RouterStub;
let links: RouterLinkStubDirective[];
let linkDes: DebugElement[];

function initTestBed(projectId) {
  activatedRoute = new ActivatedRouteStub();
  activatedRoute.testParams = { projectId: projectId };

  TestBed.configureTestingModule({
    declarations: [ ProjectDetailComponent, PageHeaderComponent, RouterLinkStubDirective, RouterOutletStubComponent, ImageModal ],
    // schemas:      [ NO_ERRORS_SCHEMA ]
  }).overrideComponent(ProjectDetailComponent, {
    set: {
      providers: [
        { provide: Router, useValue: router },
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: ProjectService, useClass: FakeProjectService }
      ]
    }
  }).compileComponents();

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

      fixture.detectChanges();

      // TODO FIXME wait ngInit

      checkTitles(element, PROJECTS[0].name);

      const description: DebugElement = element.query(By.css('section#Description div'));
      //expect(description.nativeElement.textContent.trim()).toBe(PROJECTS[0].description);

      const changelog: DebugElement = element.query(By.css('div#Changelog div'));
      // expect(changelog[0].nativeElement.textContent.trim()).toBe(PROJECTS[0].changelog);

      const releases: DebugElement = element.query(By.css('div#Releases div'));
      // expect(releases[0].nativeElement.textContent.trim()).toBe(PROJECTS[0].releases);

      const features: DebugElement = element.query(By.css('section#Features div'));
      // expect(features[0].nativeElement.textContent.trim()).toBe(PROJECTS[0].features);

      const futureExtensions: DebugElement = element.query(By.css('section#FutureExtensions div'));
      // expect(futureExtensions[0].nativeElement.textContent.trim()).toBe(PROJECTS[0].futureExtensions);

      // TODO find a way to test this - probably it's impossible
      // const video: DebugElement[] = element.queryAll(By.css('section#Video div'));
      // expect(video.length).toBe(1);
      // expect(video[0].nativeElement.textContent.trim()).toBe(PROJECTS[0].video);

      // TODO find a way to test this - it's difficult
      // const images: DebugElement[] = element.queryAll(By.css('section#Images div'));
      // expect(images.length).toBe(1);
      // expect(images[0].nativeElement.textContent.trim()).toBe(PROJECTS[0].images);

      const license: DebugElement = element.query(By.css('section#License div'));
      // expect(license[0].nativeElement.textContent.trim()).toBe(PROJECTS[0].licenseText);

    });
  });

  describe('---ERROR---', () => {
    beforeEach( async(() => {
      TestBed.resetTestingModule();
      return initTestBed('wrong_project_id');
    }));

    it('should display the sidebar', () => checkSidebar(fixture.debugElement));

    it('should NOT display the project detail, because project._id is wrong', () => {
      const element: DebugElement = fixture.debugElement;

      fixture.detectChanges();

      checkTitles(element, 'Project');

      //TODO copy and paste the same code of the YES case, but all toBe must be '', or probably null - I'm not sure
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
}

function checkTitles(element: DebugElement, projectName: string) {
  const h1: DebugElement[] = element.queryAll(By.css('h1'));
  expect(h1.length).toBe(1); // without a valid id, title will be simply `Project`

  // TODO FIXME the same as above
  //expect(h1[0].nativeElement.textContent.trim()).toBe(projectName);

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