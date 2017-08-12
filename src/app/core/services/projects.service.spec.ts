import * as _ from "lodash";
import { async, inject, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { HttpClient } from "@angular/common/http";

import { ProjectService, URL_API_PROJECTHOME, URL_API_PROJECTS } from './projects.service';
import { PROJECTS, HOMEVIEWS } from '../../shared/testing/fake-project.service.spec';

const MOCK_GENERIC_ERROREVENT: ErrorEvent = new ErrorEvent('Error');

describe('Http-ProjectService (mockBackend)', () => {

  beforeEach( async(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [ ProjectService ]
    });
  }));

  it('can instantiate service when inject service',
    inject([ProjectService], (service: ProjectService) => {
      expect(service instanceof ProjectService).toBe(true);
  }));

  it('can instantiate service with "new"', inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {
    expect(http).not.toBeNull('http should be provided');
    let service = new ProjectService(http);
    expect(service instanceof ProjectService).toBe(true, 'new service should be ok');
  }));

  it('can provide the mockBackend as XHRBackend', inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {
    expect(httpMock).not.toBeNull('httpMock should be provided');
  }));

  describe('#getProjects()', () => {
    let service: ProjectService;

    beforeEach(inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {
      service = new ProjectService(http);
    }));

    it('should have expected fake projects', async(inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {
      // mockRespByStatusAndBody(backend, 200, PROJECTS);
      service.getProjects()
        .subscribe(projects => {
          expect(projects.length).toBe(PROJECTS.length, 'should have expected no. of projects');
          expect(projects).toEqual(PROJECTS, 'should have expected all mocked projects');
        });
      mock(httpMock, URL_API_PROJECTS, 'GET', PROJECTS);
    })));

    it('should be OK returning no projects', async(inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {
      // mockRespByStatusAndBody(backend, 200, []);
      service.getProjects()
        .subscribe(projects => expect(projects.length).toBe(0, 'should have no projects'));
      mock(httpMock, URL_API_PROJECTS, 'GET', []);
    })));

    it('should catch an Observable error', async(inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {
      // mockError(backend);
      service.getProjects()
        .subscribe(
          projects => fail(`shouldn't call this, because I'm expecting an error.`),
          err => expect(_.isError(err)).toBeTruthy());
      mockError(httpMock, URL_API_PROJECTS, 'GET');
    })));
  });

  describe('#getProjectsForHomepage()', () => {
    let service: ProjectService;

    beforeEach(inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {
      service = new ProjectService(http);
    }));

    it('should have expected fake dashboard-projects', async(inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {
      // mockRespByStatusAndBody(backend, 200, HOMEVIEWS);
      service.getProjectsForHomepage()
        .subscribe((projects: any) => {
          expect(projects.length).toBe(HOMEVIEWS.length, 'should have expected no. of projects');
          expect(projects).toEqual(HOMEVIEWS, 'should have expected all dashboard projects');
        });
      mock(httpMock, URL_API_PROJECTHOME, 'GET', HOMEVIEWS);
    })));

    it('should be OK returning no projects', async(inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {
      // mockRespByStatusAndBody(backend, 200, []);
      service.getProjectsForHomepage()
        .subscribe(projects => expect(projects.length).toBe(0, 'should have no projects'));
      mock(httpMock, URL_API_PROJECTHOME, 'GET', []);
    })));

    it('should catch an Observable error', async(inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {
      // mockError(backend);
      service.getProjectsForHomepage()
        .subscribe(
          projects => fail(`shouldn't call this, because I'm expecting an error.`),
          err => expect(_.isError(err)).toBeTruthy());
      mockError(httpMock, URL_API_PROJECTHOME, 'GET');
    })));
  });

  describe('#getProjectsById()', () => {
    let service: ProjectService;

    beforeEach(inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {
      service = new ProjectService(http);
    }));

    for(let i=0; i<PROJECTS.length; i++) {
      it(`should have expected a single project that match the id=${PROJECTS[i]._id}. Test i=${i}`, async(inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {
        // mockRespByStatusAndBody(backend, 200, PROJECTS[i]);
        service.getProjectsById(PROJECTS[i]._id)
          .subscribe(project => {
            expect(project).toEqual(PROJECTS[i], 'should have the single project by its id');
          });
        mock(httpMock, `${URL_API_PROJECTS}/${PROJECTS[i]._id}`, 'GET', PROJECTS[i]);
      })));
    }

    it('should be OK returning no projects (because the requested project doesn\'t exists)', async(inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {
      // mockRespByStatusAndBody(backend, 404, { "message": "Project not found" });
      service.getProjectsById('ey7dhef879wgfh8w9e')
        .subscribe((project: any) => expect(project).toEqual({"message":"Project not found"}, 'should have no projects'));
      mock(httpMock, `${URL_API_PROJECTS}/ey7dhef879wgfh8w9e`, 'GET', { "message": "Project not found" });
    })));

    // it('should catch an Observable error', async(inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {
    //   // mockError(backend);
    //   service.getProjectsById(PROJECTS[1]._id)
    //     .subscribe(
    //       projects => fail(`shouldn't call this, because I'm expecting an error.`),
    //       err => expect(_.isError(err)).toBeTruthy());
    //   mockError(httpMock, `${URL_API_PROJECTS}/blabla`, 'GET');
    // })));
  });
});

function mock(httpMock: HttpTestingController, url: string, type: string, response: any) {
  // At this point, the request is pending, and no response has been
  // sent. The next step is to expect that the request happened.
  const req: TestRequest = httpMock.expectOne(url);
  expect(req.request.method).toEqual(type);
  // Next, fulfill the request by transmitting a response.
  req.flush(response); // , { status: 400, statusText: 'Bad Request' });
}

function mockError(httpMock: HttpTestingController, url: string, type: string, errorEvent: ErrorEvent = MOCK_GENERIC_ERROREVENT) {
  // At this point, the request is pending, and no response has been
  // sent. The next step is to expect that the request happened.
  const req: TestRequest = httpMock.expectOne(url);
  expect(req.request.method).toEqual(type);
  // Next, fulfill the request by transmitting a response.
  req.error(errorEvent);
}