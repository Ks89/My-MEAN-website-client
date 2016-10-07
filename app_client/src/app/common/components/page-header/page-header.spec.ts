import { async, inject, ComponentFixture, TestBed } from '@angular/core/testing';
import { By }              from '@angular/platform-browser';
import { DebugElement }    from '@angular/core';

import PageHeaderComponent from './page-header.component';

let comp:    PageHeaderComponent;
let fixture: ComponentFixture<PageHeaderComponent>;
let titleAndStrap: DebugElement;

//stand-alone test
describe('PageHeaderComponent', () => {

  // asynch beforeEach
  beforeEach( async(() => {
    TestBed.configureTestingModule({
      declarations: [ PageHeaderComponent ], // declare the test component
    })
    //not necessary with webpack
    //.compileComponents(); // compile template and css
  }));

  // synchronous beforeEach
  beforeEach(() => {
    fixture = TestBed.createComponent(PageHeaderComponent);
    comp    = fixture.componentInstance;
    titleAndStrap  = fixture.debugElement.query(By.css('h1'));

    comp.title = 'Header';
    comp.strapline = 'and strapline';
    fixture.detectChanges(); // trigger initial data binding
  });

  it('should display header and strapline', () => {
    const header = 'Header   and strapline';
    expect(titleAndStrap.nativeElement.textContent).toContain(header);
  });

});
