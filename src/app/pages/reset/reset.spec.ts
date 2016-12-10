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

import ResetComponent from './reset.component';
import { RouterLinkStubDirective, RouterOutletStubComponent, ActivatedRoute, ActivatedRouteStub, RouterStub, newEvent } from '../../common/testing/helpers.spec';
import { AuthService } from "../../common/services/auth.service";
import { FakeAuthService, FAKE_BAD_EMAIL_TOKEN } from "../../common/testing/fake-auth.service.spec";
import PageHeaderComponent from "../../common/components/page-header/page-header.component";
import { LaddaModule } from "angular2-ladda";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { Router } from "@angular/router";

const FAKE_EMAIL_TOKEN = 'fake@fake.it';
const FAKE_BAD_USERNAME = 'bad username';

let comp: ResetComponent;
let fixture: ComponentFixture<ResetComponent>;
let router: RouterStub;
let activatedRoute: ActivatedRouteStub;
let links: RouterLinkStubDirective[];
let linkDes: DebugElement[];
let page: Page;

function initTestBed(emailToken) {
  router = new RouterStub();
  activatedRoute = new ActivatedRouteStub();
  activatedRoute.testParams = { emailToken: emailToken};

  TestBed.configureTestingModule({
    imports: [FormsModule, ReactiveFormsModule, LaddaModule],
    declarations: [ ResetComponent, PageHeaderComponent, RouterLinkStubDirective, RouterOutletStubComponent ],
    // schemas:      [ NO_ERRORS_SCHEMA ]
  }).overrideComponent(ResetComponent, {
    set: {
      providers: [
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: Router, useValue: router },
        { provide: AuthService, useClass: FakeAuthService }
      ]
    }
  }).compileComponents();

  fixture = TestBed.createComponent(ResetComponent);
  comp = fixture.componentInstance;

  fixture.detectChanges();
  return fixture.whenStable().then(() => {
    fixture.detectChanges();
    page = new Page(fixture);
  });
}


describe('ResetComponent', () => {
  beforeEach( async(() => initTestBed(FAKE_EMAIL_TOKEN)));

  it('can instantiate it', () => expect(comp).not.toBeNull());

  describe('---YES---', () => {
    beforeEach(() => {
      fixture.detectChanges();
      linkDes = fixture.debugElement.queryAll(By.directive(RouterLinkStubDirective));
      links = linkDes.map(de => de.injector.get(RouterLinkStubDirective) as RouterLinkStubDirective);
    });

    it('can display the password reset page', () => {
      const element: DebugElement = fixture.debugElement;

      const title: DebugElement[] = element.queryAll(By.css('h1'));
      expect(title.length).toBe(1);
      expect(title[0].nativeElement.textContent.trim()).toBe('Password reset');

      const alert: DebugElement[] = element.queryAll(By.css('h4'));
      expect(alert.length).toBe(1);
      expect(alert[0].nativeElement.textContent).toBe('Type a new password');

      const message: DebugElement[] = element.queryAll(By.css('small'));
      expect(message.length).toBe(1); //because pageHeader has a <small> tag in its template
      expect(message[0].nativeElement.textContent.trim()).toBe('');
    });

    it('can get RouterLinks from template', () => {
      expect(links.length).toBe(1, 'should have 1 links');
      expect(links[0].linkParams).toEqual(['/login'], '1st link should go to login');
    });

    it(`should reset local account's password`, () => {
      const element: DebugElement = fixture.debugElement;

      comp.formModel.controls['password'].setValue('Qw12345678');
      expect(comp.formModel.valid).toBe(true);

      comp.onReset();

      fixture.detectChanges();

      const results: DebugElement[] = element.queryAll(By.css('div.alert.alert-success'));
      expect(results.length).toBe(1);
      expect(results[0].nativeElement.textContent.trim()).toBe(`Success An e-mail has been sent to ${FAKE_EMAIL_TOKEN} with further instructions.`);
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
      return initTestBed(FAKE_BAD_EMAIL_TOKEN);
    }));

    it(`should NOT reset local account's password`, () => {
      const element: DebugElement = fixture.debugElement;

      comp.formModel.controls['password'].setValue('Qw12345678');
      expect(comp.formModel.valid).toBe(true);

      comp.onReset();

      fixture.detectChanges();

      // TestBed initialized with FAKE_BAD_EMAIL_TOKEN, so you cannot reset local account's password
      const results: DebugElement[] = element.queryAll(By.css('div.alert.alert-danger'));
      expect(results.length).toBe(1);
      expect(results[0].nativeElement.textContent.trim()).toBe('Danger No account with that token exists.');
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