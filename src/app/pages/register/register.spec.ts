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

import { RegisterComponent } from './register.component';
import { RouterLinkStubDirective, RouterOutletStubComponent, RouterStub } from '../../shared/testing/helpers.spec';
import { AuthService } from "../../core/services/auth.service";
import { FakeAuthService, FAKE_ALREADY_EXISTING_EMAIL } from "../../shared/testing/fake-auth.service.spec";
import { PageHeaderComponent } from "../../shared/components/page-header/page-header.component";
import { LaddaModule } from "angular2-ladda";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { Router } from "@angular/router";

const FAKE_EMAIL = 'fake@fake.it';
const FAKE_BAD_EMAIL = 'fake@bad.com';
const FAKE_USER = 'fake username';
const FAKE_PASSWORD = 'Qw12345678';
const FAKE_BAD_PASSWORD = 'Qw1234bad';

let comp: RegisterComponent;
let fixture: ComponentFixture<RegisterComponent>;
let router: RouterStub;
let links: RouterLinkStubDirective[];
let linkDes: DebugElement[];
let page: Page;

function initTestBed() {
  router = new RouterStub();

  TestBed.configureTestingModule({
    imports: [FormsModule, ReactiveFormsModule, LaddaModule],
    declarations: [ RegisterComponent, PageHeaderComponent, RouterLinkStubDirective, RouterOutletStubComponent ],
    // schemas:      [ NO_ERRORS_SCHEMA ]
  }).overrideComponent(RegisterComponent, {
    set: {
      providers: [
        { provide: Router, useValue: router },
        { provide: AuthService, useClass: FakeAuthService }
      ]
    }
  }); // not necessary with webpack .compileComponents();

  fixture = TestBed.createComponent(RegisterComponent);
  comp = fixture.componentInstance;

  fixture.detectChanges();
  return fixture.whenStable().then(() => {
    fixture.detectChanges();
    page = new Page(fixture);
  });
}


describe('RegisterComponent', () => {
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
      expect(title[0].nativeElement.textContent.trim()).toBe('Create a new accout');

      const alert: DebugElement[] = element.queryAll(By.css('p.lead'));
      expect(alert.length).toBe(1);
      expect(alert[0].nativeElement.textContent).toBe('Already a member? Please log in instead.');

      const message: DebugElement[] = element.queryAll(By.css('small'));
      expect(message.length).toBe(1); //because pageHeader has a <small> tag in its template
      expect(message[0].nativeElement.textContent.trim()).toBe('');
    });

    it('can get RouterLinks from template', () => {
      expect(links.length).toBe(1, 'should have 1 links');
      expect(links[0].linkParams).toEqual(['/login'], '1st link should go to login');
    });

    it(`should register a new local account and redirect to login`, () => {

      fillForm(FAKE_USER, FAKE_EMAIL, FAKE_EMAIL, FAKE_PASSWORD, FAKE_PASSWORD);
      expect(comp.formModel.valid).toBe(true);

      comp.onRegister();

      fixture.detectChanges();

      expect(page.navSpy.calls.any()).toBe(true, 'navigate called');
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });

    it(`should return to login page`, () => {
      const element: DebugElement = fixture.debugElement;

      //TODO implement click on login url
      // const links: DebugElement[] = element.queryAll(By.css('a'));
      // expect(links.length).toBe(1);
      // links[0].nativeElement.triggerEventHandler('click', null);
      //
      // fixture.detectChanges();
      //
      // expect(page.navSpy.calls.any()).toBe(true, 'navigate called');
      // expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });
  });

  describe('---ERROR---', () => {
    beforeEach( async(() => {
      TestBed.resetTestingModule();
      return initTestBed();
    }));

    it(`should NOT register local account, because all fields are mandatory`, () => {
      const element: DebugElement = fixture.debugElement;

      fillForm(null, FAKE_EMAIL, FAKE_EMAIL, FAKE_PASSWORD, FAKE_PASSWORD);
      expect(comp.formModel.valid).toBe(false);

      comp.onRegister();

      fixture.detectChanges();

      let results: DebugElement[] = element.queryAll(By.css('div.alert.alert-danger'));
      expect(results.length).toBe(0);
      results = element.queryAll(By.css('div.alert.alert-success'));
      expect(results.length).toBe(0);

      expect(page.navSpy.calls.any()).toBe(false, 'navigate called');
      expect(router.navigate).not.toHaveBeenCalledWith(['/login']);
    });

    it(`should NOT register local account, because passwords must the equal`, () => {
      const element: DebugElement = fixture.debugElement;

      fillForm(FAKE_USER, FAKE_EMAIL, FAKE_EMAIL, FAKE_PASSWORD, FAKE_BAD_PASSWORD);
      expect(comp.formModel.valid).toBe(true);

      comp.onRegister();

      fixture.detectChanges();

      const results: DebugElement[] = element.queryAll(By.css('div.alert.alert-danger'));
      expect(results.length).toBe(1);
      expect(results[0].nativeElement.textContent.trim()).toBe('Error Password and Password confirm must be equals');
    });

    it(`should NOT register local account, because emails must the equal`, () => {
      const element: DebugElement = fixture.debugElement;

      fillForm(FAKE_USER, FAKE_EMAIL, FAKE_BAD_EMAIL, FAKE_PASSWORD, FAKE_PASSWORD);
      expect(comp.formModel.valid).toBe(true);

      comp.onRegister();

      fixture.detectChanges();

      const results: DebugElement[] = element.queryAll(By.css('div.alert.alert-danger'));
      expect(results.length).toBe(1);
      expect(results[0].nativeElement.textContent.trim()).toBe('Error Email and Email confirm must be equals');
    });

    it(`should NOT register local account, because you can register only one account with that email`, () => {
      const element: DebugElement = fixture.debugElement;

      fillForm(FAKE_USER, FAKE_ALREADY_EXISTING_EMAIL, FAKE_ALREADY_EXISTING_EMAIL, FAKE_PASSWORD, FAKE_PASSWORD);
      expect(comp.formModel.valid).toBe(true);

      comp.onRegister();

      fixture.detectChanges();

      const results: DebugElement[] = element.queryAll(By.css('div.alert.alert-danger'));
      expect(results.length).toBe(1);
      expect(results[0].nativeElement.textContent.trim()).toBe('Error User already exists. Try to login.');
    });

  });
});

function fillForm(name, email, emailConfirm, password, passwordConfirm) {
  comp.formModel.controls['name'].setValue(name);
  comp.formModel.controls['email'].setValue(email);
  comp.formModel.controls['emailConfirm'].setValue(emailConfirm);
  comp.formModel.controls['password'].setValue(password);
  comp.formModel.controls['passwordConfirm'].setValue(passwordConfirm);
}

class Page {
  navSpy: jasmine.Spy;

  constructor(fixture) {
    // Get the component's injected router and spy on it
    const router = fixture.debugElement.injector.get(Router);
    this.navSpy = spyOn(router, 'navigate');
  };
}