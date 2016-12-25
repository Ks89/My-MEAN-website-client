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

import ProfileComponent from './profile.component';
import { RouterLinkStubDirective, RouterOutletStubComponent, RouterStub } from '../../common/testing/helpers.spec';
import { AuthService } from "../../common/services/auth.service";
import { FakeAuthService, FAKE_NOT_EXISTING_EMAIL, FAKE_BAD_PASSWORD } from "../../common/testing/fake-auth.service.spec";
import PageHeaderComponent from "../../common/components/page-header/page-header.component";
import { LaddaModule } from "angular2-ladda";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import {Router, ActivatedRoute} from "@angular/router";
import { ProfileService } from "../../common/services/profile.service";
import { FakeProfileService, PROFILE_RESPONSE } from "../../common/testing/fake-profile.service.spec";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {ActivatedRouteStub} from "../../common/testing/router-stubs.spec";

const FAKE_EMAIL = 'fake@fake.it';
const FAKE_PASSWORD = 'Qw12345678';

let comp: ProfileComponent;
let fixture: ComponentFixture<ProfileComponent>;
let router: RouterStub;
let activatedRoute: ActivatedRouteStub;
let page: Page;

function initTestBed() {
  router = new RouterStub();
  activatedRoute = new ActivatedRouteStub();
  activatedRoute.testParams = { token: 'dsadasd'};

  TestBed.configureTestingModule({
    imports: [FormsModule, ReactiveFormsModule, LaddaModule, NgbModule.forRoot()],
    declarations: [ ProfileComponent, PageHeaderComponent, RouterLinkStubDirective, RouterOutletStubComponent ],
    // schemas:      [ NO_ERRORS_SCHEMA ]
  }).overrideComponent(ProfileComponent, {
    set: {
      providers: [
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: Router, useValue: router },
        { provide: ProfileService, useClass: FakeProfileService },
        { provide: AuthService, useClass: FakeAuthService }
      ]
    }
  }); // not necessary with webpack .compileComponents();

  fixture = TestBed.createComponent(ProfileComponent);
  comp = fixture.componentInstance;

  fixture.detectChanges();
  return fixture.whenStable().then(() => {
    fixture.detectChanges();
    page = new Page(fixture);
  });
}


describe('ProfileComponent', () => {
  beforeEach( async(() => initTestBed()));

  it('can instantiate it', () => expect(comp).not.toBeNull());

  describe('---YES---', () => {
    beforeEach(() => fixture.detectChanges());

    it('can display the register page', () => {
      const element: DebugElement = fixture.debugElement;

      // main page
      const titles: DebugElement[] = element.queryAll(By.css('h1'));
      expect(titles.length).toBe(2);
      expect(titles[0].nativeElement.textContent.trim()).toBe('Profile   Welcome');

      const straplines: DebugElement[] = element.queryAll(By.css('small'));
      expect(straplines.length).toBe(2); //because pageHeader has a <small> tag in its template
      expect(straplines[0].nativeElement.textContent.trim()).toBe('Welcome');

      const h3: DebugElement = element.query(By.css('h3'));
      expect(h3.nativeElement.textContent).toBe('Connected services');

      const profileImage: DebugElement = element.query(By.css('img.img-thumbnail'));
      expect(profileImage.nativeElement.getAttribute('src')).toBe('assets/images/profile/bigProfile.png');

      const formTitle: DebugElement = element.query(By.css('p.lead'));
      expect(formTitle.nativeElement.textContent).toBe('Update your profile');

      // sidebar
      expect(titles[1].nativeElement.textContent.trim()).toBe('Other services');
      expect(straplines[1].nativeElement.textContent.trim()).toBe('');

      const h6s: DebugElement[] = element.queryAll(By.css('h6'));
      expect(h6s.length).toBe(2);
      expect(h6s[0].nativeElement.textContent.trim()).toBe(`Connect this account with other services!\n				You'll be able to access to the same account with many services.`);
      expect(h6s[1].nativeElement.textContent.trim()).toBe(`Unlink a service from this account!\n				You won't be able to login anymore with that service.`);
    });

    it(`should login and go to profile page`, () => {

      // fillForm(FAKE_EMAIL, FAKE_PASSWORD);
      // expect(comp.formModel.valid).toBe(true);
      //
      // comp.onLogin();
      //
      // fixture.detectChanges();
      //
      // expect(page.navSpy.calls.any()).toBe(true, 'navigate called');
      // expect(router.navigate).toHaveBeenCalledWith(['/profile']);
    });

  });

  // describe('---ERROR---', () => {
  //   beforeEach( async(() => {
  //     TestBed.resetTestingModule();
  //     return initTestBed();
  //   }));
  //
  //   it(`should NOT login, because local account doesn't exists - email and password are null`, () => {
  //     const element: DebugElement = fixture.debugElement;
  //
  //     fillForm(null, null);
  //     expect(comp.formModel.valid).toBe(true);
  //
  //     comp.onLogin();
  //
  //     fixture.detectChanges();
  //
  //     const results: DebugElement[] = element.queryAll(By.css('div.alert.alert-danger'));
  //     expect(results.length).toBe(0);
  //   });
  //
  //   it(`should NOT login, because local account doesn't exists - email wrong but correct password`, () => {
  //     const element: DebugElement = fixture.debugElement;
  //
  //     fillForm(FAKE_NOT_EXISTING_EMAIL, FAKE_PASSWORD);
  //     expect(comp.formModel.valid).toBe(true);
  //
  //     comp.onLogin();
  //
  //     fixture.detectChanges();
  //
  //     const results: DebugElement[] = element.queryAll(By.css('div.alert.alert-danger'));
  //     expect(results.length).toBe(1);
  //     expect(results[0].nativeElement.textContent.trim()).toBe('Error Incorrect username or password. Or this account is not activated, check your mailbox.');
  //
  //     expect(page.navSpy.calls.any()).toBe(false, 'navigate called');
  //     expect(router.navigate).not.toHaveBeenCalledWith(['/profile']);
  //   });
  //
  //   it(`should NOT login, because local account doesn't exists - email correct but wrong password`, () => {
  //     const element: DebugElement = fixture.debugElement;
  //
  //     fillForm(FAKE_EMAIL, FAKE_BAD_PASSWORD);
  //     expect(comp.formModel.valid).toBe(true);
  //
  //     comp.onLogin();
  //
  //     fixture.detectChanges();
  //
  //     const results: DebugElement[] = element.queryAll(By.css('div.alert.alert-danger'));
  //     expect(results.length).toBe(1);
  //     expect(results[0].nativeElement.textContent.trim()).toBe('Error Incorrect username or password. Or this account is not activated, check your mailbox.');
  //
  //     expect(page.navSpy.calls.any()).toBe(false, 'navigate called');
  //     expect(router.navigate).not.toHaveBeenCalledWith(['/profile']);
  //   });
  // });
});

function fillForm(email, password) {
  comp.formModel.controls['email'].setValue(email);
  comp.formModel.controls['password'].setValue(password);
}

class Page {
  navSpy: jasmine.Spy;

  constructor(fixture) {
    // Get the component's injected router and spy on it
    const router = fixture.debugElement.injector.get(Router);
    this.navSpy = spyOn(router, 'navigate');
  };
}