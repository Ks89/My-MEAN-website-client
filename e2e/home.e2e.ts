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

describe('Home page', () => {

  beforeAll( () => {
    browser.get('/');
  });

  it('should display the homepage with projects', () => {

    let titleText: any =  element(by.id('title')).getText();
    expect(titleText).toEqual('KS Welcome');

    let cards = element.all(by.css('.card-body')).all(by.css('.card-title.text-center'));
    expect(cards.count()).toEqual(3);
    expect(cards.getText()).toEqual(['BYAManager', 'SPF', 'Superapp']);

    let cardsDescription = element.all(by.css('.card-body')).all(by.css('.card-text'));
    expect(cardsDescription.count()).toEqual(3);
    expect(cardsDescription.getText()).toEqual(['sfsfasf', 'sfsfasf', 'sfsfasf']);

    let featuretteHeading = element.all(by.css('.featurette-heading'));
    expect(featuretteHeading.count()).toEqual(3);
    expect(featuretteHeading.getText()).toEqual([`BYAManager It'll blow your mind.`, `SPF It'll blow your mind.`, `Superapp It'll blow your mind.`]);

    let featuretteDescription = element.all(by.css('p.lead'));
    expect(featuretteDescription.count()).toEqual(3);
    expect(featuretteDescription.getText()).toEqual(['dasdasdas', 'dasdasdas', 'dasdasdas']);

    let cookieConsent = element.all(by.css('cookie-law-el')).all(by.css('.cookie-law-wrapper.ng-trigger.ng-trigger-transition')).all(by.css('span'));
    expect(cookieConsent.count()).toEqual(2);
    expect(cookieConsent.getText()).toEqual(['', `By continuing to browse the site, you're agreeing to our use of cookies.`]);

    let cookieConsentClose = element.all(by.css('cookie-law-el')).all(by.css('.dismiss'));
    expect(cookieConsentClose.count()).toEqual(1);
    cookieConsentClose.get(0).click();
    // TODO click this button

    let copyright = element.all(by.css('footer')).all(by.css('p'));
    expect(copyright.count()).toEqual(1);
    expect(copyright.getText()).toEqual(['Copyright © Stefano Cappa 2015-2016']);
  });
});