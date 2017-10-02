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

describe('Post3d-auth page github', () => {

  beforeAll(() => {
    browser.get('/login');
  });

  it('should login with a third-party service github', () => {

    let loginGithubButton = element(by.css('a.btn.btn-success'));
    loginGithubButton.click();

    let usernameInput = element(by.id('login_field'));
    let passwordInput = element(by.id('password'));

    browser.wait(EC.presenceOf(usernameInput), 60000)
      .then(() => {
        expect(usernameInput.isPresent()).toBe(true);
        usernameInput.sendKeys(process.env.GITHUB_USER_E2E);
        passwordInput.sendKeys(process.env.GITHUB_PWD_E2E);
        let signInButton = element(by.css('input.btn.btn-primary.btn-block'));
        signInButton.click();

        browser.wait(EC.urlContains('profile'), 5000)
          .then(() => {
            console.log('github already authorized - OK!');

            checkProfilePage();

            browser.sleep(500);
            logout();
          }).catch(err => {
            let githubAuthorizeButton = element(by.id('js-oauth-authorize-btn'));
            console.log('github first authorization - OK!');
            // first authorization
            browser.wait(EC.presenceOf(githubAuthorizeButton), 5000)
              .then(() => {
                expect(githubAuthorizeButton).toBeDefined();
                githubAuthorizeButton.click();

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
  let githubConnectedService = element(by.css('span.fa.fa-github.fa-2x'));
  expect(githubConnectedService).toBeDefined();
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
