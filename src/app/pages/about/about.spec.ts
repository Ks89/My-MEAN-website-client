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
import {NO_ERRORS_SCHEMA, DebugElement} from '@angular/core';
import { By } from '@angular/platform-browser';

import AboutComponent from './about.component';

let comp: AboutComponent;
let fixture: ComponentFixture<AboutComponent>;

describe('AboutComponent', () => {
  beforeEach( async(() => {

    TestBed.configureTestingModule({
      declarations: [ AboutComponent ],
      schemas:      [ NO_ERRORS_SCHEMA ]
    }).compileComponents();

    fixture = TestBed.createComponent(AboutComponent);
    comp = fixture.componentInstance;

    fixture.detectChanges();
    return fixture.whenStable().then(() => fixture.detectChanges());
  }));

  it('can instantiate it', () => expect(comp).not.toBeNull());

  describe('---YES---', () => {
    beforeEach(() => fixture.detectChanges());

    it('should display the about page', () => {
      const element: DebugElement = fixture.debugElement;

      // not working because About is inside PageHeader
      // const title: DebugElement[] = element.queryAll(By.css('h1'));
      // expect(title.length).toBe(1);
      // expect(title[0].nativeElement.textContent).toBe('About');

      const message: DebugElement[] = element.queryAll(By.css('small'));
      expect(message.length).toBe(1);
      expect(message[0].nativeElement.textContent.trim()).toBe('Not implemented yet');
    });
  });
});
