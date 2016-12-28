import { async, inject, TestBed } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { HttpModule, Http, XHRBackend, Response, ResponseOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';

import { ContactService } from './contact.service';

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
      imports: [ HttpModule ],
      providers: [ ContactService, { provide: XHRBackend, useClass: MockBackend }]
    });
  }));

  it('can instantiate service when inject service',
    inject([ContactService], (service: ContactService) => {
      expect(service instanceof ContactService).toBe(true);
  }));

  it('can instantiate service with "new"', inject([Http], (http: Http) => {
    expect(http).not.toBeNull('http should be provided');
    let service = new ContactService(http);
    expect(service instanceof ContactService).toBe(true, 'new service should be ok');
  }));

  it('can provide the mockBackend as XHRBackend', inject([XHRBackend], (backend: MockBackend) => {
      expect(backend).not.toBeNull('backend should be provided');
  }));

  describe('update()', () => {
    let backend: MockBackend;
    let service: ContactService;

    beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
      backend = be;
      service = new ContactService(http);
    }));

    it('should have expected the fake contact response', async(inject([], () => {
      mockRespByStatusAndBody(backend, 200, CAPTCHA_SUCCESS);
      service.sendFormWithCaptcha(CONTACT_SENDFORM_WITH_CAPTCHA_RESPONSE)
        .subscribe(response => expect(response).toEqual(CAPTCHA_SUCCESS));
    })));

    it('should catch 401 - recaptcha response not valid', async(inject([], () => {
      mockRespByStatusAndBody(backend, 401, CAPTCHA_ERROR);
      service.sendFormWithCaptcha(CONTACT_SENDFORM_WITHOUT_CAPTCHA_REQUEST)
        .subscribe(response => expect(response).toEqual(CAPTCHA_ERROR));
    })));

    it('should treat 404 as an Observable error', async(inject([], () => {
      mockRespByStatusAndBody(backend, 404);
      service.sendFormWithCaptcha(CONTACT_SENDFORM_WITH_CAPTCHA_RESPONSE)
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
