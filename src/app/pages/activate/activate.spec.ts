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

import ActivateComponent from './activate.component';
import { RouterLinkStubDirective, RouterOutletStubComponent, ActivatedRoute, ActivatedRouteStub }   from '../../common/testing/router-stubs.spec';
import { AuthService } from "../../common/services/auth.service";
import { FakeAuthService, FAKE_BAD_EMAIL_TOKEN } from "../../common/testing/fake-auth.service.spec";
import PageHeaderComponent from "../../common/components/page-header/page-header.component";

const FAKE_EMAIL_TOKEN = 'fake@fake.it';
const FAKE_USERNAME = 'fake username';
const FAKE_BAD_USERNAME = 'bad username';

let comp: ActivateComponent;
let fixture: ComponentFixture<ActivateComponent>;
let activatedRoute: ActivatedRouteStub;
let links: RouterLinkStubDirective[];
let linkDes: DebugElement[];

function initTestBed(emailToken, userName) {
  activatedRoute = new ActivatedRouteStub();
  activatedRoute.testParams = { emailToken: emailToken, userName: userName };

  TestBed.configureTestingModule({
    declarations: [ ActivateComponent, PageHeaderComponent, RouterLinkStubDirective, RouterOutletStubComponent ],
    // schemas:      [ NO_ERRORS_SCHEMA ]
  }).overrideComponent(ActivateComponent, {
    set: {
      providers: [
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: AuthService, useClass: FakeAuthService }
      ]
    }
  }); // not necessary with webpack .compileComponents();

  fixture = TestBed.createComponent(ActivateComponent);
  comp = fixture.componentInstance;

  // 1st change detection triggers ngOnInit
  fixture.detectChanges();
  // 2nd change detection displays the async-fetched data
  return fixture.whenStable().then(() => fixture.detectChanges());
}


describe('ActivateComponent', () => {
  beforeEach( async(() => initTestBed(FAKE_EMAIL_TOKEN, FAKE_USERNAME)));

  it('can instantiate it', () => expect(comp).not.toBeNull());

  describe('---YES---', () => {
    beforeEach(() => {
      fixture.detectChanges();
      linkDes = fixture.debugElement.queryAll(By.directive(RouterLinkStubDirective));
      links = linkDes.map(de => de.injector.get(RouterLinkStubDirective) as RouterLinkStubDirective);
    });

    it('can display the activate page', () => {
      const element: DebugElement = fixture.debugElement;

      const title: DebugElement[] = element.queryAll(By.css('h1'));
      expect(title.length).toBe(1);
      expect(title[0].nativeElement.textContent.trim()).toBe('Activate');

      fixture.detectChanges();

      const message: DebugElement[] = element.queryAll(By.css('small'));
      expect(message.length).toBe(1); //because pageHeader has a <small> tag in its template
      expect(message[0].nativeElement.textContent.trim()).toBe('');
    });

    it('can get RouterLinks from template', () => {
      expect(links.length).toBe(1, 'should have 1 links');
      expect(links[0].linkParams).toEqual(['/login'], '1st link should go to login');
    });

    it('should activate the local account, displaying username and a success message', () => {
      const element: DebugElement = fixture.debugElement;

      const alert: DebugElement[] = element.queryAll(By.css('h4'));
      expect(alert.length).toBe(1);
      expect(alert[0].nativeElement.textContent).toBe(`Welcome ${FAKE_USERNAME}`);

      const welcomeName: DebugElement[] = element.queryAll(By.css('div.alert.alert-success'));
      expect(welcomeName.length).toBe(1);
      expect(welcomeName[0].nativeElement.textContent.trim()).toBe(`Success An e-mail has been sent to ${FAKE_EMAIL_TOKEN} with further instructions.`);
    });
  });

  describe('---ERROR---', () => {
    beforeEach( async(() => {
      TestBed.resetTestingModule();
      return initTestBed(FAKE_BAD_EMAIL_TOKEN, FAKE_BAD_USERNAME);
    }));

    it('should NOT activate the local account, displaying username and an error message', () => {

      fixture.detectChanges();
      const element: DebugElement = fixture.debugElement;

      const alert: DebugElement[] = element.queryAll(By.css('h4'));
      expect(alert.length).toBe(1);
      expect(alert[0].nativeElement.textContent).toBe(`Welcome ${FAKE_BAD_USERNAME}`);

      const welcomeNames: DebugElement[] = element.queryAll(By.css('div.alert.alert-danger'));
      expect(welcomeNames.length).toBe(1);
      expect(welcomeNames[0].nativeElement.textContent.trim()).toBe('Danger No account with that token exists.');
    });

  });
});
