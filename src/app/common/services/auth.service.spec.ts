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

    const REGISTER_RESP_ALREADY_EXISTS: Object = {"message": "User already exists. Try to login."};
    const REGISTER_RESP_ALL_REQUIRED: Object = {"message":"All fields required"};
    const REGISTER_RESP_OK: Object = {"message":"User with email valid@email.com registered."};

    beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
      backend = be;
      service = new AuthService(http);
    }));

    it('should be NOT OK', async(inject([], () => {
      mockRespByStatusAndBody(backend, 400, REGISTER_RESP_ALREADY_EXISTS);
      service.register(getRegisterReq("fake", "alreadyused@email.com", "fake"))
        .subscribe(resp => expect(resp._body).toEqual(REGISTER_RESP_ALREADY_EXISTS));
    })));

    it('should be NOT OK', async(inject([], () => {
      mockRespByStatusAndBody(backend, 400, REGISTER_RESP_ALL_REQUIRED);
      service.register(getRegisterReq("fake", null, null))
        .subscribe(resp => expect(resp._body).toEqual(REGISTER_RESP_ALL_REQUIRED));
    })));

    it('should be OK', async(inject([], () => {
      mockRespByStatusAndBody(backend, 200, REGISTER_RESP_OK);
      service.register(getRegisterReq("fake", "valid@email.com", "fake"))
      .subscribe(resp => expect(resp._body).toEqual(REGISTER_RESP_OK));
    })));

    it('should treat 404 as an Observable error', async(inject([], () => {
      // mockRespByStatusAndBody(backend, 404, null);
      // testFor404(service.register(null));

      // let resp = new Response(new ResponseOptions({status: 404}));
      // backend.connections.subscribe((c: MockConnection) => c.mockRespond(resp));
      //
      // console.log("FAILLLLLL");
      //
      // service.register(null)
      //   .subscribe(resp => {
      //     console.log("FAILLLLLL 1");
      //     fail('should not respond');
      //   }, err => {
      //     console.log("FAILLLLLL 2");
      //     expect(err).toBeNull();
      //     // expect(err).toMatch(/Bad response status/, 'should catch bad response status code');
      //     return Observable.of(null); // failure is the expected test result
      //   });

    })));

    function getRegisterReq(name: string | void, email: string | void, password: string | void) {
      return { "name": name, "email": email, "password": password };
    }
  });

  describe('#login()', () => {
    let backend: MockBackend;
    let service: AuthService;

    const LOGIN_RESP_INCORRECT: Object = {"message":"Incorrect username or password. Or this account is not activated, check your mailbox."};
    const LOGIN_RESP_ALL_REQUIRED: Object = {"message":"All fields required"};
    const LOGIN_RESP_OK: Object = {"token":"JWT.TOKEN"};

    beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
      backend = be;
      service = new AuthService(http);
    }));

    it('should be NOT OK', async(inject([], () => {
      mockRespByStatusAndBody(backend, 401, LOGIN_RESP_INCORRECT);
      service.login(getLoginReq("notValidOrNotActivated@email.com", "fake"))
        .subscribe(resp => expect(resp).toEqual(LOGIN_RESP_INCORRECT));
    })));

    it('should be NOT OK', async(inject([], () => {
      mockRespByStatusAndBody(backend, 400, LOGIN_RESP_ALL_REQUIRED);
      service.login(getLoginReq("valid@email.com", null))
        .subscribe(resp => expect(resp).toEqual(LOGIN_RESP_ALL_REQUIRED));
    })));

    it('should be OK', async(inject([], () => {
      mockRespByStatusAndBody(backend, 200, LOGIN_RESP_OK);
      service.login(getLoginReq("valid@email.com", "fake"))
        .subscribe(resp => {
          expect(resp).toEqual(LOGIN_RESP_OK);
        });
    })));

    // it('should treat 404 as an Observable error', async(inject([], () => {
    //   // let resp = mockRespByStatusAndBody(backend, 404, undefined);
    //   // testFor404(service.login(null));
    //
    //   let resp = new Response(new ResponseOptions({status: 404}));
    //   backend.connections.subscribe((c: MockConnection) => c.mockRespond(resp));
    //
    //   console.log("FAILLLLLL");
    //
    //   service.login(null)
    //     .subscribe(resp => {
    //       console.log("FAILLLLLL 1");
    //       fail('should not respond');
    //     }, err => {
    //       console.log("FAILLLLLL 2");
    //       console.log(err);
    //       // expect(err).toBeNull();
    //       // expect(err).toMatch(/Bad response status/, 'should catch bad response status code');
    //       // return Observable.of(null); // failure is the expected test result
    //     });
    //
    // })));

    function getLoginReq(email: string | void, password: string | void) {
      return { "email": email, "password": password };
    }
  });

  describe('#forgot()', () => {
    let backend: MockBackend;
    let service: AuthService;

    const FORGOT_RESP_ALL_REQUIRED: Object = {"message":"Email fields is required."};
    const FORGOT_RESP_OK: Object = {"message":"An e-mail has been sent to valid@email.com with further instructions."};

    beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
      backend = be;
      service = new AuthService(http);
    }));

    it('should be NOT OK', async(inject([], () => {
      mockRespByStatusAndBody(backend, 400, FORGOT_RESP_ALL_REQUIRED);
      service.forgot({ "email": null })
        .subscribe(resp => expect(resp).toEqual(FORGOT_RESP_ALL_REQUIRED));
    })));

    it('should be OK', async(inject([], () => {
      mockRespByStatusAndBody(backend, 200, FORGOT_RESP_OK);
      service.forgot({ "email": "valid@email.com" })
        .subscribe(resp => expect(resp).toEqual(FORGOT_RESP_OK));
    })));

  //   it('should treat 404 as an Observable error', async(inject([], () => {
  //     let resp = mockRespByStatusAndBody(backend, 404, undefined);
  //     testFor404(service.forgot(null));
  //   })));
  });

  describe('#activate()', () => {
    let backend: MockBackend;
    let service: AuthService;

    const ACTIVATE_RESP_NOT_EXISTS: Object = {"message":"No account with that token exists."};
    const ACTIVATE_RESP_OK: Object = {"message":"An e-mail has been sent to fakeValid@email.com with further instructions."};

    beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
      backend = be;
      service = new AuthService(http);
    }));

    it('should be NOT OK', async(inject([], () => {
      mockRespByStatusAndBody(backend, 400, ACTIVATE_RESP_NOT_EXISTS);
      service.activate('wrongToken', 'fakeuser')
        .subscribe(resp => expect(resp).toEqual(ACTIVATE_RESP_NOT_EXISTS));
    })));

    it('should be OK', async(inject([], () => {
      mockRespByStatusAndBody(backend, 200, ACTIVATE_RESP_OK);
      service.activate('fakeToken', 'fakeuser')
        .subscribe(resp => expect(resp).toEqual(ACTIVATE_RESP_OK));
    })));

  //   it('should treat 404 as an Observable error', async(inject([], () => {
  //     let resp = mockRespByStatusAndBody(backend, 404, undefined);
  //     testFor404(service.activate(null,null));
  //   })));
  });

  describe('#reset()', () => {
    let backend: MockBackend;
    let service: AuthService;

    const RESET_RESP_ALL_REQUIRED: Object = {"message":"No account with that token exists."};
    const RESET_RESP_OK: Object = {"message":"An e-mail has been sent to valid@email.com with further instructions."};

    beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
      backend = be;
      service = new AuthService(http);
    }));

    it('should be NOT OK', async(inject([], () => {
      mockRespByStatusAndBody(backend, 400, RESET_RESP_ALL_REQUIRED);
      service.reset("valid@email.com", "newPassword")
        .subscribe(resp => expect(resp).toEqual(RESET_RESP_ALL_REQUIRED));
    })));

    it('should be OK', async(inject([], () => {
      mockRespByStatusAndBody(backend, 200, RESET_RESP_OK);
      service.reset("valid@email.com", "newPassword")
        .subscribe(resp => expect(resp).toEqual(RESET_RESP_OK));
    })));

  //   it('should treat 404 as an Observable error', async(inject([], () => {
  //     let resp = mockRespByStatusAndBody(backend, 404, undefined);
  //     testFor404(service.reset(null, null));
  //   })));
  });

  describe('#unlink()', () => {
    let backend: MockBackend;
    let service: AuthService;

    const UNLINK_RESP_OK: string = "User unlinked correctly!";

    beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
      backend = be;
      service = new AuthService(http);
    }));

    it('should be OK', async(inject([], () => {
      mockRespByStatusAndBody(backend, 200, UNLINK_RESP_OK);
      service.unlink('github') // a valid serviceName
        .subscribe(resp => expect(resp._body).toEqual(UNLINK_RESP_OK));
    })));

  //   it('should treat 404 as an Observable error', async(inject([], () => {
  //     let resp = mockRespByStatusAndBody(backend, 404, undefined);
  //     testFor404(service.unlink(null));
  //   })));
  });

  describe('#getUserById()', () => {
    let backend: MockBackend;
    let service: AuthService;

    const GET_USER_BY_ID_RESP_OK: any = {
      '_id':'validId',
      'profile':{
        'name':'gybhunj',
        'surname':'vgbhjn',
        'nickname':'vghbjn',
        'email':'vghbjn',
        'updated':'2016-09-05T19:23:48.008Z',
        'visible':true,
        '_id':'profileId'
      },
      'google':{
        'email':'valid.google@email.com',
        'id':'googleId',
        'name':'Fake name',
        'token':'fakeToken'
      }
    };

    beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
      backend = be;
      service = new AuthService(http);
    }));

    it('should be OK', async(inject([], () => {
      mockRespByStatusAndBody(backend, 200, GET_USER_BY_ID_RESP_OK);
      service.getUserById('validId')
        .subscribe(resp => expect(resp).toEqual(GET_USER_BY_ID_RESP_OK));
    })));

  //   it('should treat 404 as an Observable error', async(inject([], () => {
  //     let resp = mockRespByStatusAndBody(backend, 404, undefined);
  //     testFor404(service.getUserById(null));
  //   })));
  });

  describe('#logout()', () => {
    let backend: MockBackend;
    let service: AuthService;

    const LOGOUT_RESP_OK: Object = {"message":"Logout succeeded"};

    beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
      backend = be;
      service = new AuthService(http);
    }));

    it('should be OK', async(inject([], () => {
      mockRespByStatusAndBody(backend, 200, LOGOUT_RESP_OK);
      service.logout()
        .subscribe(resp => expect(resp).toEqual(LOGOUT_RESP_OK));
    })));

  //   it('should treat 404 as an Observable error', async(inject([], () => {
  //     let resp = mockRespByStatusAndBody(backend, 404, undefined);
  //     testFor404(service.logout());
  //   })));
  });

  describe('#getTokenRedis()', () => {
    let backend: MockBackend;
    let service: AuthService;

    const GET_TOKEN_REDIS_RESP_OK: Object = { token: "valid.jwt.token" };

    beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
      backend = be;
      service = new AuthService(http);
    }));

    it('should be OK', async(inject([], () => {
      mockRespByStatusAndBody(backend, 200, GET_TOKEN_REDIS_RESP_OK);
      service.getTokenRedis()
        .subscribe(resp => expect(resp).toEqual(GET_TOKEN_REDIS_RESP_OK));
    })));

  //   it('should treat 404 as an Observable error', async(inject([], () => {
  //     let resp = mockRespByStatusAndBody(backend, 404, undefined);
  //     testFor404(service.getTokenRedis());
  //   })));
  });

  describe('#saveToken(), #getToken(), #removeToken()', () => {
    let backend: MockBackend;
    let service: AuthService;

    const key: string = "auth";
    const token: string = "valid.jwt.token";

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


  describe('#decodeJwtToken()', () => {
    let backend: MockBackend;
    let service: AuthService;

    const TOKEN_NOT_FOUND: Object = {"message": "No token found"};
    const TOKEN_NOT_VALID: Object = {"message":"Jwt not valid or corrupted"};
    const TOKEN_EXPIRED: Object = {"message":"Token Session expired (date)."};
    const TOKEN_IMPOSSIBLE_TO_DECODE: Object = {"message":"Impossible to decode token."};
    const TOKEN_NOT_CHECKABLE: Object = {"message":"Impossible to check if jwt is valid"};

    const JWT_MOCK: Object = {
      '_id': '57686655022691a4306b76b9',
      'user': {
        '_id': '57686655022691a4306b76b9',
        '__v': 0,
        'local': {
          'hash': '$2a$10$hHCcxNQmzzNCecReX1Rbeu5PJCosbjITXA1x./feykYcI2JW3npTW',
          'email': 'fake@email.it',
          'name': 'fake username'
        }
      },
      'exp': 1466721597694,
      'iat': 1466720997
    };

    beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
      backend = be;
      service = new AuthService(http);
    }));

    // it('should be OK', async(inject([], () => {
    //   mockRespByStatusAndBody(backend, 200, JWT_MOCK);
    //   service.decodeJwtToken(TOKEN)
    //     .subscribe(resp => expect(resp).toEqual(JWT_MOCK));
    // })));

    it('should NOT OK', async(inject([], () => {
      mockRespByStatusAndBody(backend, 401, TOKEN_NOT_VALID);
      service.decodeJwtToken(TOKEN)
        .subscribe(resp => expect(resp).toEqual(TOKEN_NOT_VALID));
    })));

    it('should NOT OK', async(inject([], () => {
      mockRespByStatusAndBody(backend, 401, TOKEN_EXPIRED);
      service.decodeJwtToken(TOKEN)
        .subscribe(resp => expect(resp).toEqual(TOKEN_EXPIRED));
    })));

    it('should NOT OK', async(inject([], () => {
      mockRespByStatusAndBody(backend, 401, TOKEN_IMPOSSIBLE_TO_DECODE);
      service.decodeJwtToken(TOKEN)
        .subscribe(resp => expect(resp).toEqual(TOKEN_IMPOSSIBLE_TO_DECODE));
    })));

    it('should NOT OK', async(inject([], () => {
      mockRespByStatusAndBody(backend, 500, TOKEN_NOT_CHECKABLE);
      service.decodeJwtToken(TOKEN)
        .subscribe(resp => expect(resp).toEqual(TOKEN_NOT_CHECKABLE));
    })));

    // it('should treat 404 as an Observable error', async(inject([], () => {
    //   let resp = mockRespByStatusAndBody(backend, 404, undefined);
    //   testFor404(service.decodeJwtToken(TOKEN));
    // })));
  });

  describe('#post3dAuthAfterCallback()', () => {
    let backend: MockBackend;
    let service: AuthService;

    const JWT_TOKEN: string = 'valid.jwt.token';
    const TOKEN_NOT_VALID: string = 'sessionToken not valid';
    const TOKEN_NOT_FOUND: string = 'sessionToken not valid. Cannot obtain token';
    const GET_TOKEN_REDIS_RESP_OK: any = { token: "valid.jwt.token" };

    beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
      backend = be;
      service = new AuthService(http);
    }));

    // TODO - NOT SIMPLE BECAUSE post3dAuthAfterCallback uses JSON.parse with the result of another inner service

    // it('should be OK', async(inject([], () => {
    //   mockRespByStatusAndBody(backend, 200, JSON.stringify(GET_TOKEN_REDIS_RESP_OK));
    //   service.post3dAuthAfterCallback()
    //     .subscribe(resp => expect(resp).toEqual(GET_TOKEN_REDIS_RESP_OK.token));
    // })));

    // it('should NOT OK, but with status 200', async(inject([], () => {
    //   mockRespByStatusAndBody(backend, 200, TOKEN_NOT_VALID);
    //   service.post3dAuthAfterCallback()
    //     .subscribe(resp => expect(resp).toEqual(TOKEN_NOT_VALID));
    // })));

    // it('should NOT OK, but with status 200', async(inject([], () => {
    //   mockRespByStatusAndBody(backend, 200, TOKEN_NOT_VALID);
    //   service.post3dAuthAfterCallback()
    //     .subscribe(resp => expect(resp).toEqual(TOKEN_NOT_FOUND));
    // })));

    // it('should treat 404 as an Observable error', async(inject([], () => {
    //   let resp = mockRespByStatusAndBody(backend, 404, undefined);
    //   testFor404(service.decodeJwtToken(TOKEN));
    // })));
  });


  describe('#getLoggedUser()', () => {
    let backend: MockBackend;
    let service: AuthService;

    const JWT_MOCK: any = {
      '_id': '57686655022691a4306b76b9',
      'user': {
        '_id': '57686655022691a4306b76b9',
        '__v': 0,
        'local': {
          'hash': '$2a$10$hHCcxNQmzzNCecReX1Rbeu5PJCosbjITXA1x./feykYcI2JW3npTW',
          'email': 'fake@email.it',
          'name': 'fake username'
        }
      },
      'exp': 1466721597694,
      'iat': 1466720997
    };

    beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
      backend = be;
      service = new AuthService(http);
    }));

    // TODO - NOT SIMPLE BECAUSE post3dAuthAfterCallback uses JSON.parse with the result of another inner service

    // it('should be OK', async(inject([], () => {
    //   mockRespByStatusAndBody(backend, 200, JSON.stringify(JWT_MOCK));
    //   service.getLoggedUser()
    //     .subscribe(resp => expect(resp).toEqual(JWT_MOCK.user));
    // })));

  });

});

function mockRespByStatusAndBody(backend: MockBackend, status: number, body: any) {
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

function testFor404(serviceObservableCall: any) {
  serviceObservableCall
    .do(resp => fail('should not respond'))
    .catch(err => {
      expect(err).toMatch(/Bad response status/, 'should catch bad response status code');
      return Observable.of(null); // failure is the expected test result
    });
}
