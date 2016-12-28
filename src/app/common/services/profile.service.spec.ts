import { async, inject, TestBed } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { HttpModule, Http, XHRBackend, Response, ResponseOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';

import { Response as ProfileResponse, ProfileService } from './profile.service';

const PROFILE_UPDATE_REQUEST: any = {
  "localUserEmail": "",
  "id": "105151560202467598897",
  "serviceName": "google",
  "name": "gybhunj",
  "surname": "vgbhjn",
  "nickname": "vghbjn",
  "email": "vghbjn"
};

const PROFILE_UPDATE_SUCCESS: ProfileResponse = {
  message: "Profile updated successfully!"
};

describe('Http-ProfileService (mockBackend)', () => {

  beforeEach( async(() => {
    TestBed.configureTestingModule({
      imports: [ HttpModule ],
      providers: [ ProfileService, { provide: XHRBackend, useClass: MockBackend }]
    });
  }));

  it('can instantiate service when inject service',
    inject([ProfileService], (service: ProfileService) => {
      expect(service instanceof ProfileService).toBe(true);
  }));

  it('can instantiate service with "new"', inject([Http], (http: Http) => {
    expect(http).not.toBeNull('http should be provided');
    let service = new ProfileService(http);
    expect(service instanceof ProfileService).toBe(true, 'new service should be ok');
  }));

  it('can provide the mockBackend as XHRBackend', inject([XHRBackend], (backend: MockBackend) => {
      expect(backend).not.toBeNull('backend should be provided');
  }));

  describe('#update()', () => {
    let backend: MockBackend;
    let service: ProfileService;

    beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
      backend = be;
      service = new ProfileService(http);
    }));

    it('should have expected the fake profile response', async(inject([], () => {
      mockRespByStatusAndBody(backend, 200, PROFILE_UPDATE_SUCCESS);
      service.update(PROFILE_UPDATE_REQUEST)
        .subscribe(response => expect(response).toEqual(PROFILE_UPDATE_SUCCESS, 'should be a success'));
    })));

    it('should treat 404 as an Observable error', async(inject([], () => {
      mockRespByStatusAndBody(backend, 404, undefined);
      service.update(PROFILE_UPDATE_REQUEST)
        .do(projects => fail('should not respond with a success'))
        .catch(err => {
          expect(err).toMatch(/Bad response status/, 'should catch bad response status code');
          return Observable.of(null); // failure is the expected test result
        });
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
  return resp;
}