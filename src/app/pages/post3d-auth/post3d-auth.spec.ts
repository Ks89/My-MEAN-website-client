/*
 * Copyright (C) 2015-201 Stefano Cappa
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

import {ComponentFixture, TestBed, fakeAsync, tick, async} from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';

import { Post3dAuthComponent } from './post3d-auth.component';
import { RouterLinkStubDirective, RouterOutletStubComponent, RouterStub, click } from '../../shared/testing/helpers.spec';
import { AuthService } from "../../core/services/auth.service";
import { FakeAuthService, FakeWrongPost3dAuthService, FakeWrongPost3dLoggedUserAuthService } from "../../shared/testing/fake-auth.service.spec";
import { PageHeaderComponent } from "../../shared/components/page-header/page-header.component";
import { LaddaModule } from "angular2-ladda";
import { ReactiveFormsModule, FormsModule } from "@angular/forms";
import { Router } from "@angular/router";

let comp: Post3dAuthComponent;
let fixture: ComponentFixture<Post3dAuthComponent>;
let router: RouterStub;
let links: RouterLinkStubDirective[];
let linkDes: DebugElement[];

function initTestBed(authServiceMocked) {
  TestBed.resetTestingModule();

  router = { navigate: jasmine.createSpy('navigate') };

  TestBed.configureTestingModule({
    imports: [ FormsModule, ReactiveFormsModule, LaddaModule, TranslateModule.forRoot()],
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
  return fixture.whenStable().then(() => fixture.detectChanges());
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

    describe('---Fake wrong post3d-auth authService---', () => {
      //this will cause a redirect to login, automatically
      beforeEach(() => initTestBed({provide: AuthService, useClass: FakeWrongPost3dAuthService}));

      it(`should return to login`, () => {
        expect(router.navigate).toHaveBeenCalledWith(['/login']);
      });
    });

    describe('---Fake post3d-auth with wrong loggedUser authService---', () => {
      //this won't call redirect, because post3dAuthAfterCallback is ok, but getLoggedUser will throw an error
      //so post3d-auth webpage will be displayed with a button to go back

      beforeEach(() => initTestBed({provide: AuthService, useClass: FakeWrongPost3dLoggedUserAuthService}));

      it('can get RouterLinks from template', () => {
        fixture.detectChanges();
        linkDes = fixture.debugElement.queryAll(By.directive(RouterLinkStubDirective));
        links = linkDes.map(de => de.injector.get(RouterLinkStubDirective) as RouterLinkStubDirective);

        expect(links.length).toBe(1, 'should have 1 links');
        expect(links[0].linkParams).toEqual(['/profile'], '1st link should go to profile');
      });

      it(`should return to profile page`, () => {
        const element: DebugElement = fixture.debugElement;

        const anchors: DebugElement[] = element.queryAll(By.css('a'));
        expect(anchors.length).toBe(1);
        expect(anchors[0].nativeElement.textContent).toBe('profile');

        expect(element.query(By.css('h4')).nativeElement.textContent).toBe('You are successfully logged in with the chosen external service');

        click(anchors[0]);

        // expect(router.navigate).toHaveBeenCalledWith(['/profile']);
      });
    });
  });

});

