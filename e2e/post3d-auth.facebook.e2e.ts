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

describe('Post3d-auth page facebook', () => {

  beforeAll(() => {
    browser.get('/login');
  });

  it('should login with a third-party service facebook', () => {

    let loginFacebookButton = element(by.css('a.btn.btn-primary'));
    loginFacebookButton.click();

    let emailInput = element(by.id('email'));
    let passwordInput = element(by.id('pass'));

    browser.wait(EC.presenceOf(emailInput), 60000)
      .then(() => {
        expect(emailInput.isPresent()).toBe(true);
        emailInput.sendKeys(process.env.FACEBOOK_USER_E2E);
        passwordInput.sendKeys(process.env.FACEBOOK_PWD_E2E);
        let logInButton = element(by.id('loginbutton'));
        logInButton.click();

        browser.wait(EC.urlContains('profile'), 5000)
          .then(() => {
            console.log('facebook already authorized - OK!');

            checkProfilePage();

            browser.sleep(500);
            logout();
          }).catch(err => {
            // FIXME there is a bug in my e2e tests.
            // FIXME I cannot access to my fb app if it is a first authorization. Why???
            // FIXME button is not visible and browser is covered by a semi-trasparent black layer
            let facebookAuthorizeButton = element(by.name('__CONFIRM__'));
            console.log('facebook first authorization - OK!');
            // first authorization
            browser.wait(EC.presenceOf(facebookAuthorizeButton), 5000)
              .then(() => {
                expect(facebookAuthorizeButton).toBeDefined();
                facebookAuthorizeButton.click();

                browser.wait(EC.urlContains('profile'), 5000);

                checkProfilePage();

                browser.sleep(500);
                logout();
              });
          });
      });
  });
});

function checkProfilePage() {
  let profileImage = element(by.css('img.img-thumbnail'));
  expect(profileImage).toBeDefined();
  let facebookConnectedService = element(by.css('span.fa.fa-facebook.fa-2x'));
  expect(facebookConnectedService).toBeDefined();
}

function logout() {
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
}
