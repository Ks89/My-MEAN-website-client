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

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement, EventEmitter, Pipe, PipeTransform } from '@angular/core';
import { By } from '@angular/platform-browser';
import { TranslatePipe, TranslateService, TranslationChangeEvent } from '@ngx-translate/core';

import { AboutComponent } from './about.component';
import { PageHeaderComponent } from "../../shared/components/page-header/page-header.component";
import { inject } from "@angular/core/testing";

let comp: AboutComponent;
let fixture: ComponentFixture<AboutComponent>;

import { Observable } from "rxjs";

// class TranslateCustomLoader implements TranslateLoader {
//   getTranslation(lang: string): Observable<any> {
//     if (lang == "it") {
//       let it = readJSON('assets/i18n/it.json');
//       console.log('------------------------------------', it);
//       return Observable.of(it);
//     }
//     let en = readJSON('assets/i18n/en.json');
//     console.log('------------------------------------', en);
//     return Observable.of(en);
//   }
// }

@Pipe({
  name: "translate"
})
export class TranslatePipeMock implements PipeTransform {
  public name: string = "translate";

  public transform(query: string, ...args: any[]): any {
    return query;
  }
}

class TranslateServiceStub {

  private _onTranslationChange: EventEmitter<TranslationChangeEvent> = new EventEmitter<TranslationChangeEvent>();

  public get(key: any): any {
    return Observable.of(key);
  }


}

describe('AboutComponent', () => {
  beforeEach(async(() => {

    TestBed.configureTestingModule({
      // imports: [
      //   TranslateModule.forRoot({
      //   loader: {
      //     provide: TranslateLoader,
      //     useClass: TranslateCustomLoader
      //   }
      // })],
      declarations: [AboutComponent, PageHeaderComponent, TranslatePipe]
      // schemas:      [ NO_ERRORS_SCHEMA ]
    }).overrideComponent(AboutComponent, {
      set: {
        providers: [
          {provide: TranslateService, useClass: TranslateServiceStub}
        ]
      }
    });


    fixture = TestBed.createComponent(AboutComponent);
    comp = fixture.componentInstance;

    fixture.detectChanges();
    return fixture.whenStable().then(() => fixture.detectChanges());
  }));

  it('can instantiate it', () => expect(comp).not.toBeNull());

  let translateService: TranslateService;

  describe('---YES---', () => {

    beforeEach(inject([TranslateService], (service) => {
      translateService = service;
      translateService.use('en');
      fixture.detectChanges();
    }));

    it('should display the about page', () => {
      const element: DebugElement = fixture.debugElement;

      // const title: DebugElement[] = element.queryAll(By.css('h1'));
      // expect(title.length).toBe(1);
      // expect(title[0].nativeElement.textContent.trim()).toBe('About');

      fixture.detectChanges();

      const message: DebugElement[] = element.queryAll(By.css('small'));
      expect(message.length).toBe(2); //because pageHeader has a <small> tag in its template
      expect(message[0].nativeElement.textContent.trim()).toBe('');
      expect(message[1].nativeElement.textContent.trim()).toBe('Not implemented yet');
    });
  });
});
