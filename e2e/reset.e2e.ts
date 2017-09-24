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

describe('Reset page', () => {

  beforeEach( () => {
    browser.get('/reset?emailToken=13e85339e300d21a5ec5bb3233d650badbe1269826eff6fadf6f20db32a83cd027a67f2fa3b82361cf1232acd27bc28340c9366f8b1b471fa258c54fa1d1bc6f&userName=aaa');
  });

  it('should display the reset page', () => {

    let titleText: any =  element(by.id('title')).getText();
    expect(titleText).toEqual('Password reset');

    let leadText: any =  element(by.css('h4')).getText();
    expect(leadText).toEqual('Type a new password');

    let passwordInput: any = element(by.id('password'));
    passwordInput.sendKeys('Qw12345678');
    expect(passwordInput.getAttribute('value')).toEqual('Qw12345678');
    let passwordConfirmInput: any = element(by.id('passwordConfirm'));
    passwordConfirmInput.sendKeys('Qw12345678');
    expect(passwordConfirmInput.getAttribute('value')).toEqual('Qw12345678');

    let resetButton = element(by.id('resetButton'));
    resetButton.click();

    let statusElement: any =  element(by.css('div.alert'));

    browser.wait(EC.elementToBeClickable(statusElement), 60000)
      .then(() => {
        expect(statusElement.isPresent()).toBe(true);
        expect(statusElement.getText()).toEqual('Success An e-mail has been sent to reset@fake-mmw.com with further instructions.');
      });
  });

});