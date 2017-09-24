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

import { browser, by, element } from 'protractor';

describe('Register page', () => {

  beforeEach( () => {
    browser.get('/register');
  });

  it('should display the registration page', () => {

    let titleText: any =  element(by.id('title')).getText();
    expect(titleText).toEqual('Create a new accout');

    let leadText: any =  element(by.css('p.lead')).getText();
    expect(leadText).toEqual('Already a member? Please log in instead.');

    let fullNameInput: any = element(by.id('name'));
    fullNameInput.sendKeys('Test registration');
    expect(fullNameInput.getAttribute('value')).toEqual('Test registration');
    let emailInput: any = element(by.id('email'));
    emailInput.sendKeys('register@fake-mmw.com');
    expect(emailInput.getAttribute('value')).toEqual('register@fake-mmw.com');
    let emailConfirmInput: any = element(by.id('emailConfirm'));
    emailConfirmInput.sendKeys('register@fake-mmw.com');
    expect(emailConfirmInput.getAttribute('value')).toEqual('register@fake-mmw.com');
    let passwordInput: any = element(by.id('password'));
    passwordInput.sendKeys('Qw12345678');
    expect(passwordInput.getAttribute('value')).toEqual('Qw12345678');
    let passwordConfirmInput: any = element(by.id('passwordConfirm'));
    passwordConfirmInput.sendKeys('Qw12345678');
    expect(passwordConfirmInput.getAttribute('value')).toEqual('Qw12345678');

    let registerButton = element(by.id('registerButton'));
    registerButton.click();
    let statusMessage: any = element(by.css('div.alert.alert-danger'));
  });
});