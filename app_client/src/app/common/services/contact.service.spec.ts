import { async, inject, TestBed } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { HttpModule, Http, XHRBackend, Response, ResponseOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';

import { ContactService } from './contact.service';

const contactSendFormWithCaptchaRequest: any = {
  "response": "fdhijfkandlfjahsfdk-fsdfsdfdgsd-gsdsdgsdg",
  "emailFormData": {
    "email": "fake.email@email.it",
    "messageText": "gsdgsdgsadgsdgsdg",
    "object": "fsdfsdafsd"
  }
};

const contactSendFormWithCaptchaSuccess: any = contactSendFormWithCaptchaRequest.emailFormData.email;

// TODO work in progress
const contactSendFormWithCaptchaError: any = contactSendFormWithCaptchaRequest.emailFormData.email;

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

  describe('#when update()', () => {
    let backend: MockBackend;
    let service: ContactService;
    let response: Response;

    beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
      backend = be;
      service = new ContactService(http);
      let options = new ResponseOptions({status: 200, body: contactSendFormWithCaptchaSuccess});
      response = new Response(options);
    }));

    it('should have expected the fake contact response', async(inject([], () => {
      backend.connections.subscribe((c: MockConnection) => c.mockRespond(response));
      service.sendFormWithCaptcha(contactSendFormWithCaptchaRequest)
        .do(response => expect(response).toEqual(contactSendFormWithCaptchaSuccess, 'should be a success'));
    })));

    it('should treat 404 as an Observable error', async(inject([], () => {
      let resp = new Response(new ResponseOptions({status: 404}));
      backend.connections.subscribe((c: MockConnection) => c.mockRespond(resp));
      service.sendFormWithCaptcha(contactSendFormWithCaptchaRequest)
        .do(projects => fail('should not respond with a success'))
        .catch(err => {
          expect(err).toMatch(/Bad response status/, 'should catch bad response status code');
          return Observable.of(null); // failure is the expected test result
        });
    })));
  });
});
