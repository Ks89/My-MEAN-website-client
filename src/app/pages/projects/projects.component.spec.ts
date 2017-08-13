import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

import { ProjectsComponent } from './projects.component';
import { SharedModule } from '../../shared/shared.module';
import { CoreModule } from '../../core/core.module';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { StoreModule } from '@ngrx/store';
import { reducers } from './reducers';
import { mainReducers } from '../../reducers/index';

let comp: ProjectsComponent;
let fixture: ComponentFixture<ProjectsComponent>;

describe('ProjectsComponent', () => {
  beforeEach(async(() => {

    TestBed.configureTestingModule({
      imports: [NgbModule.forRoot(), SharedModule, CoreModule,
        StoreModule.forRoot(mainReducers, {reducerFactory: undefined}), RouterTestingModule, StoreModule.forFeature('pageNum', reducers)],
      declarations: [ProjectsComponent]
    }); // not necessary with webpack .compileComponents();

    fixture = TestBed.createComponent(ProjectsComponent);
    comp = fixture.componentInstance;

    fixture.detectChanges();
    return fixture.whenStable().then(() => fixture.detectChanges());
  }));

  it('can instantiate it', () => expect(comp).not.toBeNull());
});
