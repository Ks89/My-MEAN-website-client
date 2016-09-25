import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By }              from '@angular/platform-browser';
import { DebugElement }    from '@angular/core';

import CvComponent from './cv.component';

let comp:    CvComponent;
let fixture: ComponentFixture<CvComponent>;
let el, el2:      DebugElement;

describe('CvComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ CvComponent ], // declare the test component
    });

    fixture = TestBed.createComponent(CvComponent);

    comp = fixture.componentInstance; // CvComponent test instance
  });

  it('should display a page with Not implemented yet as text', () => {

    // trigger data binding to update the view
    fixture.detectChanges();

    // find the title element in the DOM using a CSS selector
    // el = fixture.debugElement.query(By.css('h1'));
    el2 = fixture.debugElement.query(By.css('small'));

    // confirm the element's content
    // expect(el.nativeElement.textContent).toContain(comp.pageHeader.title);
    expect(el2.nativeElement.textContent).toContain('Not implemented yet');
  });
});
