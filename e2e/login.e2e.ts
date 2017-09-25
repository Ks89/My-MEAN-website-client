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

import { browser, by, element, protractor } from 'protractor';

let EC = protractor.ExpectedConditions;

describe('Login page', () => {

  beforeEach( () => {
    browser.get('/login');
  });

  it('should display the login page', () => {

    let titleText: any =  element(by.id('title')).getText();
    expect(titleText).toEqual('Sign in');

    let leadText: any =  element(by.css('p.lead')).getText();
    expect(leadText).toEqual('Not a member? Please register first.');

    let emailInput: any = element(by.id('email'));
    emailInput.sendKeys('login@fake-mmw.com');
    expect(emailInput.getAttribute('value')).toEqual('login@fake-mmw.com');
    let passwordInput: any = element(by.id('password'));
    passwordInput.sendKeys('Qw12345678');
    expect(passwordInput.getAttribute('value')).toEqual('Qw12345678');

    let signInButton = element(by.id('signInButton'));
    signInButton.click();

    let profileImage = element(by.css('.img-thumbnail'));
    expect(profileImage).toBeDefined();

    // logout
    let navbarDropdown = element(by.id('navbarDropdownMenuLink'));
    browser.wait(EC.presenceOf(navbarDropdown), 60000)
      .then(() => {
        navbarDropdown.click();
        let dropdownLinks = element.all(by.css('.dropdown-item'));
        expect(dropdownLinks.count()).toEqual(2);
        browser.wait(EC.presenceOf(dropdownLinks.get(1)), 60000)
          .then(() => {
            dropdownLinks.get(1).click();
          });
      });
  });
});