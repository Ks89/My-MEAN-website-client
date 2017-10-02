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

describe('Post3d-auth page google', () => {

  beforeAll(() => {
    browser.get('/login');
  });

  it('should login with a third-party service google', () => {

    let loginGoogleButton = element(by.css('a.btn.btn-danger'));
    loginGoogleButton.click();

    let usernameInput = element(by.id('identifierId'));
    browser.wait(EC.presenceOf(usernameInput), 5000);

    usernameInput.sendKeys(process.env.GOOGLE_USER_E2E);

    let usernameButton = element(by.id('identifierNext'));
    usernameButton.click();

    let passwordInput = element(by.name('password'));
    browser.wait(EC.presenceOf(passwordInput), 60000)
      .then(() => {
        browser.sleep(3000);

        passwordInput.sendKeys(process.env.GOOGLE_PWD_E2E);

        let passwordButton = element(by.id('passwordNext'));
        passwordButton.click();

        browser.wait(EC.urlContains('profile'), 5000)
          .then(() => {
            console.log('google already authorized - OK!');

            checkProfilePage();

            browser.sleep(500);
            logout();
          }).catch(err => {
            let allowAccessButton = element(by.id('submit_approve_access'));
            browser.wait(EC.presenceOf(allowAccessButton), 60000)
              .then(() => {
                console.log('google first authorization - OK!');

                allowAccessButton.click();

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
  let googleConnectedService = element(by.css('span.fa.fa-google.fa-2x'));
  expect(googleConnectedService).toBeDefined();
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
