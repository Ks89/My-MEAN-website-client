import * as _ from "lodash";
import { async, inject, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { HttpClient } from "@angular/common/http";

import { ContactService, URL_API_EMAIL } from './contact.service';

const MOCK_GENERIC_ERROREVENT: ErrorEvent = new ErrorEvent('Error');

const CONTACT_SENDFORM_WITH_CAPTCHA_RESPONSE: any = {
  "response": "fdhijfkandlfjahsfdk-fsdfsdfdgsd-gsdsdgsdg",
  "emailFormData": {
    "email": "fake.email@email.it",
    "messageText": "gsdgsdgsadgsdgsdg",
    "object": "fsdfsdafsd"
  }
};

const CONTACT_SENDFORM_WITHOUT_CAPTCHA_REQUEST: any = {
  "emailFormData": {
    "email": "fake.email@email.it",
    "messageText": "gsdgsdgsadgsdgsdg",
    "object": "fsdfsdafsd"
  }
};

const CAPTCHA_SUCCESS: any = { "message": CONTACT_SENDFORM_WITH_CAPTCHA_RESPONSE.emailFormData.email };
const CAPTCHA_ERROR: any = {"message":["missing-input-response"]};

describe('Http-ContactService (mockBackend)', () => {

  beforeEach( async(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [ ContactService ]
    });
  }));

  it('can instantiate service when inject service',
    inject([ContactService], (service: ContactService) => {
      expect(service instanceof ContactService).toBe(true);
  }));

  it('can instantiate service with "new"', inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {
    expect(http).not.toBeNull('http should be provided');
    let service = new ContactService(http);
    expect(service instanceof ContactService).toBe(true, 'new service should be ok');
  }));

  it('can provide the mockBackend as XHRBackend', inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {
    expect(httpMock).not.toBeNull('httpMock should be provided');
  }));

  describe('update()', () => {
    let service: ContactService;

    beforeEach(inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {
      service = new ContactService(http);
    }));

    it('should have expected the fake contact response', async(inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {
      // mockRespByStatusAndBody(backend, 200, CAPTCHA_SUCCESS);
      service.sendFormWithCaptcha(CONTACT_SENDFORM_WITH_CAPTCHA_RESPONSE)
        .subscribe(response => expect(response).toEqual(CAPTCHA_SUCCESS));
      mock(httpMock, URL_API_EMAIL, 'POST', CAPTCHA_SUCCESS);
    })));

    it('should catch 401 - recaptcha response not valid', async(inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {
      // mockRespByStatusAndBody(backend, 401, CAPTCHA_ERROR);
      service.sendFormWithCaptcha(CONTACT_SENDFORM_WITHOUT_CAPTCHA_REQUEST)
        .subscribe(response => expect(response).toEqual(CAPTCHA_ERROR));
      mock(httpMock, URL_API_EMAIL, 'POST', CAPTCHA_ERROR);
    })));

    it('should catch an Observable error', async(inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {
      service.sendFormWithCaptcha(CONTACT_SENDFORM_WITH_CAPTCHA_RESPONSE)
        .subscribe(
          projects => fail(`shouldn't call this, because I'm expecting an error.`),
          err => expect(err instanceof ErrorEvent).toBeTruthy());
      mockError(httpMock, URL_API_EMAIL, 'POST');
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