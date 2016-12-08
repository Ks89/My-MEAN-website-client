/*
 * Copyright (C) 2015-2016 Stefano Cappa
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
import { NO_ERRORS_SCHEMA, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import ContactComponent from './contact.component';
import { FakeContactService } from "../../common/testing/fake-contact.service.spec";
import { ContactService } from "../../common/services/contact.service";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

let comp: ContactComponent;
let fixture: ComponentFixture<ContactComponent>;

function initTestBed() {
  TestBed.configureTestingModule({
    imports: [FormsModule, ReactiveFormsModule],
    declarations: [ContactComponent],
    schemas: [NO_ERRORS_SCHEMA],
  }).overrideComponent(ContactComponent, {
    set: {
      providers: [
        {provide: ContactService, useClass: FakeContactService}
      ]
    }
  }).compileComponents();

  fixture = TestBed.createComponent(ContactComponent);
  comp = fixture.componentInstance;

  fixture.detectChanges();
  return fixture.whenStable().then(() => fixture.detectChanges());
}

describe('ContactComponent', () => {
  beforeEach(async(() => initTestBed()));

  describe('---YES---', () => {
    beforeEach(() => fixture.detectChanges());

    it('can instantiate it', () => expect(comp).not.toBeNull());

    it('should send an email', () => {
      const element: DebugElement = fixture.debugElement;

      let inputs: DebugElement[] = element.queryAll(By.css('input'));
      expect(inputs.length).toBe(2);

      comp.formModel.controls['email'].setValue('fake@email.com');
      comp.formModel.controls['subject'].setValue('Fake subject');
      comp.formModel.controls['message'].setValue('Message message message message message');

      expect(comp.formModel.valid).toBe(true);

      comp.handleCorrectCaptcha('correct fake recaptcha response');

      comp.onSend();

      fixture.detectChanges();

      const messages: DebugElement[] = element.queryAll(By.css('div.alert.alert-success'));
      expect(messages.length).toBe(1);
      expect(messages[0].nativeElement.textContent.trim()).toBe('Success fake@email.com');
    });
  });

  describe('---NO---', () => {
    beforeEach(() => fixture.detectChanges());

    it(`shouldn't send an email`, () => {
      const element: DebugElement = fixture.debugElement;

      const inputs: DebugElement[] = element.queryAll(By.css('input'));
      expect(inputs.length).toBe(2);

      comp.formModel.controls['email'].setValue('fakewrongemail-com');
      comp.formModel.controls['subject'].setValue('Fake subject');
      comp.formModel.controls['message'].setValue('Message message message message message');

      expect(comp.formModel.valid).toBe(false);
    });
  });

  describe('---ERROR---', () => {
    beforeEach(() => fixture.detectChanges());

    it(`shouldn't send an email, because recaptcha isn't valid`, () => {
      const element: DebugElement = fixture.debugElement;

      const inputs: DebugElement[] = element.queryAll(By.css('input'));
      expect(inputs.length).toBe(2);

      comp.formModel.controls['email'].setValue('fake@email.com');
      comp.formModel.controls['subject'].setValue('Fake subject');
      comp.formModel.controls['message'].setValue('Message message message message message');

      expect(comp.formModel.valid).toBe(true);

      comp.handleCorrectCaptcha(null);

      comp.onSend();

      fixture.detectChanges();

      const messages: DebugElement[] = element.queryAll(By.css('div.alert.alert-danger'));
      expect(messages.length).toBe(1);
      expect(messages[0].nativeElement.textContent.trim()).toBe('Error missing-input-response');
    });
  });
});