import { async, inject, TestBed } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { HttpModule, Http, XHRBackend, Response, ResponseOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';

import { Response as ProfileResponse, ProfileService } from './profile.service';

const profileUpdateRequest: any = {
  "localUserEmail": "",
  "id": "105151560202467598897",
  "serviceName": "google",
  "name": "gybhunj",
  "surname": "vgbhjn",
  "nickname": "vghbjn",
  "email": "vghbjn"
};

const profileUpdateSuccess: ProfileResponse = {
  message: "Profile updated successfully!"
};

// TODO work in progress
const profileUpdateError: ProfileResponse = {
  message: "???????????????????????"
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

  describe('#when update()', () => {
    let backend: MockBackend;
    let service: ProfileService;
    let response: Response;

    beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
      backend = be;
      service = new ProfileService(http);
      let options = new ResponseOptions({status: 200, body: profileUpdateSuccess});
      response = new Response(options);
    }));

    it('should have expected the fake profile response', async(inject([], () => {
      backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
      service.update(profileUpdateRequest).do(response => expect(response).toBe(profileUpdateSuccess, 'should be a success'));
    })));

    it('should treat 404 as an Observable error', async(inject([], () => {
      let resp = new Response(new ResponseOptions({status: 404}));
      backend.connections.subscribe((c: MockConnection) => c.mockRespond(resp));
      service.update(profileUpdateRequest)
        .do(projects => fail('should not respond with a success'))
        .catch(err => {
          expect(err).toMatch(/Bad response status/, 'should catch bad response status code');
          return Observable.of(null); // failure is the expected test result
        });
    })));
  });
});
