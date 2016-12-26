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
import {
  FakeAuthService, FakeUser2ServicesNoLocalAuthService,
  FakeUser2ServicesAuthService, FakeLocalUserWithProfileAuthService, FAKE_USER_PROFILE,
  FakeUser3ServicesNoLocalAuthService
} from "../../common/testing/fake-auth.service.spec";
import PageHeaderComponent from "../../common/components/page-header/page-header.component";
import { LaddaModule } from "angular2-ladda";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { ProfileService } from "../../common/services/profile.service";
import { FakeProfileService } from "../../common/testing/fake-profile.service.spec";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ActivatedRouteStub } from "../../common/testing/router-stubs.spec";

let comp: ProfileComponent;
let fixture: ComponentFixture<ProfileComponent>;
let router: RouterStub;
let activatedRoute: ActivatedRouteStub;
let page: Page;

const FAKE_NAME = 'fake name';
const FAKE_SURNAME = 'fake surname';
const FAKE_NICKNAME = 'fake nickname';
const FAKE_EMAIL = 'fake@email.it';
const FAKE_WRONG_EMAIL = 'wrong-email.it';

const FAKE_AUTH_SERVICE = { provide: AuthService, useClass: FakeAuthService };
const FAKE_AUTH_WITH_PROFILE_SERVICE = { provide: AuthService, useClass: FakeLocalUserWithProfileAuthService };
const FAKE_AUTH_2_SERVICE = { provide: AuthService, useClass: FakeUser2ServicesAuthService };
const FAKE_AUTH_2NOLOCAL_SERVICE = { provide: AuthService, useClass: FakeUser2ServicesNoLocalAuthService };
const FAKE_AUTH_3NOLOCAL_SERVICE = { provide: AuthService, useClass: FakeUser3ServicesNoLocalAuthService };

function initTestBed(withToken: boolean, authServiceMocked: any) {
  TestBed.resetTestingModule();

  router = new RouterStub();
  activatedRoute = new ActivatedRouteStub();

  if(withToken === true) {
    // to load profile page with token
    activatedRoute.testParams = {token: 'dsadasd'};
  }

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
        authServiceMocked
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

  describe(`---COMMON/CREATIONAL---`, () => {
    beforeEach( async(() => initTestBed(true, FAKE_AUTH_SERVICE))); // init with token

    it(`can instantiate it`, () => expect(comp).not.toBeNull());

    it(`can display the profile page`, () => {
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
  });

  describe(`---YES---`, () => {

    describe(`add profile info`, () => {
      beforeEach( async(() => initTestBed(true, FAKE_AUTH_SERVICE))); // init with token

      it(`should update the profile`, () => {
        const element: DebugElement = fixture.debugElement;

        fillForm(FAKE_NAME, FAKE_SURNAME, FAKE_NICKNAME, FAKE_EMAIL);
        expect(comp.formModel.valid).toBe(true);

        comp.onProfileUpdate();

        fixture.detectChanges();

        const results: DebugElement[] = element.queryAll(By.css('div.alert.alert-success'));
        expect(results.length).toBe(1);
        expect(results[0].nativeElement.textContent.trim()).toBe(`Success Profile updated successfully!`);
      });

    });

    describe(`update existing profile info`, () => {
      beforeEach( async(() => initTestBed(true, FAKE_AUTH_WITH_PROFILE_SERVICE))); // init with token

      it(`can display the profile page`, () => {
        expect(comp.formModel.controls['name'].value).toBe(FAKE_USER_PROFILE.name);
        expect(comp.formModel.controls['surname'].value).toBe(FAKE_USER_PROFILE.surname);
        expect(comp.formModel.controls['nickname'].value).toBe(FAKE_USER_PROFILE.nickname);
        expect(comp.formModel.controls['email'].value).toBe(FAKE_USER_PROFILE.email);
        expect(comp.formModel.valid).toBe(true);
      });

      it(`should update the profile`, () => {
        const element: DebugElement = fixture.debugElement;

        //form already filled by initTestBed AuthService's mock
        comp.onProfileUpdate();

        fixture.detectChanges();

        const results: DebugElement[] = element.queryAll(By.css('div.alert.alert-success'));
        expect(results.length).toBe(1);
        expect(results[0].nativeElement.textContent.trim()).toBe(`Success Profile updated successfully!`);
      });
    });

    describe(`connect 2 accounts (without local)`, () => {
      beforeEach( async(() => initTestBed(true, FAKE_AUTH_2NOLOCAL_SERVICE))); // init with token
      //TODO
    });

    describe(`connect 2 accounts (with local)`, () => {
      beforeEach( async(() => initTestBed(true, FAKE_AUTH_2_SERVICE))); // init with token
      //TODO
    });

    describe(`connect 3 accounts`, () => {
      beforeEach( async(() => initTestBed(true, FAKE_AUTH_3NOLOCAL_SERVICE))); // init with token
      //TODO
    });

    describe(`unlink`, () => {
      beforeEach( async(() => initTestBed(true, FAKE_AUTH_3NOLOCAL_SERVICE))); // init with token
      //TODO
    });

    describe(`last unlink`, () => {
      beforeEach( async(() => initTestBed(true, FAKE_AUTH_2_SERVICE))); // init with token
      //TODO
    });

  });

  describe(`---NO---`, () => {

    describe(`update profile`, () => {
      beforeEach( async(() => initTestBed(true, FAKE_AUTH_SERVICE))); // init with token

      const BAD = 'a'; // short value length < 3, because i'm using a length validator into the component
      const FORMS = [
        { info: 'name bad', name: BAD, surname: FAKE_SURNAME, nickname: FAKE_NICKNAME, email: FAKE_EMAIL },
        { info: 'surname bad', name: FAKE_NAME, surname: BAD, nickname: FAKE_NICKNAME, email: FAKE_EMAIL },
        { info: 'nickname bad', name: FAKE_NAME, surname: FAKE_SURNAME, nickname: BAD, email: FAKE_EMAIL },
        { info: 'email bad', name: FAKE_NAME, surname: FAKE_SURNAME, nickname: FAKE_NICKNAME, email: FAKE_WRONG_EMAIL },
        { info: 'all bad', name: BAD, surname: BAD, nickname: BAD, email: FAKE_WRONG_EMAIL }
      ];

      for(let i=0; i<FORMS.length; i++) {
        it(`should NOT update the profile, because all fields are mandatory. Test i=${i} => ${FORMS[i].info}`, () => {
          const element: DebugElement = fixture.debugElement;

          fillForm(FORMS[i].name, FORMS[i].surname, FORMS[i].nickname, FORMS[i].email);
          expect(comp.formModel.valid).toBe(false);

          comp.onProfileUpdate();

          fixture.detectChanges();

          const results: DebugElement[] = element.queryAll(By.css('div.alert.alert-success'));
          expect(results.length).toBe(0);

          const errors: DebugElement[] = element.queryAll(By.css('div.alert.alert-danger'));
          expect(errors.length).toBe(0);
        });
      }

    });

    describe(`connect error`, () => {
      //TODO
    });

    describe(`unlink error`, () => {
      //TODO
    });

    describe(`last unlink error`, () => {
      //TODO
    });

  });

});

function fillForm(name, surname, nickname, email) {
  comp.formModel.controls['name'].setValue(name);
  comp.formModel.controls['surname'].setValue(surname);
  comp.formModel.controls['nickname'].setValue(nickname);
  comp.formModel.controls['email'].setValue(email);
}

class Page {
  navSpy: jasmine.Spy;

  constructor(fixture) {
    // Get the component's injected router and spy on it
    const router = fixture.debugElement.injector.get(Router);
    this.navSpy = spyOn(router, 'navigate');
  };
}