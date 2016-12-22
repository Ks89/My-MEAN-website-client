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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import Post3dAuthComponent from './post3d-auth.component';
import { RouterLinkStubDirective, RouterOutletStubComponent, RouterStub } from '../../common/testing/helpers.spec';
import { AuthService } from "../../common/services/auth.service";
import { FakeAuthService, FakeWrongAuthService } from "../../common/testing/fake-auth.service.spec";
import PageHeaderComponent from "../../common/components/page-header/page-header.component";
import { LaddaModule } from "angular2-ladda";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { Router } from "@angular/router";

let comp: Post3dAuthComponent;
let fixture: ComponentFixture<Post3dAuthComponent>;
let router: RouterStub;
let links: RouterLinkStubDirective[];
let linkDes: DebugElement[];
let page: Page;

function initTestBed(authServiceMocked) {
  router = { navigate: jasmine.createSpy('navigate') };

  TestBed.configureTestingModule({
    imports: [FormsModule, ReactiveFormsModule, LaddaModule],
    declarations: [ Post3dAuthComponent, PageHeaderComponent, RouterLinkStubDirective, RouterOutletStubComponent ],
    // schemas:      [ NO_ERRORS_SCHEMA ]
  }).overrideComponent(Post3dAuthComponent, {
    set: {
      providers: [
        { provide: Router, useValue: router },
        authServiceMocked
      ]
    }
  }); // not necessary with webpack .compileComponents();

  fixture = TestBed.createComponent(Post3dAuthComponent);
  comp = fixture.componentInstance;

  fixture.detectChanges();
  return fixture.whenStable().then(() => {
    fixture.detectChanges();
    page = new Page(fixture);
  });
}


describe('Post3dAuthComponent', () => {
  beforeEach(() => initTestBed({ provide: AuthService, useClass: FakeAuthService }));

  it('can instantiate it', () => expect(comp).not.toBeNull());

  describe('---YES---', () => {
    beforeEach(() => {
      fixture.detectChanges();
      linkDes = fixture.debugElement.queryAll(By.directive(RouterLinkStubDirective));
      links = linkDes.map(de => de.injector.get(RouterLinkStubDirective) as RouterLinkStubDirective);
    });

    it('can display the post3d-auth page', () => {
      const element: DebugElement = fixture.debugElement;

      const title: DebugElement[] = element.queryAll(By.css('h1'));
      expect(title.length).toBe(1);
      expect(title[0].nativeElement.textContent.trim()).toBe('PostLogin');

      const message: DebugElement[] = element.queryAll(By.css('small'));
      expect(message.length).toBe(1); //because pageHeader has a <small> tag in its template
      expect(message[0].nativeElement.textContent.trim()).toBe('');
    });

    it('can get RouterLinks from template', () => {
      expect(links.length).toBe(1, 'should have 1 links');
      expect(links[0].linkParams).toEqual(['/profile'], '1st link should go to profile');
    });

    it(`should redirect to profile`, () => {
      expect(router.navigate).toHaveBeenCalledWith(['/profile']);
    });
  });

  describe('---ERROR---', () => {
    beforeEach(() => {
      TestBed.resetTestingModule();
      return initTestBed({ provide: AuthService, useClass: FakeWrongAuthService });
    });

    it('can get RouterLinks from template', () => {
      expect(links.length).toBe(1, 'should have 1 links');
      expect(links[0].linkParams).toEqual(['/profile'], '1st link should go to profile');
    });

    it(`should return to login`, () => {
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });

    it(`should return to profile page`, () => {
      const element: DebugElement = fixture.debugElement;

      // TODO implement click on login url
      // const links: DebugElement[] = element.queryAll(By.css('a'));
      // expect(links.length).toBe(1);
      // links[0].nativeElement.triggerEventHandler('click', null);
      //
      // fixture.detectChanges();
      //
      // expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });
  });
});

class Page {
  // navSpy: jasmine.Spy;

  constructor(fixture) {
    // Get the component's injected router and spy on it
    // Use component's injector to see the services it injected.
    const compInjector = fixture.debugElement.injector;
    const router = compInjector.get(Router);

    // this.navSpy = spyOn(router, 'navigate');
  };
}

