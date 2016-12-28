import * as _ from "lodash";
import { async, inject, TestBed } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';
import {HttpModule, Http, XHRBackend, Response, ResponseOptions, ResponseType} from '@angular/http';
import { ProjectService } from './projects.service';
import { PROJECTS, HOMEVIEWS } from '../testing/fake-project.service.spec';

describe('Http-ProjectService (mockBackend)', () => {

  beforeEach( async(() => {
    TestBed.configureTestingModule({
      imports: [ HttpModule ],
      providers: [ ProjectService, { provide: XHRBackend, useClass: MockBackend }]
    });
  }));

  it('can instantiate service when inject service',
    inject([ProjectService], (service: ProjectService) => {
      expect(service instanceof ProjectService).toBe(true);
  }));

  it('can instantiate service with "new"', inject([Http], (http: Http) => {
    expect(http).not.toBeNull('http should be provided');
    let service = new ProjectService(http);
    expect(service instanceof ProjectService).toBe(true, 'new service should be ok');
  }));

  it('can provide the mockBackend as XHRBackend', inject([XHRBackend], (backend: MockBackend) => {
      expect(backend).not.toBeNull('backend should be provided');
  }));

  describe('#getProjects()', () => {
    let backend: MockBackend;
    let service: ProjectService;

    beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
      backend = be;
      service = new ProjectService(http);
    }));

    it('should have expected fake projects', async(inject([], () => {
      mockRespByStatusAndBody(backend, 200, PROJECTS);
      service.getProjects()
        .subscribe(projects => {
          expect(projects.length).toBe(PROJECTS.length, 'should have expected no. of projects');
          expect(projects).toEqual(PROJECTS, 'should have expected all mocked projects');
      });
    })));

    it('should be OK returning no projects', async(inject([], () => {
      mockRespByStatusAndBody(backend, 200, []);
      service.getProjects()
        .subscribe(projects => expect(projects.length).toBe(0, 'should have no projects'));
    })));

    it('should catch an Observable error', async(inject([], () => {
      mockError(backend);
      service.getProjects()
        .subscribe(
          projects => fail(`shouldn't call this, because I'm expecting an error.`),
          err => expect(_.isError(err)).toBeTruthy());
    })));
  });

  describe('#getProjectsForHomepage()', () => {
    let backend: MockBackend;
    let service: ProjectService;

    beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
      backend = be;
      service = new ProjectService(http);
    }));

    it('should have expected fake dashboard-projects', async(inject([], () => {
      mockRespByStatusAndBody(backend, 200, HOMEVIEWS);
      service.getProjectsForHomepage()
        .subscribe(projects => {
          expect(projects.length).toBe(HOMEVIEWS.length, 'should have expected no. of projects');
          expect(projects).toEqual(HOMEVIEWS, 'should have expected all dashboard projects');
      });
    })));

    it('should be OK returning no projects', async(inject([], () => {
      mockRespByStatusAndBody(backend, 200, []);
      service.getProjectsForHomepage()
        .subscribe(projects => expect(projects.length).toBe(0, 'should have no projects'));
    })));

    it('should catch an Observable error', async(inject([], () => {
      mockError(backend);
      service.getProjectsForHomepage()
        .subscribe(
          projects => fail(`shouldn't call this, because I'm expecting an error.`),
          err => expect(_.isError(err)).toBeTruthy());
    })));
  });

  describe('#getProjectsById()', () => {
    let backend: MockBackend;
    let service: ProjectService;

    beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
      backend = be;
      service = new ProjectService(http);
    }));

    for(let i=0; i<PROJECTS.length; i++) {
      it(`should have expected a single project that match the id=${PROJECTS[i]._id}. Test i=${i}`, async(inject([], () => {
        mockRespByStatusAndBody(backend, 200, PROJECTS[i]);
        service.getProjectsById(PROJECTS[i]._id)
          .subscribe(project => {
            expect(project).toEqual(PROJECTS[i], 'should have the single project by its id');
        });
      })));
    }

    it('should be OK returning no projects (because the requested project doesn\'t exists)', async(inject([], () => {
      mockRespByStatusAndBody(backend, 404, { "message": "Project not found" });
      service.getProjectsById('ey7dhef879wgfh8w9e')
        .subscribe(project => expect(project).toEqual({"message":"Project not found"}, 'should have no projects'));
    })));

    it('should catch an Observable error', async(inject([], () => {
      mockError(backend);
      service.getProjectsById(PROJECTS[1]._id)
        .subscribe(
          projects => fail(`shouldn't call this, because I'm expecting an error.`),
          err => expect(_.isError(err)).toBeTruthy());
    })));
  });
});

function mockRespByStatusAndBody(backend: MockBackend, status: number, body?: any) {
  let data;
  if(body !== undefined) {
    data = {status: status, body: body};
  } else {
    data = {status: status};
  }
  let resp = new Response(new ResponseOptions(data));
  backend.connections.subscribe((c: MockConnection) => c.mockRespond(resp));
}

function mockError(backend: MockBackend) {
  backend.connections.subscribe((c: MockConnection) => c.mockError(new Error()));
}
