import * as _ from "lodash";
import { async, inject, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { HttpClient } from "@angular/common/http";

import { Response as ProfileResponse, ProfileService, URL_API_PROFILE } from './profile.service';

const MOCK_GENERIC_ERROREVENT: ErrorEvent = new ErrorEvent('Error');

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
      imports: [ HttpClientTestingModule ],
      providers: [ ProfileService ]
    });
  }));

  it('can instantiate service when inject service',
    inject([ProfileService], (service: ProfileService) => {
      expect(service instanceof ProfileService).toBe(true);
  }));

  it('can instantiate service with "new"', inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {
    expect(http).not.toBeNull('http should be provided');
    let service = new ProfileService(http);
    expect(service instanceof ProfileService).toBe(true, 'new service should be ok');
  }));

  it('can provide the mockBackend as XHRBackend', inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {
    expect(httpMock).not.toBeNull('httpMock should be provided');
  }));

  describe('#update()', () => {
    let service: ProfileService;

    beforeEach(inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {
      service = new ProfileService(http);
    }));

    it('should have expected the fake profile response', async(inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {
      // mockRespByStatusAndBody(backend, 200, PROFILE_UPDATE_SUCCESS);
      service.update(PROFILE_UPDATE_REQUEST)
        .subscribe(response => expect(response).toEqual(PROFILE_UPDATE_SUCCESS, 'should be a success'));
      mock(httpMock, URL_API_PROFILE, 'POST', PROFILE_UPDATE_SUCCESS);
    })));

    it('should catch an Observable error', async(inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {
      service.update(PROFILE_UPDATE_REQUEST)
        .subscribe(
          projects => fail(`shouldn't call this, because I'm expecting an error.`),
          err => expect(err instanceof ErrorEvent).toBeTruthy());
      mockError(httpMock, URL_API_PROFILE, 'POST');
    })));
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