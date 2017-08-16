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
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';

import { LoginComponent } from './login.component';
import { RouterLinkStubDirective, RouterOutletStubComponent, RouterStub } from '../../shared/testing/helpers.spec';
import { AuthService } from "../../core/services/auth.service";
import { FakeAuthService, FAKE_NOT_EXISTING_EMAIL, FAKE_BAD_PASSWORD } from "../../shared/testing/fake-auth.service.spec";
import { PageHeaderComponent } from "../../shared/components/page-header/page-header.component";
import { LaddaModule } from "angular2-ladda";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { Router } from "@angular/router";

const FAKE_EMAIL = 'fake@fake.it';
const FAKE_PASSWORD = 'Qw12345678';

let comp: LoginComponent;
let fixture: ComponentFixture<LoginComponent>;
let router: RouterStub;
let links: RouterLinkStubDirective[];
let linkDes: DebugElement[];
let page: Page;

function initTestBed() {
  router = new RouterStub();

  TestBed.configureTestingModule({
    imports: [ FormsModule, ReactiveFormsModule, LaddaModule, TranslateModule.forRoot() ],
    declarations: [ LoginComponent, PageHeaderComponent, RouterLinkStubDirective, RouterOutletStubComponent ],
    // schemas:      [ NO_ERRORS_SCHEMA ]
  }).overrideComponent(LoginComponent, {
    set: {
      providers: [
        { provide: Router, useValue: router },
        { provide: AuthService, useClass: FakeAuthService }
      ]
    }
  }); // not necessary with webpack .compileComponents();

  fixture = TestBed.createComponent(LoginComponent);
  comp = fixture.componentInstance;

  fixture.detectChanges();
  return fixture.whenStable().then(() => {
    fixture.detectChanges();
    page = new Page(fixture);
  });
}


describe('LoginComponent', () => {
  beforeEach( async(() => initTestBed()));

  it('can instantiate it', () => expect(comp).not.toBeNull());

  describe('---YES---', () => {
    beforeEach(() => {
      fixture.detectChanges();
      linkDes = fixture.debugElement.queryAll(By.directive(RouterLinkStubDirective));
      links = linkDes.map(de => de.injector.get(RouterLinkStubDirective) as RouterLinkStubDirective);
    });

    it('can display the register page', () => {
      const element: DebugElement = fixture.debugElement;

      const title: DebugElement[] = element.queryAll(By.css('h1'));
      expect(title.length).toBe(1);
      expect(title[0].nativeElement.textContent.trim()).toBe('Sign in');

      const alert: DebugElement[] = element.queryAll(By.css('p.lead'));
      expect(alert.length).toBe(1);
      expect(alert[0].nativeElement.textContent).toBe('Not a member? Please register first.');

      const message: DebugElement[] = element.queryAll(By.css('small'));
      expect(message.length).toBe(1); //because pageHeader has a <small> tag in its template
      expect(message[0].nativeElement.textContent.trim()).toBe('');
    });

    it('can get RouterLinks from template', () => {
      expect(links.length).toBe(2, 'should have 2 links');
      expect(links[0].linkParams).toEqual(['/register'], '1st link should go to register');
      expect(links[1].linkParams).toEqual(['/forgot'], '1st link should go to forgot');
    });

    it(`should login and go to profile page`, () => {

      fillForm(FAKE_EMAIL, FAKE_PASSWORD);
      expect(comp.formModel.valid).toBe(true);

      comp.onLogin();

      fixture.detectChanges();

      expect(page.navSpy.calls.any()).toBe(true, 'navigate called');
      expect(router.navigate).toHaveBeenCalledWith(['/profile']);
    });

    it(`should go to register page`, () => {
      const element: DebugElement = fixture.debugElement;

      //TODO implement click on register url
      // const links: DebugElement[] = element.queryAll(By.css('a'));
      // expect(links.length).toBe(2);
      // links[0].nativeElement.triggerEventHandler('click', null);
      //
      // fixture.detectChanges();
      //
      // expect(page.navSpy.calls.any()).toBe(true, 'navigate called');
      // expect(router.navigate).toHaveBeenCalledWith(['/register']);
    });

    it(`should go to forgot page`, () => {
      const element: DebugElement = fixture.debugElement;

      //TODO implement click on forgot url
      // const links: DebugElement[] = element.queryAll(By.css('a'));
      // expect(links.length).toBe(2);
      // links[1].nativeElement.triggerEventHandler('click', null);
      //
      // fixture.detectChanges();
      //
      // expect(page.navSpy.calls.any()).toBe(true, 'navigate called');
      // expect(router.navigate).toHaveBeenCalledWith(['/forgot']);
    });
  });

  describe('---ERROR---', () => {
    beforeEach( async(() => {
      TestBed.resetTestingModule();
      return initTestBed();
    }));

    it(`should NOT login, because local account doesn't exists - email and password are null`, () => {
      const element: DebugElement = fixture.debugElement;

      fillForm(null, null);
      expect(comp.formModel.valid).toBe(true);

      comp.onLogin();

      fixture.detectChanges();

      const results: DebugElement[] = element.queryAll(By.css('div.alert.alert-danger'));
      expect(results.length).toBe(0);
    });

    it(`should NOT login, because local account doesn't exists - email wrong but correct password`, () => {
      const element: DebugElement = fixture.debugElement;

      fillForm(FAKE_NOT_EXISTING_EMAIL, FAKE_PASSWORD);
      expect(comp.formModel.valid).toBe(true);

      comp.onLogin();

      fixture.detectChanges();

      const results: DebugElement[] = element.queryAll(By.css('div.alert.alert-danger'));
      expect(results.length).toBe(1);
      expect(results[0].nativeElement.textContent.trim()).toBe('Error Incorrect username or password. Or this account is not activated, check your mailbox.');

      expect(page.navSpy.calls.any()).toBe(false, 'navigate called');
      expect(router.navigate).not.toHaveBeenCalledWith(['/profile']);
    });

    it(`should NOT login, because local account doesn't exists - email correct but wrong password`, () => {
      const element: DebugElement = fixture.debugElement;

      fillForm(FAKE_EMAIL, FAKE_BAD_PASSWORD);
      expect(comp.formModel.valid).toBe(true);

      comp.onLogin();

      fixture.detectChanges();

      const results: DebugElement[] = element.queryAll(By.css('div.alert.alert-danger'));
      expect(results.length).toBe(1);
      expect(results[0].nativeElement.textContent.trim()).toBe('Error Incorrect username or password. Or this account is not activated, check your mailbox.');

      expect(page.navSpy.calls.any()).toBe(false, 'navigate called');
      expect(router.navigate).not.toHaveBeenCalledWith(['/profile']);
    });
  });
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