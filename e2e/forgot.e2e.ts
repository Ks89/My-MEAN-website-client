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

describe('Forgot page', () => {

  beforeEach( () => {
    browser.get('/forgot');
  });

  it('should display the forgot page', () => {

    let titleText: any =  element(by.id('title')).getText();
    expect(titleText).toEqual('Forgot');

    let leadText: any =  element(by.css('h4')).getText();
    expect(leadText).toEqual('Type the email used to create your account');

    let emailInput: any = element(by.id('email'));
    emailInput.sendKeys('forgot@fake-mmw.com');
    expect(emailInput.getAttribute('value')).toEqual('forgot@fake-mmw.com');

    let forgotButton = element(by.id('forgotButton'));
    forgotButton.click();

    // TODO add a test to check for no errors
    // TODO check also redirect
  });
});