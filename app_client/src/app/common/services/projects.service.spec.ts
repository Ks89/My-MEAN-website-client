import { async, inject, TestBed } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { HttpModule, Http, XHRBackend, Response, ResponseOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/toPromise';

import { Project, ProjectHomeView, ProjectService } from './projects.service';
import { PROJECTS } from '../testing/fake-project.service.spec';

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

  describe('when getProjects', () => {
    let backend: MockBackend;
    let service: ProjectService;
    let response: Response;

    beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
      backend = be;
      service = new ProjectService(http);
      let options = new ResponseOptions({status: 200, body: PROJECTS});
      response = new Response(options);
    }));

    it('should have expected fake projects (Observable.do)', async(inject([], () => {
      backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
      service.getProjects().do(projects => {
          expect(projects.length).toBe(PROJECTS.length, 'should have expected no. of projects');
          expect(projects).toEqual(PROJECTS, 'should have expected no. of projects');
      });
    })));

    it('should be OK returning no projects', async(inject([], () => {
      let resp = new Response(new ResponseOptions({status: 200, body: []}));
      backend.connections.subscribe((c: MockConnection) => c.mockRespond(resp));
      service.getProjects()
        .do(projects => expect(projects.length).toBe(0, 'should have no projects'));
    })));

    it('should treat 404 as an Observable error', async(inject([], () => {
      let resp = new Response(new ResponseOptions({status: 404}));
      backend.connections.subscribe((c: MockConnection) => c.mockRespond(resp));
      service.getProjects()
        .do(projects => fail('should not respond with projects'))
        .catch(err => {
          expect(err).toMatch(/Bad response status/, 'should catch bad response status code');
          return Observable.of(null); // failure is the expected test result
        });
    })));
  });
});
