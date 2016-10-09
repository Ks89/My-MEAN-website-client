import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By }              from '@angular/platform-browser';
import { DebugElement }    from '@angular/core';

import PageHeaderComponent from './page-header.component';

const divider: string = '   ';
const header: string = 'Header';
const strapline: string = 'and strapline';
const headerEmpty: string = '';
const straplineEmpty: string = '';

let comp:    PageHeaderComponent;
let fixture: ComponentFixture<PageHeaderComponent>;
let titleAndStrap: DebugElement;

describe('PageHeaderComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ PageHeaderComponent ]
    }); // not necessary with webpack .compileComponents();

    fixture = TestBed.createComponent(PageHeaderComponent);
    comp    = fixture.componentInstance;

    titleAndStrap  = fixture.debugElement.query(By.css('h1'));
  });

  it('should display header and strapline', () => {
    updateTitleAndStrapline(header, strapline);
    expect(titleAndStrap.nativeElement.textContent).toEqual(header + divider + strapline);
  });

  it('should display header and strapline both empty', () => {
    updateTitleAndStrapline(headerEmpty, straplineEmpty);
    expect(titleAndStrap.nativeElement.textContent).toEqual(headerEmpty + divider + straplineEmpty);
  });

  it('should display empty header and strapline', () => {
    updateTitleAndStrapline(headerEmpty, strapline);
    expect(titleAndStrap.nativeElement.textContent).toEqual(headerEmpty + divider + strapline);
  });

  it('should display header and empty strapline', () => {
    updateTitleAndStrapline(header, straplineEmpty);
    expect(titleAndStrap.nativeElement.textContent).toEqual(header + divider + straplineEmpty);
  });

  it('should display header and strapline both null', () => {
    updateTitleAndStrapline(null, null);
    expect(titleAndStrap.nativeElement.textContent).toEqual(divider);
  });

  it('should display header and strapline both undefined', () => {
    updateTitleAndStrapline(undefined, undefined);
    expect(titleAndStrap.nativeElement.textContent).toEqual(divider);
  });
});

function updateTitleAndStrapline(title, strapline) {
  comp.title = title;
  comp.strapline = strapline;
  fixture.detectChanges();
}
