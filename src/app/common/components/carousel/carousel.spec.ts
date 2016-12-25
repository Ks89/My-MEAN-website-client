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

import CarouselComponent from './carousel.component';
import { PROJECTS, FakeProjectService } from '../../testing/fake-project.service.spec';
import { ProjectService } from '../../services';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

let comp: CarouselComponent;
let fixture: ComponentFixture<CarouselComponent>;

function initTestBed() {
  TestBed.configureTestingModule({
    imports: [FormsModule, ReactiveFormsModule, NgbModule.forRoot()],
    declarations: [ CarouselComponent ],
    // schemas:      [ NO_ERRORS_SCHEMA ]
  }).overrideComponent(CarouselComponent, {
    set: {
      providers: [
        { provide: ProjectService, useClass: FakeProjectService }
      ]
    }
  }); // not necessary with webpack .compileComponents();

  fixture = TestBed.createComponent(CarouselComponent);
  comp = fixture.componentInstance; // CarouselComponent test instance

  fixture.detectChanges();
  return fixture.whenStable().then(() => fixture.detectChanges());
}

describe('CarouselComponent', () => {
  beforeEach(() => initTestBed());

  it('can instantiate it', () => expect(comp).not.toBeNull());

  describe('---YES---', () => {

    beforeEach(() => fixture.detectChanges());

    it('can display the carousel component', () => {
      const element: DebugElement = fixture.debugElement;

      fixture.detectChanges();

      const carouselTitles: DebugElement[] = element.queryAll(By.css('h3'));
      expect(carouselTitles.length).toBe(PROJECTS.length);
      expect(carouselTitles[0].nativeElement.textContent.trim()).toBe(PROJECTS[0].name);
      expect(carouselTitles[1].nativeElement.textContent.trim()).toBe(PROJECTS[1].name);
      expect(carouselTitles[2].nativeElement.textContent.trim()).toBe(PROJECTS[2].name);

      const slides: DebugElement[] = element.queryAll(By.css('img'));
      expect(slides.length).toBe(PROJECTS.length);
      // expect(slides[0].nativeElement.getAttribute('src')).toBe(PROJECTS[0].projectHomeView[0].carouselImagePath);
      // expect(slides[1].nativeElement.getAttribute('src')).toBe(PROJECTS[1].projectHomeView[0].carouselImagePath);
      // expect(slides[2].nativeElement.getAttribute('src')).toBe(PROJECTS[2].projectHomeView[0].carouselImagePath);

      const carouselTexts: DebugElement[] = element.queryAll(By.css('.carousel-caption p'));
      expect(carouselTexts.length).toBe(PROJECTS.length);
      // expect(carouselTexts[0].nativeElement.textContent.trim()).toBe(PROJECTS[0].projectHomeView[0].carouselText);
      // expect(carouselTexts[1].nativeElement.textContent.trim()).toBe(PROJECTS[1].projectHomeView[0].carouselText);
      // expect(carouselTexts[2].nativeElement.textContent.trim()).toBe(PROJECTS[2].projectHomeView[0].carouselText);

      //TODO check carousel image paths
    });
  });
});
