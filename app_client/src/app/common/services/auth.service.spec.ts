import { async, inject, TestBed } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { HttpModule, Http, XHRBackend, Response, ResponseOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';

import { AuthService } from './auth.service';

describe('Http-AuthService (mockBackend)', () => {

  beforeEach( async(() => {
    TestBed.configureTestingModule({
      imports: [ HttpModule ],
      providers: [ AuthService, { provide: XHRBackend, useClass: MockBackend }]
    });
  }));

  it('can instantiate service when inject service',
    inject([AuthService], (service: AuthService) => {
      expect(service instanceof AuthService).toBe(true);
  }));

  it('can instantiate service with "new"', inject([Http], (http: Http) => {
    expect(http).not.toBeNull('http should be provided');
    let service = new AuthService(http);
    expect(service instanceof AuthService).toBe(true, 'new service should be ok');
  }));

  it('can provide the mockBackend as XHRBackend', inject([XHRBackend], (backend: MockBackend) => {
      expect(backend).not.toBeNull('backend should be provided');
  }));

  describe('#login()', () => {
    let backend: MockBackend;
    let service: AuthService;

    beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
      backend = be;
      service = new AuthService(http);
    }));

    it('should be NOT OK', async(inject([], () => {
      let resp = getMockedResponse(backend, 400, []);
      service.register({
          "name": "dsgyhuij",
          "email": "alreadyused@email.com",
          "password": "Qw12345678"
        })
        .do(resp => expect(resp).toBe({"message":"User already exists. Try to login."}));
    })));

    it('should be NOT OK', async(inject([], () => {
      let resp = getMockedResponse(backend, 400, []);
      service.register({
          "name": "dsgyhuij",
          "email": null,
          "password": null
        })
        .do(resp => expect(resp).toBe({"message":"All fields required"}));
    })));

    it('should be OK', async(inject([], () => {
      let resp = getMockedResponse(backend, 200, []);
      service.register({
          "name": "dsgyhuij",
          "email": "valid@email.com",
          "password": "Qw12345678"
        })
        .do(resp => expect(resp).toBe({"message":"User with email valid@email.com registered."}));
    })));

    it('should treat 404 as an Observable error', async(inject([], () => {
      let resp = getMockedResponse(backend, 404, undefined);
      testFor404(service.register(null));
    })));
  });


  describe('#when login()', () => {
    let backend: MockBackend;
    let service: AuthService;

    beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
      backend = be;
      service = new AuthService(http);
    }));

    it('should be NOT OK', async(inject([], () => {
      let resp = getMockedResponse(backend, 401, []);
      service.login({
          "email": "notValidOrNotActivated@email.com",
          "password": "Qw12345678"
        })
        .do(resp => expect(resp).toBe({"message":"Incorrect username or password. Or this account is not activated, check your mailbox."}));
    })));

    it('should be NOT OK', async(inject([], () => {
      let resp = getMockedResponse(backend, 400, []);
      service.login({
          "email": "valid@email.com",
          "password": null
        })
        .do(resp => expect(resp).toBe({"message":"All fields required"}));
    })));

    it('should be OK', async(inject([], () => {
      let resp = getMockedResponse(backend, 200, []);
      service.login({
          "email": "valid@email.com",
          "password": "Qw12345678"
        })
        .do(resp => expect(resp).toBe({"token":"JWT.TOKEN"}));
    })));

    it('should treat 404 as an Observable error', async(inject([], () => {
      let resp = getMockedResponse(backend, 404, undefined);
      testFor404(service.login(null));
    })));
  });

});

function getMockedResponse(backend: MockBackend, status: number, body: any) {
  let data;
  if(body != undefined) {
    data = {status: status, body: body};
  } else {
    data = {status: status};
  }
  let resp = new Response(new ResponseOptions(data));
  backend.connections.subscribe((c: MockConnection) => c.mockRespond(resp));
  return resp;
}

function testFor404(serviceObservableCall: any) {
  serviceObservableCall
    .do(resp => fail('should not respond'))
    .catch(err => {
      expect(err).toMatch(/Bad response status/, 'should catch bad response status code');
      return Observable.of(null); // failure is the expected test result
    });
}
