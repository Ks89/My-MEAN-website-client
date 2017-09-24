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

describe('Activation page', () => {

  beforeEach( () => {
    browser.get('/activate?emailToken=185fa7a1c9c2aafeae011681eb86ac56868c31ceaec8aeaf22df3c8d5b4a83d21303b74a6eccb6be08fd2e49a35a0818f0aae7df4c7c971a1942d6aae0e08023&userName=aaa');
  });

  it('should display the activation page', () => {

    let titleText: any =  element(by.id('title')).getText();
    expect(titleText).toEqual('Activate');

    let leadText: any =  element(by.css('h4')).getText();
    expect(leadText).toEqual('Welcome aaa');

    let statusElement: any =  element(by.css('div.alert'));

    browser.wait(EC.elementToBeClickable(statusElement), 60000)
      .then(() => {
        expect(statusElement.isPresent()).toBe(true);
        expect(statusElement.getText()).toEqual('Success An e-mail has been sent to activate@fake-mmw.com with further instructions.');
      });
  });
});