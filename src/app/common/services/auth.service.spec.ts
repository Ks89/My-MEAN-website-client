import { async, inject, TestBed } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { HttpModule, Http, XHRBackend, Response, ResponseOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';

import { AuthService } from './auth.service';

const TOKEN = 'valid.jwt.token';

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

    const REGISTER_RESP_ALREADY_EXISTS: any = {"message": "User already exists. Try to login."};
    const REGISTER_RESP_ALL_REQUIRED: any = {"message":"All fields required"};
    const REGISTER_RESP_OK: any = {"message":"User with email valid@email.com registered."};

    beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
      backend = be;
      service = new AuthService(http);
    }));

    it('should be NOT OK', async(inject([], () => {
      let resp = new Response(new ResponseOptions({status: 400, body: REGISTER_RESP_ALREADY_EXISTS}));
      service.register(getRegisterReq("fake", "alreadyused@email.com", "fake"))
        .subscribe(resp => expect(resp).toEqual(REGISTER_RESP_ALREADY_EXISTS));
    })));

    it('should be NOT OK', async(inject([], () => {
      let resp = new Response(new ResponseOptions({status: 400, body: REGISTER_RESP_ALL_REQUIRED}));
      service.register(getRegisterReq("fake", null, null))
        .subscribe(resp => expect(resp).toEqual(REGISTER_RESP_ALL_REQUIRED));
    })));

    it('should be OK', async(inject([], () => {
      let resp = new Response(new ResponseOptions({status: 200, body: REGISTER_RESP_OK}));
      service.register(getRegisterReq("fake", "valid@email.com", "fake"))
        .subscribe(resp => expect(resp).toEqual(REGISTER_RESP_OK));
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

    const LOGIN_RESP_INCORRECT: any = {"message":"Incorrect username or password. Or this account is not activated, check your mailbox."};
    const LOGIN_RESP_ALL_REQUIRED: any = {"message":"All fields required"};
    const LOGIN_RESP_OK: any = {"token":"JWT.TOKEN"};

    beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
      backend = be;
      service = new AuthService(http);
    }));

    it('should be NOT OK', async(inject([], () => {
      let resp = new Response(new ResponseOptions({status: 401, body: LOGIN_RESP_INCORRECT}));
      service.login(getLoginReq("notValidOrNotActivated@email.com", "fake"))
        .subscribe(resp => expect(resp).toEqual(LOGIN_RESP_INCORRECT));
    })));

    it('should be NOT OK', async(inject([], () => {
      let resp = new Response(new ResponseOptions({status: 400, body: LOGIN_RESP_ALL_REQUIRED}));
      service.login(getLoginReq("valid@email.com", null))
        .subscribe(resp => expect(resp).toEqual(LOGIN_RESP_ALL_REQUIRED));
    })));

    it('should be OK', async(inject([], () => {
      let resp = new Response(new ResponseOptions({status: 200, body: LOGIN_RESP_OK}));
      service.login(getLoginReq("valid@email.com", "fake"))
        .subscribe(resp => expect(resp).toEqual(LOGIN_RESP_OK));
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

    const FORGOT_RESP_ALL_REQUIRED: any = {"message":"Email fields is required."};
    const FORGOT_RESP_OK: any = {"message":"An e-mail has been sent to valid@email.com with further instructions."};

    beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
      backend = be;
      service = new AuthService(http);
    }));

    it('should be NOT OK', async(inject([], () => {
      let resp = new Response(new ResponseOptions({status: 400, body: FORGOT_RESP_ALL_REQUIRED}));
      service.forgot({ "email": null })
        .subscribe(resp => expect(resp).toEqual(FORGOT_RESP_ALL_REQUIRED));
    })));

    it('should be OK', async(inject([], () => {
      let resp = new Response(new ResponseOptions({status: 200, body: FORGOT_RESP_OK}));
      service.forgot({ "email": "valid@email.com" })
        .subscribe(resp => expect(resp).toEqual(FORGOT_RESP_OK));
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

    const ACTIVATE_RESP_NOT_EXISTS: any = {"message":"No account with that token exists."};
    const ACTIVATE_RESP_OK: any = {"message":"An e-mail has been sent to fakeValid@email.com with further instructions."};

    beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
      backend = be;
      service = new AuthService(http);
    }));

    it('should be NOT OK', async(inject([], () => {
      let resp = new Response(new ResponseOptions({status: 400, body: ACTIVATE_RESP_NOT_EXISTS}));
      service.activate('wrongToken', 'fakeuser')
        .subscribe(resp => expect(resp).toEqual(ACTIVATE_RESP_NOT_EXISTS));
    })));

    it('should be OK', async(inject([], () => {
      let resp = new Response(new ResponseOptions({status: 200, body: ACTIVATE_RESP_OK}));
      service.activate('fakeToken', 'fakeuser')
        .subscribe(resp => expect(resp).toEqual(ACTIVATE_RESP_OK));
    })));

    it('should treat 404 as an Observable error', async(inject([], () => {
      let resp = getMockedResponse(backend, 404, undefined);
      testFor404(service.activate(null,null));
    })));
  });

  describe('#reset()', () => {
    let backend: MockBackend;
    let service: AuthService;

    const RESET_RESP_ALL_REQUIRED: any = {"message":"No account with that token exists."};
    const RESET_RESP_OK: any = {"message":"An e-mail has been sent to valid@email.com with further instructions."};

    beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
      backend = be;
      service = new AuthService(http);
    }));

    it('should be NOT OK', async(inject([], () => {
      let resp = new Response(new ResponseOptions({status: 400, body: RESET_RESP_ALL_REQUIRED}));
      service.reset("valid@email.com", "newPassword")
        .subscribe(resp => expect(resp).toEqual(RESET_RESP_ALL_REQUIRED));
    })));

    it('should be OK', async(inject([], () => {
      let resp = new Response(new ResponseOptions({status: 200, body: RESET_RESP_OK}));
      service.reset("valid@email.com", "newPassword")
        .subscribe(resp => expect(resp).toEqual(RESET_RESP_OK));
    })));

    it('should treat 404 as an Observable error', async(inject([], () => {
      let resp = getMockedResponse(backend, 404, undefined);
      testFor404(service.reset(null, null));
    })));
  });

  describe('#unlink()', () => {
    let backend: MockBackend;
    let service: AuthService;

    const UNLINK_RESP_OK: any = "User unlinked correctly!";

    beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
      backend = be;
      service = new AuthService(http);
    }));

    it('should be OK', async(inject([], () => {
      let resp = new Response(new ResponseOptions({status: 200, body: UNLINK_RESP_OK}));
      service.unlink('github') // a valid serviceName
        .subscribe(resp => expect(resp).toEqual(UNLINK_RESP_OK));
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

    const LOGOUT_RESP_OK: any = {"message":"Logout succeeded"};

    beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
      backend = be;
      service = new AuthService(http);
    }));

    it('should be OK', async(inject([], () => {
      let resp = new Response(new ResponseOptions({status: 200, body: LOGOUT_RESP_OK}));
      service.logout()
        .subscribe(resp => expect(resp).toEqual(LOGOUT_RESP_OK));
    })));

    it('should treat 404 as an Observable error', async(inject([], () => {
      let resp = getMockedResponse(backend, 404, undefined);
      testFor404(service.logout());
    })));
  });

  describe('#getTokenRedis()', () => {
    let backend: MockBackend;
    let service: AuthService;

    const GET_TOKEN_REDIS_RESP_OK: string = "valid.jwt.token";

    beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
      backend = be;
      service = new AuthService(http);
    }));

    it('should be OK', async(inject([], () => {
      let resp = new Response(new ResponseOptions({status: 200, body: GET_TOKEN_REDIS_RESP_OK}));
      service.getTokenRedis()
        .subscribe(resp => expect(resp).toEqual(GET_TOKEN_REDIS_RESP_OK));
    })));

    it('should treat 404 as an Observable error', async(inject([], () => {
      let resp = getMockedResponse(backend, 404, undefined);
      testFor404(service.getTokenRedis());
    })));
  });

  describe('#saveToken(), #getToken(), #removeToken()', () => {
    let backend: MockBackend;
    let service: AuthService;

    const key: string = "auth";
    const token: any = "valid.jwt.token";

    beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
      backend = be;
      service = new AuthService(http);
      service.removeToken(key);
    }));

    it(`should save and return the same token from session storage`, async(inject([], () => {
      service.saveToken(key, token);
      expect(service.getToken(key)).toBe(token);
    })));

    it(`should overwrite the existing token into session storage with a new one`, async(inject([], () => {
      service.saveToken(key, token + 'new');
      expect(service.getToken(key)).toBe(token + 'new');
    })));

    it(`should remove token from session storage`, async(inject([], () => {
      service.saveToken(key, token);
      service.removeToken(key);
      expect(service.getToken(key)).toBeNull();
    })));

    it(`shouldn't get token, because not inside the session storage`, async(inject([], () => {
      expect(service.getToken(key)).toBeNull();
    })));

    it(`shouldn't remove token using a wrong key`, async(inject([], () => {
      service.saveToken(key, token);
      service.removeToken(key + 'wrong');
      expect(service.getToken(key)).toBe(token);
    })));
  });

  //TODO decodeJwtToken, post3dAuthAfterCallback, getLoggedUser, getUserFromSessionStorage tests

  const jwtMock = {
    "_id": "57686655022691a4306b76b9",
    "user": {
      "_id": "57686655022691a4306b76b9",
      "__v": 0,
      "local": {
        "hash": "$2a$10$hHCcxNQmzzNCecReX1Rbeu5PJCosbjITXA1x./feykYcI2JW3npTW",
        "email": 'fake@email.it',
        "name": 'fake username'
      }
    },
    "exp": 1466721597694,
    "iat": 1466720997
  };

  describe('#decodeJwtToken()', () => {
    let backend: MockBackend;
    let service: AuthService;

    const TOKEN_NOT_FOUND: any = {"message": "No token found"};
    const TOKEN_NOT_VALID: any = {"message":"Jwt not valid or corrupted"};
    const TOKEN_EXPIRED: any = {"message":"Token Session expired (date)."};
    const TOKEN_IMPOSSIBLE_TO_DECODE: any = {"message":"Impossible to decode token."};
    const TOKEN_NOT_CHECKABLE: any = {"message":"Impossible to check if jwt is valid"};

    beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
      backend = be;
      service = new AuthService(http);
    }));

    it('should be OK', async(inject([], () => {
      let resp = new Response(new ResponseOptions({status: 200, body: jwtMock}));
      service.decodeJwtToken(TOKEN)
        .subscribe(resp => expect(resp).toEqual(jwtMock));
    })));

    it('should NOT OK', async(inject([], () => {
      let resp = new Response(new ResponseOptions({status: 401, body: TOKEN_NOT_VALID}));
      service.decodeJwtToken(TOKEN)
        .subscribe(resp => expect(resp).toEqual(TOKEN_NOT_VALID));
    })));

    it('should NOT OK', async(inject([], () => {
      let resp = new Response(new ResponseOptions({status: 401, body: TOKEN_EXPIRED}));
      service.decodeJwtToken(TOKEN)
        .subscribe(resp => expect(resp).toEqual(TOKEN_EXPIRED));
    })));

    it('should NOT OK', async(inject([], () => {
      let resp = new Response(new ResponseOptions({status: 401, body: TOKEN_IMPOSSIBLE_TO_DECODE}));
      service.decodeJwtToken(TOKEN)
        .subscribe(resp => expect(resp).toEqual(TOKEN_IMPOSSIBLE_TO_DECODE));
    })));

    it('should NOT OK', async(inject([], () => {
      let resp = new Response(new ResponseOptions({status: 500, body: TOKEN_NOT_CHECKABLE}));
      service.decodeJwtToken(TOKEN)
        .subscribe(resp => expect(resp).toEqual(TOKEN_NOT_CHECKABLE));
    })));

    it('should treat 404 as an Observable error', async(inject([], () => {
      let resp = getMockedResponse(backend, 404, undefined);
      testFor404(service.decodeJwtToken(TOKEN));
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
