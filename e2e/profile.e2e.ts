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

describe('Profile page', () => {

  beforeEach( () => {
    browser.get('/login'); // because I have to login to show user's profile
  });

  it('should login and display the profile page', () => {

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

    browser.wait(EC.urlContains('profile'), 5000);
    // profile page should be loaded

    let profileImage = element(by.css('.img-thumbnail'));
    expect(profileImage).toBeDefined();

    let profileTitles = element.all(by.css('h1#title'));
    expect(profileTitles.count()).toEqual(2);
    expect(profileTitles.getText()).toEqual(['Profile Welcome', 'Other services']);

    let connectedServicesTitleText = element(by.css('h3')).getText();
    expect(connectedServicesTitleText).toEqual('Connected services');

    let localUserIcon = element(by.css('span.fa.fa-user.fa-2x'));
    expect(localUserIcon).toBeDefined();

    let nameInput: any = element(by.id('name'));
    nameInput.sendKeys('name');
    expect(nameInput.getAttribute('value')).toEqual('name');
    let surnameInput: any = element(by.id('surname'));
    surnameInput.sendKeys('surname');
    expect(surnameInput.getAttribute('value')).toEqual('surname');
    let nicknameInput: any = element(by.id('nickname'));
    nicknameInput.sendKeys('nickname');
    expect(nicknameInput.getAttribute('value')).toEqual('nickname');
    let emailProfileInput: any = element(by.id('email'));
    emailProfileInput.sendKeys('profile@fake-mmw.com');
    expect(emailProfileInput.getAttribute('value')).toEqual('profile@fake-mmw.com');

    // workaround for Windows/Appveyor because, otherwise It cannot find this button
    // scroll to the bottom of the page using a
    // big value (500000) as y coordinate
    // This is used in other tests, but for meaningful cases.
    // Here it is a workaround
    browser.executeScript('window.scrollTo(0,500000);');

    let updateProfileButton = element(by.id('updateButton'));
    updateProfileButton.click();

    let statusElement: any =  element(by.css('div.alert'));

    browser.wait(EC.elementToBeClickable(statusElement), 60000)
      .then(() => {
        expect(statusElement.isPresent()).toBe(true);
        expect(statusElement.getText()).toEqual('Success Profile updated successfully!');
      });
  });
});