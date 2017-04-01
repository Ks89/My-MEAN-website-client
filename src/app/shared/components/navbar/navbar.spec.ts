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

import {async, ComponentFixture, TestBed, tick, fakeAsync} from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import { NavbarComponent } from './navbar.component';
import { RouterLinkStubDirective, RouterOutletStubComponent, RouterStub } from '../../testing/router-stubs.spec';
import { AuthService } from "../../services/auth.service";
import { FakeAuthService } from "../../testing/fake-auth.service.spec";
import { Router } from "@angular/router";
import {click} from "../../testing/helpers.spec";

const FAKE_USERNAME = 'fake username';

let comp: NavbarComponent;
let fixture: ComponentFixture<NavbarComponent>;
let links: RouterLinkStubDirective[];
let router: RouterStub;
let linkDes: DebugElement[];

function initTestBed(forceLogIn: boolean) {
  router = { navigate: jasmine.createSpy('navigate') };

  TestBed.configureTestingModule({
    declarations: [ NavbarComponent, RouterLinkStubDirective, RouterOutletStubComponent ],
    // schemas:      [ NO_ERRORS_SCHEMA ]
  }).overrideComponent(NavbarComponent, {
    set: {
      providers: [
        { provide: Router, useValue: router },
        { provide: AuthService, useClass: FakeAuthService }
      ]
    }
  }); // not necessary with webpack .compileComponents();

  fixture = TestBed.createComponent(NavbarComponent);
  comp = fixture.componentInstance;

  if(forceLogIn) {
    comp.isLoggedIn = true;
    comp.currentUser = { name : FAKE_USERNAME };
  }

  // 1st change detection triggers ngOnInit
  fixture.detectChanges();
  // 2nd change detection displays the async-fetched data
  return fixture.whenStable().then(() => fixture.detectChanges());
}

describe('NavbarComponent', () => {

  describe('---YES---', () => {
    beforeEach( async(() => {
      return initTestBed(true);
    })); // logged in

    it('can instantiate it', () => expect(comp).not.toBeNull());

    describe('---LOGGED IN---', () => {

      beforeEach(() => {
        fixture.detectChanges();
        linkDes = fixture.debugElement.queryAll(By.directive(RouterLinkStubDirective));
        links = linkDes.map(de => de.injector.get(RouterLinkStubDirective) as RouterLinkStubDirective);
      });

      it('can display the navbar with Projects as current page', () => {
        const element: DebugElement = fixture.debugElement;

        const navbarBrand: DebugElement = element.query(By.css('a.navbar-brand.m-b-0'));
        expect(navbarBrand.nativeElement.textContent.trim()).toBe('KS');

        const navLinks: DebugElement[] = element.queryAll(By.css('a.nav-link'));
        expect(navLinks.length).toBe(6);
        expect(navLinks[0].nativeElement.textContent.trim()).toBe('Projects (current)');
        expect(navLinks[1].nativeElement.textContent.trim()).toBe('CV');
        expect(navLinks[2].nativeElement.textContent.trim()).toBe('Contact');
        expect(navLinks[3].nativeElement.textContent.trim()).toBe('About');
        expect(navLinks[4].nativeElement.textContent.trim()).toBe('Profile');
        expect(navLinks[5].nativeElement.textContent.trim()).toBe(FAKE_USERNAME);
      });

      it(`can display the navbar's dropdown and logout`, () => {
        const element: DebugElement = fixture.debugElement;

        const loggedUser: DebugElement = element.query(By.css('a.nav-link.dropdown-toggle'));
        expect(loggedUser.nativeElement.textContent).toBe(FAKE_USERNAME);
        click(loggedUser);

        const logoutItems: DebugElement[] = element.queryAll(By.css('a.dropdown-item'));
        expect(logoutItems[0].nativeElement.textContent).toBe('Profile');
        expect(logoutItems[1].nativeElement.textContent).toBe('Logout');

        click(logoutItems[1]);

        expect(router.navigate).toHaveBeenCalledWith(['/']);
      });

      it('can get RouterLinks from template, when user is NOT logged in', () => {
        expect(links.length).toBe(7, 'should have 7 links');
        expect(links[0].linkParams).toEqual(['/'], 'should go to home');
        expect(links[1].linkParams).toEqual(['/projects'], 'should go to project list');
        expect(links[2].linkParams).toEqual(['/cv'], 'should go to cv');
        expect(links[3].linkParams).toEqual(['/contact'], 'should go to contact');
        expect(links[4].linkParams).toEqual(['/about'], 'should go to about');
        expect(links[5].linkParams).toEqual(['/profile'], 'should go to login');
        expect(links[6].linkParams).toEqual(['/profile'], 'should go to profile');
      });
    });
  });

  describe('---NO---', () => {
    beforeEach( async(() => {
      TestBed.resetTestingModule();
      return initTestBed(false);
    })); // not logged in

    it('can instantiate it', () => expect(comp).not.toBeNull());

    describe('---NOT LOGGED IN---', () => {

      beforeEach(() => {
        fixture.detectChanges();
        linkDes = fixture.debugElement.queryAll(By.directive(RouterLinkStubDirective));
        links = linkDes.map(de => de.injector.get(RouterLinkStubDirective) as RouterLinkStubDirective);
      });

      it('can display the navbar with Projects as current page', () => {
        const element: DebugElement = fixture.debugElement;

        const navbarBrand: DebugElement = element.query(By.css('a.navbar-brand.m-b-0'));
        expect(navbarBrand.nativeElement.textContent.trim()).toBe('KS');

        const navLinks: DebugElement[] = element.queryAll(By.css('a.nav-link'));
        expect(navLinks.length).toBe(5);
        expect(navLinks[0].nativeElement.textContent.trim()).toBe('Projects (current)');
        expect(navLinks[1].nativeElement.textContent.trim()).toBe('CV');
        expect(navLinks[2].nativeElement.textContent.trim()).toBe('Contact');
        expect(navLinks[3].nativeElement.textContent.trim()).toBe('About');
        expect(navLinks[4].nativeElement.textContent.trim()).toBe('Sign in');
      });

      it('can get RouterLinks from template, when user is NOT logged in', () => {
        expect(links.length).toBe(6, 'should have 6 links');
        expect(links[0].linkParams).toEqual(['/'], 'should go to home');
        expect(links[1].linkParams).toEqual(['/projects'], 'should go to project list');
        expect(links[2].linkParams).toEqual(['/cv'], 'should go to cv');
        expect(links[3].linkParams).toEqual(['/contact'], 'should go to contact');
        expect(links[4].linkParams).toEqual(['/about'], 'should go to about');
        expect(links[5].linkParams).toEqual(['/login'], 'should go to login');
      });
    });
  });
});
