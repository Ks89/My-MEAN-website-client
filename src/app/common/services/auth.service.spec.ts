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
      expect(service instanceof AuthService).toEqual(true);
  }));

  it('can instantiate service with "new"', inject([Http], (http: Http) => {
    expect(http).not.toBeNull('http should be provided');
    let service = new AuthService(http);
    expect(service instanceof AuthService).toEqual(true, 'new service should be ok');
  }));

  it('can provide the mockBackend as XHRBackend', inject([XHRBackend], (backend: MockBackend) => {
      expect(backend).not.toBeNull('backend should be provided');
  }));

  describe('#register()', () => {
    let backend: MockBackend;
    let service: AuthService;

    const registerRespAlreadyExists: any = {"message": "User already exists. Try to login."};
    const registerRespAllRequired: any = {"message":"All fields required"};
    const registerRespOk: any = {"message":"User with email valid@email.com registered."};

    beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
      backend = be;
      service = new AuthService(http);
    }));

    it('should be NOT OK', async(inject([], () => {
      let resp = new Response(new ResponseOptions({status: 400, body: registerRespAlreadyExists}));
      service.register(getRegisterReq("fake", "alreadyused@email.com", "fake"))
        .subscribe(resp => expect(resp).toEqual(registerRespAlreadyExists));
    })));

    it('should be NOT OK', async(inject([], () => {
      let resp = new Response(new ResponseOptions({status: 400, body: registerRespAllRequired}));
      service.register(getRegisterReq("fake", null, null))
        .subscribe(resp => expect(resp).toEqual(registerRespAllRequired));
    })));

    it('should be OK', async(inject([], () => {
      let resp = new Response(new ResponseOptions({status: 200, body: registerRespOk}));
      service.register(getRegisterReq("fake", "valid@email.com", "fake"))
        .subscribe(resp => expect(resp).toEqual(registerRespOk));
    })));

    it('should treat 404 as an Observable error', async(inject([], () => {
      let resp = getMockedResponse(backend, 404, undefined);
      testFor404(service.register(null));
    })));

    function getRegisterReq(name: string | void, email: string | void, password: string | void) {
      return { "name": name, "email": email, "password": password };
    }
  });

  describe('#login()', () => {
    let backend: MockBackend;
    let service: AuthService;

    const loginRespIncorrect: any = {"message":"Incorrect username or password. Or this account is not activated, check your mailbox."};
    const loginRespAllRequired: any = {"message":"All fields required"};
    const loginRespOk: any = {"token":"JWT.TOKEN"};

    beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
      backend = be;
      service = new AuthService(http);
    }));

    it('should be NOT OK', async(inject([], () => {
      let resp = new Response(new ResponseOptions({status: 401, body: loginRespIncorrect}));
      service.login(getLoginReq("notValidOrNotActivated@email.com", "fake"))
        .subscribe(resp => expect(resp).toEqual(loginRespIncorrect));
    })));

    it('should be NOT OK', async(inject([], () => {
      let resp = new Response(new ResponseOptions({status: 400, body: loginRespAllRequired}));
      service.login(getLoginReq("valid@email.com", null))
        .subscribe(resp => expect(resp).toEqual(loginRespAllRequired));
    })));

    it('should be OK', async(inject([], () => {
      let resp = new Response(new ResponseOptions({status: 200, body: loginRespOk}));
      service.login(getLoginReq("valid@email.com", "fake"))
        .subscribe(resp => expect(resp).toEqual(loginRespOk));
    })));

    it('should treat 404 as an Observable error', async(inject([], () => {
      let resp = getMockedResponse(backend, 404, undefined);
      testFor404(service.login(null));
    })));

    function getLoginReq(email: string | void, password: string | void) {
      return { "email": email, "password": password };
    }
  });

  describe('#forgot()', () => {
    let backend: MockBackend;
    let service: AuthService;

    const forgotRespAllRequired: any = {"message":"Email fields is required."};
    const forgotRespOk: any = {"message":"An e-mail has been sent to valid@email.com with further instructions."};

    beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
      backend = be;
      service = new AuthService(http);
    }));

    it('should be NOT OK', async(inject([], () => {
      let resp = new Response(new ResponseOptions({status: 400, body: forgotRespAllRequired}));
      service.forgot({ "email": null })
        .subscribe(resp => expect(resp).toEqual(forgotRespAllRequired));
    })));

    it('should be OK', async(inject([], () => {
      let resp = new Response(new ResponseOptions({status: 200, body: forgotRespOk}));
      service.forgot({ "email": "valid@email.com" })
        .subscribe(resp => expect(resp).toEqual(forgotRespOk));
    })));

    it('should treat 404 as an Observable error', async(inject([], () => {
      let resp = getMockedResponse(backend, 404, undefined);
      testFor404(service.forgot(null));
    })));

    function getLoginReq(email: string | void, password: string | void) {
      return { "email": email, "password": password };
    }
  });

  describe('#activate()', () => {
    let backend: MockBackend;
    let service: AuthService;

    const activateRespNotExists: any = {"message":"No account with that token exists."};
    const activateRespOk: any = {"message":"An e-mail has been sent to fakeValid@email.com with further instructions."};

    beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
      backend = be;
      service = new AuthService(http);
    }));

    it('should be NOT OK', async(inject([], () => {
      let resp = new Response(new ResponseOptions({status: 400, body: activateRespNotExists}));
      service.activate('wrongToken', 'fakeuser')
        .subscribe(resp => expect(resp).toEqual(activateRespNotExists));
    })));

    it('should be OK', async(inject([], () => {
      let resp = new Response(new ResponseOptions({status: 200, body: activateRespOk}));
      service.activate('fakeToken', 'fakeuser')
        .subscribe(resp => expect(resp).toEqual(activateRespOk));
    })));

    it('should treat 404 as an Observable error', async(inject([], () => {
      let resp = getMockedResponse(backend, 404, undefined);
      testFor404(service.activate(null,null));
    })));
  });

  describe('#reset()', () => {
    let backend: MockBackend;
    let service: AuthService;

    const resetRespAllRequired: any = {"message":"No account with that token exists."};
    const resetRespOk: any = {"message":"An e-mail has been sent to valid@email.com with further instructions."};

    beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
      backend = be;
      service = new AuthService(http);
    }));

    it('should be NOT OK', async(inject([], () => {
      let resp = new Response(new ResponseOptions({status: 400, body: resetRespAllRequired}));
      service.reset("valid@email.com", "newPassword")
        .subscribe(resp => expect(resp).toEqual(resetRespAllRequired));
    })));

    it('should be OK', async(inject([], () => {
      let resp = new Response(new ResponseOptions({status: 200, body: resetRespOk}));
      service.reset("valid@email.com", "newPassword")
        .subscribe(resp => expect(resp).toEqual(resetRespOk));
    })));

    it('should treat 404 as an Observable error', async(inject([], () => {
      let resp = getMockedResponse(backend, 404, undefined);
      testFor404(service.reset(null, null));
    })));
  });

  describe('#unlink()', () => {
    let backend: MockBackend;
    let service: AuthService;

    const unlinkRespOk: any = "User unlinked correctly!";

    beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
      backend = be;
      service = new AuthService(http);
    }));

    it('should be OK', async(inject([], () => {
      let resp = new Response(new ResponseOptions({status: 200, body: unlinkRespOk}));
      service.unlink('github') // a valid serviceName
        .subscribe(resp => expect(resp).toEqual(unlinkRespOk));
    })));

    it('should treat 404 as an Observable error', async(inject([], () => {
      let resp = getMockedResponse(backend, 404, undefined);
      testFor404(service.unlink(null));
    })));
  });

  describe('#getUserById()', () => {
    let backend: MockBackend;
    let service: AuthService;

    const getUserByIdRespOk: any = {
      "_id":"validId",
      "__v":0,
      "profile":{
        "name":"gybhunj",
        "surname":"vgbhjn",
        "nickname":"vghbjn",
        "email":"vghbjn",
        "updated":"2016-09-05T19:23:48.008Z",
        "visible":true,
        "_id":"profileId"
      },
      "google":{
        "email":"valid.google@email.com",
        "id":"googleId",
        "name":"Fake name",
        "token":"fakeToken"
      }
    };

    beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
      backend = be;
      service = new AuthService(http);
    }));

    it('should be OK', async(inject([], () => {
      let resp = new Response(new ResponseOptions({status: 200, body: getUserByIdRespOk}));
      service.getUserById('validId')
        .subscribe(resp => expect(resp).toEqual(getUserByIdRespOk));
    })));

    it('should treat 404 as an Observable error', async(inject([], () => {
      let resp = getMockedResponse(backend, 404, undefined);
      testFor404(service.getUserById(null));
    })));
  });

  describe('#logout()', () => {
    let backend: MockBackend;
    let service: AuthService;

    const logoutRespOk: any = {"message":"Logout succeeded"};

    beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
      backend = be;
      service = new AuthService(http);
    }));

    it('should be OK', async(inject([], () => {
      let resp = new Response(new ResponseOptions({status: 200, body: logoutRespOk}));
      service.logout()
        .subscribe(resp => expect(resp).toEqual(logoutRespOk));
    })));

    it('should treat 404 as an Observable error', async(inject([], () => {
      let resp = getMockedResponse(backend, 404, undefined);
      testFor404(service.logout());
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
