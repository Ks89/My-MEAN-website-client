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

import ForgotComponent from './forgot.component';
import { RouterLinkStubDirective, RouterOutletStubComponent, RouterStub } from '../../common/testing/helpers.spec';
import { AuthService } from "../../common/services/auth.service";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FakeAuthService, FAKE_BAD_EMAIL_TOKEN } from "../../common/testing/fake-auth.service.spec";
import { Router } from "@angular/router";
import PageHeaderComponent from "../../common/components/page-header/page-header.component";

let comp: ForgotComponent;
let fixture: ComponentFixture<ForgotComponent>;
let router: RouterStub;
let links: RouterLinkStubDirective[];
let linkDes: DebugElement[];
let page: Page;

function initTestBed() {
  router = new RouterStub();

  TestBed.configureTestingModule({
    imports: [FormsModule, ReactiveFormsModule],
    declarations: [ForgotComponent, PageHeaderComponent, RouterLinkStubDirective, RouterOutletStubComponent ],
    // schemas: [NO_ERRORS_SCHEMA],
  }).overrideComponent(ForgotComponent, {
    set: {
      providers: [
        { provide: Router, useValue: router },
        { provide: AuthService, useClass: FakeAuthService }
      ]
    }
  }); // not necessary with webpack .compileComponents();

  fixture = TestBed.createComponent(ForgotComponent);
  comp = fixture.componentInstance;

  fixture.detectChanges();
  return fixture.whenStable().then(() => {
    fixture.detectChanges();
    page = new Page(fixture);
  });
}

describe('ForgotComponent', () => {
  beforeEach(async(() => initTestBed()));

  it('can instantiate it', () => expect(comp).not.toBeNull());

  describe('---YES---', () => {
    beforeEach(() => {
      fixture.detectChanges();
      linkDes = fixture.debugElement.queryAll(By.directive(RouterLinkStubDirective));
      links = linkDes.map(de => de.injector.get(RouterLinkStubDirective) as RouterLinkStubDirective);
    });

    it('can display the forgot page', () => {
      const element: DebugElement = fixture.debugElement;

      const title: DebugElement[] = element.queryAll(By.css('h1'));
      expect(title.length).toBe(1);
      expect(title[0].nativeElement.textContent.trim()).toBe('Forgot');

      fixture.detectChanges();

      const message: DebugElement[] = element.queryAll(By.css('small'));
      expect(message.length).toBe(1); //because pageHeader has a <small> tag in its template
      expect(message[0].nativeElement.textContent.trim()).toBe('');
    });

    it('should reset the password and redirect to login page', () => {
      const element: DebugElement = fixture.debugElement;

      let inputs: DebugElement[] = element.queryAll(By.css('input'));
      expect(inputs.length).toBe(1);

      comp.formModel.controls['email'].setValue('fake@email.com');
      expect(comp.formModel.valid).toBe(true);

      comp.onForgot();

      fixture.detectChanges();

      expect(page.navSpy.calls.any()).toBe(true, 'navigate called');
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });
  });

  describe('---NO---', () => {
    beforeEach(() => fixture.detectChanges());

    it(`shouldn't send an email and display an error message`, () => {
      const element: DebugElement = fixture.debugElement;

      const inputs: DebugElement[] = element.queryAll(By.css('input'));
      expect(inputs.length).toBe(1);

      comp.formModel.controls['email'].setValue('fakewrongemail-com');

      expect(comp.formModel.valid).toBe(false);
    });
  });

  describe('---ERROR---', () => {
    beforeEach(() => fixture.detectChanges());

    it(`shouldn't send an email and display an error message, because recaptcha isn't valid`, () => {
      const element: DebugElement = fixture.debugElement;

      const inputs: DebugElement[] = element.queryAll(By.css('input'));
      expect(inputs.length).toBe(1);

      comp.formModel.controls['email'].setValue(FAKE_BAD_EMAIL_TOKEN);

      expect(comp.formModel.valid).toBe(true);

      comp.onForgot();

      fixture.detectChanges();

      const messages: DebugElement[] = element.queryAll(By.css('div.alert.alert-danger'));
      expect(messages.length).toBe(1);
      expect(messages[0].nativeElement.textContent.trim()).toBe('Danger No account with that email address exists.');
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