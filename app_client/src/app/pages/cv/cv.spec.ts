import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By }              from '@angular/platform-browser';
import { DebugElement }    from '@angular/core';

import CvComponent from './cv';

let comp:    CvComponent;
let fixture: ComponentFixture<CvComponent>;
let el:      DebugElement;

describe('CvComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ CvComponent ], // declare the test component
    });

    fixture = TestBed.createComponent(CvComponent);

    comp = fixture.componentInstance; // CvComponent test instance

    // get title DebugElement by element name
    el = fixture.debugElement.query(By.css('small'));
  });
});
