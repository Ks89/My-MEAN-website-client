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

describe('Activation page', () => {

  beforeEach( () => {
    browser.get('/activate?emailToken=0b67e05c26916daf14dabaddead1ed4b2ddcec410609ded8c7ee101e8b43aa6cbb69951163f64994ea74251f113bdb5c4a3cfcd626f8b3d86feca7261d65649a&userName=aaa');
    //http://localhost:8080/activate?emailToken=2a00b92e4329844aef2ddb08e5cb4b333179d28875e8a9f061b290c839a5b8166e1bf620a70365214e7c1fd7724a62435f214ceed3b166b837e5b640adf154b7&userName=aaa
  });

  it('should display the activation page', () => {

    let titleText: any =  element(by.id('title')).getText();
    expect(titleText).toEqual('Activate');

    let leadText: any =  element(by.css('h4')).getText();
    expect(leadText).toEqual('Welcome aaa');

    // TODO find a better way to wait for the result message (success/error)
    browser.sleep(2000);

    let statusText: any =  element(by.css('div.alert')).getText();
    expect(statusText).toEqual('Success An e-mail has been sent to stefano.cappa.ks89@gmail.com with further instructions.');
  });
});