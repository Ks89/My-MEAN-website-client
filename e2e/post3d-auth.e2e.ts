// /*
//  * Copyright (C) 2015-2017 Stefano Cappa
//  *
//  * Licensed under the Apache License, Version 2.0 (the "License");
//  * you may not use this file except in compliance with the License.
//  * You may obtain a copy of the License at
//  *
//  *      http://www.apache.org/licenses/LICENSE-2.0
//  *
//  * Unless required by applicable law or agreed to in writing, software
//  * distributed under the License is distributed on an "AS IS" BASIS,
//  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  * See the License for the specific language governing permissions and
//  * limitations under the License.
//  */
//
// import { browser, by, element, protractor } from 'protractor';
//
// let EC = protractor.ExpectedConditions;
//
// describe('Post3d-auth page', () => {
//
//   beforeAll(() => {
//     browser.get('/login');
//   });
//
//   it('should login with a third-party service', () => {
//
//     let loginGithubButton = element(by.css('a.btn.btn-success'));
//     loginGithubButton.click();
//
//     let usernameInput = element(by.id('login_field'));
//     let passwordInput = element(by.id('password'));
//
//     browser.wait(EC.presenceOf(usernameInput), 60000)
//       .then(() => {
//         // expect(usernameInput.isPresent()).toBe(true);
//         // usernameInput.sendKeys('e2ek');
//         // passwordInput.sendKeys('PeppoPippo_1');
//         // let signInButton = element(by.css('input.btn.btn-primary.btn-block'));
//         // signInButton.click();
//         //
//         // let githubAuthorizeButton = element(by.id('js-oauth-authorize-btn'));
//         // browser.wait(EC.elementToBeClickable(githubAuthorizeButton), 60000)
//         //   .then(() => {
//         //     expect(githubAuthorizeButton.isPresent()).toBe(true);
//         //     githubAuthorizeButton.click();
//         //
//         //     // browser.wait(EC.urlContains('profile'), 5000);
//         //
//         //     console.log('after profile');
//
//             // let profileImage = element(by.css('img.img-thumbnail'));
//             // let githubConnectedService = element(by.css('span.fa.fa-github.fa-2x'));
//             // browser.wait(EC.urlContains('profile'), 60000)
//             //   .then(() => {
//             //     console.log('after github service');
//             //     let profileImage = element(by.css('img.img-thumbnail'));
//             //     expect(profileImage).toBeDefined();
//             //   });
//             // let profileImage = element(by.css('img.img-thumbnail'));
//             // browser.wait(EC.presenceOf(profileImage), 60000)
//             //   .then(() => {
//             //     expect(profileImage).toBeDefined();
//
//                 // let links = element.all(by.css('a.dropdown-item'));
//                 // expect(links.count()).toEqual(2);
//                 // expect(links.get(1).getText()).toEqual('Logout');
//                 // links.get(1).click();
//               // });
//           // });
//       });
//   });
// });
