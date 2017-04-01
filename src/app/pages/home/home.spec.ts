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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import { HomeComponent } from './home.component';
import { RouterLinkStubDirective, RouterOutletStubComponent, RouterStub } from '../../shared/testing/helpers.spec';
import { ProjectService, Project, ProjectHomeView } from "../../shared/services/projects.service";
import { FakeProjectService, PROJECTS } from "../../shared/testing/fake-project.service.spec";
import { PageHeaderComponent } from "../../shared/components/page-header/page-header.component";
import { Router } from "@angular/router";
import { CarouselComponent } from "../../shared/components/carousel/carousel.component";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

let comp: HomeComponent;
let fixture: ComponentFixture<HomeComponent>;
let router: RouterStub;
let links: RouterLinkStubDirective[];
let linkDes: DebugElement[];
let page: Page;

const HOME_PROJECTS: ProjectHomeView[] = PROJECTS.map((val: Project) => {
  let homeView = val.projectHomeView[0];
  homeView._id = val._id;
  return homeView;
});

function initTestBed() {
  router = new RouterStub();

  TestBed.configureTestingModule({
    imports: [ NgbModule.forRoot() ],
    declarations: [ HomeComponent, PageHeaderComponent, CarouselComponent, RouterLinkStubDirective, RouterOutletStubComponent ],
    // schemas:      [ NO_ERRORS_SCHEMA ]
  }).overrideComponent(HomeComponent, {
    set: {
      providers: [
        { provide: Router, useValue: router },
        { provide: ProjectService, useClass: FakeProjectService }
      ]
    }
  }); // not necessary with webpack .compileComponents();

  fixture = TestBed.createComponent(HomeComponent);
  comp = fixture.componentInstance;

  fixture.detectChanges();
  return fixture.whenStable().then(() => {
    fixture.detectChanges();
    page = new Page(fixture);
  });
}

describe('HomeComponent', () => {
  beforeEach(() => initTestBed());

  it('can instantiate it', () => expect(comp).not.toBeNull());

  describe('---YES---', () => {
    beforeEach(() => {
      fixture.detectChanges();
      linkDes = fixture.debugElement.queryAll(By.directive(RouterLinkStubDirective));
      links = linkDes.map(de => de.injector.get(RouterLinkStubDirective) as RouterLinkStubDirective);
    });

    it('can display the home page', () => {
      const element: DebugElement = fixture.debugElement;

      const title: DebugElement[] = element.queryAll(By.css('h1'));
      expect(title.length).toBe(1);
      expect(title[0].nativeElement.textContent.trim()).toBe('KS   Welcome');

      const message: DebugElement[] = element.queryAll(By.css('small'));
      expect(message.length).toBe(1); //because pageHeader has a <small> tag in its template
      expect(message[0].nativeElement.textContent.trim()).toBe('Welcome');

      const carouselTitles: DebugElement[] = element.queryAll(By.css('h3'));
      expect(carouselTitles.length).toBe(PROJECTS.filter(val => val.projectHomeView.length > 0).length);
      expect(carouselTitles[0].nativeElement.textContent.trim()).toBe(PROJECTS[0].name);
      expect(carouselTitles[1].nativeElement.textContent.trim()).toBe(PROJECTS[1].name);
      expect(carouselTitles[2].nativeElement.textContent.trim()).toBe(PROJECTS[2].name);

      // const carouselTexts: DebugElement[] = element.queryAll(By.css('.carousel-caption > p'));
      // expect(carouselTexts.length).toBe(HOME_PROJECTS.length);
      // expect(carouselTexts[0].nativeElement.textContent.trim()).toBe(HOME_PROJECTS[0].carouselText);
      // expect(carouselTexts[1].nativeElement.textContent.trim()).toBe(HOME_PROJECTS[1].carouselText);
      // expect(carouselTexts[2].nativeElement.textContent.trim()).toBe(HOME_PROJECTS[2].carouselText);

      //TODO check carousel image paths
    });

    it('can get RouterLinks from template', () => {
      expect(links.length).toBe(3, 'should have 1 links');
      expect(links[0].linkParams).toEqual(['/projects', HOME_PROJECTS[0]._id], '1st link should go to the 2nd project detail');
      expect(links[1].linkParams).toEqual(['/projects', HOME_PROJECTS[1]._id], '1st link should go to the 2nd project detail');
      expect(links[2].linkParams).toEqual(['/projects', HOME_PROJECTS[2]._id], '1st link should go to the 3nd project detail');
    });

    it('can display projects and carousel into homepage', () => {
      const element: DebugElement = fixture.debugElement;

      const cardTitles: DebugElement[] = element.queryAll(By.css('h4.card-title'));
      expect(cardTitles.length).toBe(PROJECTS.filter(val => val.projectHomeView.length > 0).length);
      expect(cardTitles[0].nativeElement.textContent.trim()).toBe(PROJECTS[0].name);
      expect(cardTitles[1].nativeElement.textContent.trim()).toBe(PROJECTS[1].name);
      expect(cardTitles[2].nativeElement.textContent.trim()).toBe(PROJECTS[2].name);

      // const cardTexts: DebugElement[] = element.queryAll(By.css('p.card-text'));
      // expect(cardTexts.length).toBe(HOME_PROJECTS.length);
      // expect(cardTexts[0].nativeElement.textContent.trim()).toBe(HOME_PROJECTS[0].thumbText);
      // expect(cardTexts[1].nativeElement.textContent.trim()).toBe(HOME_PROJECTS[1].thumbText);
      // expect(cardTexts[2].nativeElement.textContent.trim()).toBe(HOME_PROJECTS[2].thumbText);

      const bigThumbTitles: DebugElement[] = element.queryAll(By.css('h2.featurette-heading'));
      expect(bigThumbTitles.length).toBe(PROJECTS.filter(val => val.projectHomeView.length > 0).length);
      expect(bigThumbTitles[0].nativeElement.textContent.trim()).toBe(PROJECTS[0].name + ` It'll blow your mind.`);
      expect(bigThumbTitles[1].nativeElement.textContent.trim()).toBe(PROJECTS[1].name + ` It'll blow your mind.`);
      expect(bigThumbTitles[2].nativeElement.textContent.trim()).toBe(PROJECTS[2].name + ` It'll blow your mind.`);

      // const bigThumbTexts: DebugElement[] = element.queryAll(By.css('p.lead'));
      // expect(bigThumbTexts.length).toBe(HOME_PROJECTS.length);
      // expect(bigThumbTexts[0].nativeElement.textContent.trim()).toBe(HOME_PROJECTS[0].bigThumbText);
      // expect(bigThumbTexts[1].nativeElement.textContent.trim()).toBe(HOME_PROJECTS[1].bigThumbText);
      // expect(bigThumbTexts[2].nativeElement.textContent.trim()).toBe(HOME_PROJECTS[2].bigThumbText);

      // TODO test imagePaths
    });
  });
});

class Page {
  navSpy: jasmine.Spy;

  constructor(fixture) {
    // Get the component's injected router and spy on it
    const router = fixture.debugElement.injector.get(Router);
    this.navSpy = spyOn(router, 'navigate');
  };
}