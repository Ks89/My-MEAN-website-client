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

import ActivateComponent from './activate.component';
import { RouterLinkStubDirective, RouterOutletStubComponent,
  ActivatedRoute, ActivatedRouteStub }   from '../../common/testing/router-stubs.spec';
import {AuthService} from "../../common/services/auth.service";
import {FakeAuthService} from "../../common/testing/fake-auth.service.spec";

let comp:    ActivateComponent;
let fixture: ComponentFixture<ActivateComponent>;
let activatedRoute: ActivatedRouteStub;
let links: RouterLinkStubDirective[];
let linkDes: DebugElement[];

describe('ActivateComponent', () => {
  beforeEach( async(() => {

    activatedRoute = new ActivatedRouteStub();
    activatedRoute.testParams = { emailToken: 'fake@fake.it', userName: 'fake username' };

    TestBed.configureTestingModule({
      declarations: [ ActivateComponent, RouterLinkStubDirective, RouterOutletStubComponent ],
      schemas:      [ NO_ERRORS_SCHEMA ]
    })
      .overrideComponent(ActivateComponent, {
        set: {
          providers: [
            { provide: ActivatedRoute, useValue: activatedRoute },
            { provide: AuthService, useClass: FakeAuthService }
          ]
        }
      }).compileComponents();


    fixture = TestBed.createComponent(ActivateComponent);
    comp = fixture.componentInstance; // ActivateComponent test instance

    fixture.detectChanges();
    return fixture.whenStable().then(() => fixture.detectChanges());
  }));

  describe('test test', () => {
    beforeEach(() => {
      // trigger initial data binding
      fixture.detectChanges();

      // find DebugElements with an attached RouterLinkStubDirective
      linkDes = fixture.debugElement
        .queryAll(By.directive(RouterLinkStubDirective));

      // get the attached link directive instances using the DebugElement injectors
      links = linkDes
        .map(de => de.injector.get(RouterLinkStubDirective) as RouterLinkStubDirective);
    });

    it('can instantiate it', () => {
      expect(comp).not.toBeNull();
    });

    it('can get RouterLinks from template', () => {
      expect(links.length).toBe(1, 'should have 1 links');
      expect(links[0].linkParams).toEqual(['/login'], '1st link should go to login');
    });
  });

  it('should check if projects are displayed correctly', () => {
    fixture.detectChanges(); // trigger data binding
    const element = fixture.debugElement;

    // const values = element.queryAll(By.css('a'));
    // expect(values.length).toBe(9);
    //
    // const projectHeaders = element.queryAll(By.css('h4.media-heading a'));
    // expect(projectHeaders.length).toBe(6);
    // expect(projectHeaders[1].nativeElement.textContent).toBe(PROJECTS[0].name);
    //
    // const shortDescriptions = element.queryAll(By.css('p.name'));
    // expect(shortDescriptions.length).toBe(3);
    // expect(shortDescriptions[0].nativeElement.textContent).toBe(PROJECTS[0].shortDescription);
    //
    // const tags = element.queryAll(By.css('span.tag.tag-pill.tag-warning'));
  });
});
