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

describe('Project list page', () => {

  beforeEach( () => {
    browser.get('/projects');
  });

  it('should display the project list page', () => {

    let titleText: any =  element(by.id('title')).getText();
    expect(titleText).toEqual('Projects');

    let inputLabel: any =  element(by.css('label')).getText();
    expect(inputLabel).toEqual('Filter results');

    // all elements
    let projectNames = element.all(by.css('.media-body')).all(by.css('.project-name'));
    expect(projectNames.count()).toEqual(3);
    expect(projectNames.getText()).toEqual(['BYAManager', 'SPF', 'Superapp']);

    // try navigation between pages using the pagination buttons
    let pageItems: any = element.all(by.css('.page-item'));
    expect(pageItems.count()).toEqual(6);
    expect(pageItems.get(2).getText()).toEqual('1\n(current)');
    expect(pageItems.get(3).getText()).toEqual('2');
    pageItems.get(3).click();
    projectNames = element.all(by.css('.media-body')).all(by.css('.project-name'));
    expect(projectNames.count()).toEqual(1);
    expect(projectNames.getText()).toEqual(['SWIMv2']);
    pageItems.get(2).click();

    // only one element
    let filterInput: any = element(by.id('filter'));
    filterInput.sendKeys('SPF');
    projectNames = element.all(by.css('.media-body')).all(by.css('.project-name'));
    expect(projectNames.count()).toEqual(1);
    expect(projectNames.getText()).toEqual(['SPF']);

    // no elements
    filterInput.clear();
    filterInput.sendKeys('wrong');
    projectNames = element.all(by.css('.media-body')).all(by.css('.project-name'));
    expect(projectNames.count()).toEqual(0);

    filterInput.clear();
    filterInput.sendKeys('');
  });

  it('should navigate to the project detail page',() => {
    // all elements
    let projectNames: any = element.all(by.css('.media-body')).all(by.css('.project-name'));
    expect(projectNames.count()).toEqual(3);
    expect(projectNames.getText()).toEqual(['BYAManager', 'SPF', 'Superapp']);

    // click on a project to navigate to its detail
    projectNames.get(0).click();

    let titleText: any = element(by.id('title')).getText();
    expect(titleText).toEqual('BYAManager');

    let descriptionTitle: any = element(by.css('section#Description h3')).getText();
    expect(descriptionTitle).toEqual('Description');
    let newsTitle: any = element(by.css('section#News h3')).getText();
    expect(newsTitle).toEqual('News');
    let featuresTitle: any = element(by.css('section#Features h3')).getText();
    expect(featuresTitle).toEqual('Features');
    let futureExtsTitle: any = element(by.css('section#FutureExtensions h3')).getText();
    expect(futureExtsTitle).toEqual('Future extensions');
    let videoTitle: any = element(by.css('section#Video h3')).getText();
    expect(videoTitle).toEqual('Video');
    let imagesTitle: any = element(by.css('section#Images h3')).getText();
    expect(imagesTitle).toEqual('Images');
    let licenseTitle: any = element(by.css('section#License h3')).getText();
    expect(licenseTitle).toEqual('License');
  });

  it('should navigate to the project detail page and display angular-modal-gallery',() => {
    // all elements
    let projectNames: any = element.all(by.css('.media-body')).all(by.css('.project-name'));
    expect(projectNames.count()).toEqual(3);
    expect(projectNames.getText()).toEqual(['BYAManager', 'SPF', 'Superapp']);

    // click on a project to navigate to its detail
    projectNames.get(0).click();

    // scroll to the bottom of the page using a
    // big value (500000) as y coordinate
    browser.executeScript('window.scrollTo(0,500000);');

    let imgThumbs: any = element.all(by.css('.ng-thumb'));
    expect(imgThumbs.count()).toEqual(11);
    imgThumbs.get(0).click();

    let navRight: any = element(by.css('a.nav-right i'));
    expect(navRight.getAttribute('class')).toEqual('fa fa-angle-right');
    let navLeft: any = element(by.css('a.nav-left i'));
    expect(navLeft.getAttribute('class')).toEqual('fa fa-angle-left');

    let img: any = element(by.css('img.effect'));
    expect(img).not.toBeUndefined();
    expect(img.getAttribute('src')).toEqual('http://localhost:3000/assets/images/projects/byamanager/1.jpg');
    expect(img.getAttribute('alt')).toEqual('Image 1');
  });
});