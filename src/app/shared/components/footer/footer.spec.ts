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
import { By }              from '@angular/platform-browser';
import { DebugElement }    from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FooterComponent } from './footer.component';

import { CookieLawModule } from 'angular2-cookie-law';

let comp:    FooterComponent;
let fixture: ComponentFixture<FooterComponent>;
let displayedText: DebugElement;

describe('FooterComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ CookieLawModule, BrowserAnimationsModule ],
      declarations: [ FooterComponent ]
    }); // not necessary with webpack .compileComponents();

    fixture = TestBed.createComponent(FooterComponent);
    comp    = fixture.componentInstance;

    displayedText  = fixture.debugElement.query(By.css('p'));
  });

  it('should display header and strapline', () => {
    fixture.detectChanges();
    expect(displayedText.nativeElement.textContent).toEqual('Copyright \u00A9 Stefano Cappa 2015-2016');
  });
});