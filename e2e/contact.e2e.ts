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

describe('Contact page', () => {

  beforeAll( () => {
    browser.get('/contact');
  });

  it('should display the contact page', () => {

    let titleText: any =  element(by.id('title')).getText();
    expect(titleText).toEqual('Contact');

    let leadText: any =  element(by.css('p.lead')).getText();
    expect(leadText).toEqual('Send me an email');

    let emailInput: any = element(by.id('emailInput'));
    emailInput.sendKeys('fake@fake.com');
    expect(emailInput.getAttribute('value')).toEqual('fake@fake.com');
    let subjectInput: any = element(by.id('subjectInput'));
    subjectInput.sendKeys('blablabla');
    expect(subjectInput.getAttribute('value')).toEqual('blablabla');
    let textInput: any = element(by.id('textInput'));
    textInput.sendKeys('Some useless words inside the text area');
    expect(textInput.getAttribute('value')).toEqual('Some useless words inside the text area');

    // let recaptchaCheckbox = element(by.css('span#recaptcha-anchor'));
    // recaptchaCheckbox.click();

    // workaround for Windows/Appveyor because, otherwise It cannot find this button
    // scroll to the bottom of the page using a
    // big value (500000) as y coordinate
    // This is used in other tests, but for meaningful cases.
    // Here it is a workaround
    browser.executeScript('window.scrollTo(0,500000);');

    let sendButton = element(by.id('sendButton'));
    sendButton.click();
    let statusMessage: any = element(by.css('div.alert.alert-danger'));
  });
});