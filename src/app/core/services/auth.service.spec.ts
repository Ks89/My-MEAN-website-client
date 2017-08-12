import * as _ from "lodash";
import { async, inject, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { HttpClient } from "@angular/common/http";

import { AuthService } from './auth.service';

import { URL_API_LOGIN, URL_API_REGISTER, URL_API_RESET, URL_API_FORGOT, URL_API_ACTIVATE,
  URL_API_UNLINK, URL_API_USERS, URL_API_LOGOUT, URL_API_SESSION_TOKEN,
  URL_API_DECODE_TOKEN } from './auth.service';

const MOCK_GENERIC_ERROREVENT: ErrorEvent = new ErrorEvent('Error');

const JWT_TOKEN = 'valid.jwt.token';

describe('Http-AuthService (mockBackend)', () => {

  beforeEach( async(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [ AuthService ]
    });
  }));

  it('can instantiate service when inject service',
    inject([AuthService], (service: AuthService) => {
      expect(service instanceof AuthService).toEqual(true);
  }));

  it('can instantiate service with "new"', inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {
    expect(http).not.toBeNull('http should be provided');
    let service = new AuthService(http);
    expect(service instanceof AuthService).toEqual(true, 'new service should be ok');
  }));

  it('can provide the mockBackend as XHRBackend', inject([HttpClient, HttpTestingController], (httpMock: HttpTestingController) => {
      expect(httpMock).not.toBeNull('httpMock should be provided');
  }));

  describe('#register()', () => {
    let service: AuthService;

    const REGISTER_RESP_ALREADY_EXISTS: Object = {"message": "User already exists. Try to login."};
    const REGISTER_RESP_ALL_REQUIRED: Object = {"message":"All fields required"};
    const REGISTER_RESP_OK: Object = {"message":"User with email valid@email.com registered."};

    beforeEach(inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {
      service = new AuthService(http);
      // I want a clean session storage to create independent tests
      window.sessionStorage.removeItem('auth');
    }));

    it('should be NOT OK', async(inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {
      service.register(getRegisterReq("fake", "alreadyused@email.com", "fake"))
        .subscribe(resp => {
          console.log('resp', resp);
          expect(resp).toEqual(REGISTER_RESP_ALREADY_EXISTS);
          // session storage must be empty, because when registration fails, it removes session token (just to be safe)
          expect(service.getToken('auth')).toBeUndefined();
        });
      mock(httpMock, URL_API_REGISTER, 'POST', REGISTER_RESP_ALREADY_EXISTS);
    })));

    it('should be NOT OK', async(inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {
      // mockRespByStatusAndBody(backend, 400, REGISTER_RESP_ALL_REQUIRED);
      service.register(getRegisterReq("fake", null, null))
        .subscribe(resp => {
          expect(resp).toEqual(REGISTER_RESP_ALL_REQUIRED);
          // session storage must be empty, because when registration fails, it removes session token (just to be safe)
          expect(service.getToken('auth')).toBeUndefined();
        });
      mock(httpMock, URL_API_REGISTER, 'POST', REGISTER_RESP_ALL_REQUIRED);
    })));

    it('should be OK', async(inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {
      // mockRespByStatusAndBody(backend, 200, REGISTER_RESP_OK);
      service.register(getRegisterReq("fake", "valid@email.com", "fake"))
      .subscribe(resp => expect(resp).toEqual(REGISTER_RESP_OK));
      // it's not important if session storage is empty or not, because login will overwrite session storage with the same key
      mock(httpMock, URL_API_REGISTER, 'POST', REGISTER_RESP_OK);
    })));

    it('should catch an Observable error', async(inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {
      service.register('something')
        .subscribe(
          projects => fail(`shouldn't call this, because I'm expecting an error.`),
          err => expect(err).toBe(MOCK_GENERIC_ERROREVENT));
      mockError(httpMock, URL_API_REGISTER, 'POST');
    })));

    function getRegisterReq(name: string | void, email: string | void, password: string | void) {
      return { "name": name, "email": email, "password": password };
    }

    afterEach(inject([HttpTestingController], (httpMock: HttpTestingController) => {
      httpMock.verify();
    }));
  });

  describe('#login()', () => {
    let service: AuthService;

    const LOGIN_RESP_INCORRECT: Object = { "message": "Incorrect username or password. Or this account is not activated, check your mailbox." };
    const LOGIN_RESP_ALL_REQUIRED: Object = { "message": "All fields required" };
    const LOGIN_RESP_OK: any = { "token": JWT_TOKEN };

    beforeEach(inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {
      service = new AuthService(http);
      // I want a clean session storage to create independent tests
      window.sessionStorage.removeItem('auth');
    }));

    it('should be NOT OK', async(inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {
      service.login(getLoginReq("notValidOrNotActivated@email.com", "fake"))
        .subscribe(resp => {
          expect(resp).toEqual(LOGIN_RESP_INCORRECT);
          // session storage must be empty when login fails
          expect(service.getToken('auth')).toBeUndefined();
        });
      mock(httpMock, URL_API_LOGIN, 'POST', LOGIN_RESP_INCORRECT);
    })));

    it('should be NOT OK', async(inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {
      service.login(getLoginReq("valid@email.com", null))
        .subscribe(resp => {
          expect(resp).toEqual(LOGIN_RESP_ALL_REQUIRED);
          // session storage must be empty when login fails
          expect(service.getToken('auth')).toBeUndefined();
        });
      mock(httpMock, URL_API_LOGIN, 'POST', LOGIN_RESP_ALL_REQUIRED);
    })));

    it('should be OK', async(inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {
      service.login(getLoginReq("valid@email.com", "fake"))
        .subscribe(resp => {
          expect(resp).toEqual(LOGIN_RESP_OK);
          // session storage must contains the generated token
          expect(service.getToken('auth')).toBe(LOGIN_RESP_OK.token);
        });
      mock(httpMock, URL_API_LOGIN, 'POST', LOGIN_RESP_OK);
    })));

    it('should catch an Observable error', async(inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {
      service.login('something')
        .subscribe(
          projects => fail(`shouldn't call this, because I'm expecting an error.`),
          err => expect(err).toBe(MOCK_GENERIC_ERROREVENT));
      mockError(httpMock, URL_API_LOGIN, 'POST');
    })));

    function getLoginReq(email: string | void, password: string | void) {
      return { "email": email, "password": password };
    }

    afterEach(inject([HttpTestingController], (httpMock: HttpTestingController) => {
      httpMock.verify();
    }));
  });

  describe('#forgot()', () => {
    let service: AuthService;

    const FORGOT_RESP_ALL_REQUIRED: Object = {"message":"Email fields is required."};
    const FORGOT_RESP_OK: Object = {"message":"An e-mail has been sent to valid@email.com with further instructions."};

    beforeEach(inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {
      service = new AuthService(http);
      // I want a clean session storage to create independent tests
      window.sessionStorage.removeItem('auth');
    }));

    it('should be NOT OK', async(inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {
      // mockRespByStatusAndBody(backend, 400, FORGOT_RESP_ALL_REQUIRED);
      service.forgot({ "email": null })
        .subscribe(resp => expect(resp).toEqual(FORGOT_RESP_ALL_REQUIRED));
      mock(httpMock, URL_API_FORGOT, 'POST', FORGOT_RESP_ALL_REQUIRED);
    })));

    it('should be OK', async(inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {
      // mockRespByStatusAndBody(backend, 200, FORGOT_RESP_OK);
      service.forgot({ "email": "valid@email.com" })
        .subscribe(resp => expect(resp).toEqual(FORGOT_RESP_OK));
      mock(httpMock, URL_API_FORGOT, 'POST', FORGOT_RESP_OK);
    })));

    it('should catch an Observable error', async(inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {
      service.forgot('something')
        .subscribe(
          projects => fail(`shouldn't call this, because I'm expecting an error.`),
          err => expect(_.isError(err)).toBeTruthy());
      mockError(httpMock, URL_API_FORGOT, 'POST');
    })));
  });

  describe('#activate()', () => {
    let service: AuthService;

    const ACTIVATE_RESP_NOT_EXISTS: Object = {"message":"No account with that token exists."};
    const ACTIVATE_RESP_OK: Object = {"message":"An e-mail has been sent to fakeValid@email.com with further instructions."};

    beforeEach(inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {
      service = new AuthService(http);
      // I want a clean session storage to create independent tests
      window.sessionStorage.removeItem('auth');
    }));

    it('should be NOT OK', async(inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {
      service.activate('wrongToken', 'fakeuser')
        .subscribe(resp => expect(resp).toEqual(ACTIVATE_RESP_NOT_EXISTS));
      mock(httpMock, URL_API_ACTIVATE, 'POST', ACTIVATE_RESP_NOT_EXISTS);
    })));

    it('should be OK', async(inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {
      service.activate('fakeToken', 'fakeuser')
        .subscribe(resp => expect(resp).toEqual(ACTIVATE_RESP_OK));
      mock(httpMock, URL_API_ACTIVATE, 'POST', ACTIVATE_RESP_OK);
    })));

    it('should catch an Observable error', async(inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {
      service.activate('something', 'something')
        .subscribe(
          projects => fail(`shouldn't call this, because I'm expecting an error.`),
          err => expect(_.isError(err)).toBeTruthy());
      mockError(httpMock, URL_API_ACTIVATE, 'POST');
    })));
  });

  describe('#reset()', () => {
    let service: AuthService;

    const RESET_RESP_ALL_REQUIRED: Object = {"message":"No account with that token exists."};
    const RESET_RESP_OK: Object = {"message":"An e-mail has been sent to valid@email.com with further instructions."};

    beforeEach(inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {
      service = new AuthService(http);
      // I want a clean session storage to create independent tests
      window.sessionStorage.removeItem('auth');
    }));

    it('should be NOT OK', async(inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {
      service.reset("valid@email.com", "newPassword")
        .subscribe(resp => expect(resp).toEqual(RESET_RESP_ALL_REQUIRED));
      mock(httpMock, URL_API_RESET, 'POST', RESET_RESP_ALL_REQUIRED);
    })));

    it('should be OK', async(inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {
      service.reset("valid@email.com", "newPassword")
        .subscribe(resp => {
          expect(resp).toEqual(RESET_RESP_OK);
          // session storage must be empty when reset completes
          expect(service.getToken('auth')).toBeUndefined();
        });
      mock(httpMock, URL_API_RESET, 'POST', RESET_RESP_OK);
    })));

    it('should catch an Observable error', async(inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {
      service.reset('something', 'something')
        .subscribe(
          projects => fail(`shouldn't call this, because I'm expecting an error.`),
          err => expect(_.isError(err)).toBeTruthy());
      mockError(httpMock, URL_API_RESET, 'POST');
    })));
  });

  describe('#unlink()', () => {
    let service: AuthService;
    const serviceName: string = 'github';

    const UNLINK_RESP_OK: string = "User unlinked correctly!";

    beforeEach(inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {
      service = new AuthService(http);
      // I want a clean session storage to create independent tests
      window.sessionStorage.removeItem('auth');
    }));

    it('should be OK', async(inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {
      service.unlink(serviceName) // a valid serviceName
        .subscribe(resp => expect(resp).toEqual(UNLINK_RESP_OK));
      mock(httpMock, `${URL_API_UNLINK}/${serviceName}`, 'GET', UNLINK_RESP_OK);
    })));

    // it('should catch an Observable error', async(inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {
    //   service.unlink('something')
    //     .subscribe(
    //       projects => fail(`shouldn't call this, because I'm expecting an error.`),
    //       err => expect(_.isError(err)).toBeTruthy());
    //   mockError(httpMock, `${URL_API_UNLINK}/${serviceName}`, 'GET');
    // })));
  });

  describe('#getUserById()', () => {
    let service: AuthService;
    const validId: string = 'validId';

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

    beforeEach(inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {
      service = new AuthService(http);
      // I want a clean session storage to create independent tests
      window.sessionStorage.removeItem('auth');
    }));

    it('should be OK', async(inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {
      service.getUserById(validId)
        .subscribe(resp => expect(resp).toEqual(GET_USER_BY_ID_RESP_OK));
      mock(httpMock, `${URL_API_USERS}/${validId}`, 'GET', GET_USER_BY_ID_RESP_OK);
    })));

    // it('should catch an Observable error', async(inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {
    //   service.getUserById('something')
    //     .subscribe(
    //       projects => fail(`shouldn't call this, because I'm expecting an error.`),
    //       err => expect(_.isError(err)).toBeTruthy());
    //   mockError(httpMock, `${URL_API_USERS}/${validId}`, 'GET');
    // })));
  });

  describe('#logout()', () => {
    let service: AuthService;

    const LOGOUT_RESP_OK: Object = {"message": "Logout succeeded"};

    beforeEach(inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {
      service = new AuthService(http);
      // I want a clean session storage to create independent tests
      window.sessionStorage.removeItem('auth');
    }));

    it('should be OK', async(inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {
      service.logout()
        .subscribe(resp => {
          expect(resp).toEqual(LOGOUT_RESP_OK);
          // session storage must be empty when login fails
          expect(service.getToken('auth')).toBeUndefined();
        });
      mock(httpMock, URL_API_LOGOUT, 'GET', LOGOUT_RESP_OK);
    })));

    it('should catch an Observable error', async(inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {
      service.logout()
        .subscribe(
          projects => fail(`shouldn't call this, because I'm expecting an error.`),
          err => expect(_.isError(err)).toBeTruthy());
      mockError(httpMock, URL_API_LOGOUT, 'GET');
    })));
  });

  describe('#getTokenRedis()', () => {
    let service: AuthService;

    const GET_TOKEN_REDIS_RESP_OK: Object = { token: JWT_TOKEN };

    beforeEach(inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {
      service = new AuthService(http);
      // I want a clean session storage to create independent tests
      window.sessionStorage.removeItem('auth');
    }));

    it('should be OK', async(inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {
      // mockRespByStatusAndBody(backend, 200, GET_TOKEN_REDIS_RESP_OK);
      service.getTokenRedis()
        .subscribe(resp => expect(resp).toEqual(GET_TOKEN_REDIS_RESP_OK));
      mock(httpMock, URL_API_SESSION_TOKEN, 'GET', GET_TOKEN_REDIS_RESP_OK);
    })));

  //   it('should catch an Observable error', async(inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {
  //     service.getTokenRedis()
  //       .subscribe(
  //         projects => fail(`shouldn't call this, because I'm expecting an error.`),
  //         err => expect(_.isError(err)).toBeTruthy());
  //     mockError(httpMock, URL_API_SESSION_TOKEN, 'GET');
  //   })));
  });

  describe('#saveToken(), #getToken(), #removeToken()', () => {
    let service: AuthService;

    const key: string = "auth";
    const token: string = JWT_TOKEN;

    beforeEach(inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {
      service = new AuthService(http);
      // I want a clean session storage to create independent tests
      window.sessionStorage.removeItem('auth');
      service.removeToken(key);
    }));

    it(`should save and return the same token from session storage`, async(inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {
      service.saveToken(key, token);
      expect(service.getToken(key)).toBe(token);
    })));

    it(`should overwrite the existing token into session storage with a new one`, async(inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {
      service.saveToken(key, token + 'new');
      expect(service.getToken(key)).toBe(token + 'new');
    })));

    it(`should remove token from session storage`, async(inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {
      service.saveToken(key, token);
      service.removeToken(key);
      expect(service.getToken(key)).toBeUndefined();
    })));

    it(`shouldn't get token, because not inside the session storage`, async(inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {
      expect(service.getToken(key)).toBeUndefined();
    })));

    it(`shouldn't remove token using a wrong key`, async(inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {
      service.saveToken(key, token);
      service.removeToken(key + 'wrong');
      expect(service.getToken(key)).toBe(token);
    })));
  });

  describe('#decodeJwtToken()', () => {
    let backend: HttpTestingController;
    let service: AuthService;

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

    beforeEach(inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {
      service = new AuthService(http);
      // I want a clean session storage to create independent tests
      window.sessionStorage.removeItem('auth');
    }));

    it('should be OK', async(inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {
      // mockRespByStatusAndBody(backend, 200, JWT_MOCK);
      service.decodeJwtToken(JWT_TOKEN)
        .subscribe(resp => expect(resp).toEqual(JWT_MOCK));
      mock(httpMock, `${URL_API_DECODE_TOKEN}/${JWT_TOKEN}`, 'GET', JWT_MOCK);
    })));

    it('should NOT OK', async(inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {
      // mockRespByStatusAndBody(backend, 401, TOKEN_NOT_VALID);
      service.decodeJwtToken(JWT_TOKEN)
        .subscribe(resp => expect(resp).toEqual(TOKEN_NOT_VALID));
      mock(httpMock, `${URL_API_DECODE_TOKEN}/${JWT_TOKEN}`, 'GET', TOKEN_NOT_VALID);
    })));

    it('should NOT OK', async(inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {
      // mockRespByStatusAndBody(backend, 401, TOKEN_EXPIRED);
      service.decodeJwtToken(JWT_TOKEN)
        .subscribe(resp => expect(resp).toEqual(TOKEN_EXPIRED));
      mock(httpMock, `${URL_API_DECODE_TOKEN}/${JWT_TOKEN}`, 'GET', TOKEN_EXPIRED);
    })));

    it('should NOT OK', async(inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {
      // mockRespByStatusAndBody(backend, 401, TOKEN_IMPOSSIBLE_TO_DECODE);
      service.decodeJwtToken(JWT_TOKEN)
        .subscribe(resp => expect(resp).toEqual(TOKEN_IMPOSSIBLE_TO_DECODE));
      mock(httpMock, `${URL_API_DECODE_TOKEN}/${JWT_TOKEN}`, 'GET', TOKEN_IMPOSSIBLE_TO_DECODE);
    })));

    it('should NOT OK', async(inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {
      // mockRespByStatusAndBody(backend, 500, TOKEN_NOT_CHECKABLE);
      service.decodeJwtToken(JWT_TOKEN)
        .subscribe(resp => expect(resp).toEqual(TOKEN_NOT_CHECKABLE));
      mock(httpMock, `${URL_API_DECODE_TOKEN}/${JWT_TOKEN}`, 'GET', TOKEN_NOT_CHECKABLE);
    })));

    // it('should catch an Observable error', async(inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {
    //   mockError(backend);
    //   service.decodeJwtToken('something')
  //       .subscribe(
  //         projects => fail(`shouldn't call this, because I'm expecting an error.`),
  //         err => expect(_.isError(err)).toBeTruthy());
  //   })));
  });

  describe('#post3dAuthAfterCallback()', () => {
    let service: AuthService;

    const TOKEN_NOT_VALID: string = 'sessionToken not valid';
    const TOKEN_NOT_FOUND: string = 'sessionToken not valid. Cannot obtain token';
    const GET_TOKEN_REDIS_RESP_OK: any = { token: JWT_TOKEN };

    beforeEach(inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {
      service = new AuthService(http);
      // I want a clean session storage to create independent tests
      window.sessionStorage.removeItem('auth');
    }));

    it('should be OK', async(inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {
      // mockRespByStatusAndBody(backend, 200, JSON.stringify(JSON.stringify(GET_TOKEN_REDIS_RESP_OK)));
      service.post3dAuthAfterCallback()
        .subscribe(resp => {
          expect(resp).toEqual(GET_TOKEN_REDIS_RESP_OK.token);
          expect(service.getToken('auth')).toBe(JWT_TOKEN);
        });
      mock(httpMock, URL_API_SESSION_TOKEN, 'GET', GET_TOKEN_REDIS_RESP_OK);
    })));

    it('should NOT OK (cannot obtain token), but with status 200', async(inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {
      // mockRespByStatusAndBody(backend, 200, JSON.stringify(JSON.stringify({})));
      service.post3dAuthAfterCallback()
        .subscribe(resp => expect(resp).toEqual(TOKEN_NOT_FOUND));
      mock(httpMock, URL_API_SESSION_TOKEN, 'GET', {});
    })));

    // FIXME NOT WORKING WITH "NULL" USING HTTPCLIENT
    // it('should NOT OK (not valid), but with status 200', async(inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {
    //   // mockRespByStatusAndBody(backend, 200, null);
    //   service.post3dAuthAfterCallback()
    //     .subscribe(resp => expect(resp).toEqual(TOKEN_NOT_VALID));
    //   mock(httpMock, URL_API_SESSION_TOKEN, 'GET', null);
    // })));

    // it('should catch an Observable error', async(inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {
    //   mockError(backend);
    //   service.post3dAuthAfterCallback()
    //     .subscribe(
    //       projects => fail(`shouldn't call this, because I'm expecting an error.`),
    //       err => expect(_.isError(err)).toBeTruthy());
    // })));
  });


  describe('#getLoggedUser()', () => {
    let service: AuthService;

    const INVALID_DATA: string = 'INVALID DATA';
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

    beforeEach(inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {
      service = new AuthService(http);
      // I want a clean session storage to create independent tests
      window.sessionStorage.removeItem('auth');
    }));

    it('should be OK', async(inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {
      // mockRespByStatusAndBody(backend, 200, JSON.stringify(JSON.stringify(JWT_MOCK)));
      // Since I'm using a service with another service inside that uses session storage I have to provide
      // a fake element into session storage with key = 'auth'
      // TODO FIXME - it's ok (because I'm testing getLoggedUser not the inner methods), but it could be a good idea to refactor getLoggedUser and getUserFromSessionStorage
      window.sessionStorage.setItem('auth', JWT_TOKEN);
      service.getLoggedUser()
        .subscribe(resp => {
          console.log("^^^^^^^^^^^^^^^^^^");
          console.warn(resp);
          console.log("^^^^^^^^^^^^^^^^^^");
          expect(resp).toEqual(JWT_MOCK.user);
        });
      mock(httpMock, `${URL_API_DECODE_TOKEN}/${JWT_TOKEN}`, 'GET', JWT_MOCK);
    })));

    // FIXME NOT WORKING WITH "NULL" USING HTTPCLIENT
    // it('should NOT OK (res null), but with status 200', async(inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {
    //   // mockRespByStatusAndBody(backend, 200, null);
    //   service.getLoggedUser()
    //     .subscribe(resp => {
    //       expect(resp).toEqual(INVALID_DATA);
    //       expect(service.getToken('auth')).toBeUndefined();
    //     });
    //   mock(httpMock, `${URL_API_DECODE_TOKEN}/${JWT_TOKEN}`, 'GET', null);
    // })));

    // it(`should NOT OK (res is 'invalid-data'), but with status 200`, async(inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {
    //   // mockRespByStatusAndBody(backend, 200, 'invalid-data');
    //   service.getLoggedUser()
    //     .subscribe(resp => {
    //       expect(resp).toEqual(INVALID_DATA);
    //       expect(service.getToken('auth')).toBeUndefined();
    //     });
    //   mock(httpMock, `${URL_API_DECODE_TOKEN}/${JWT_TOKEN}`, 'GET', 'invalid-data');
    // })));

    // it('should catch an Observable error', async(inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {
    //   mockError(backend);
    //   // Since I'm using a service with another service inside that uses session storage I have to provide
    //   // a fake element into session storage with key = 'auth'
    //   // TODO FIXME - it's ok (because I'm testing getLoggedUser not the inner methods), but it could be a good idea to refactor getLoggedUser and getUserFromSessionStorage
    //   window.sessionStorage.setItem('auth', JWT_TOKEN);
    //   service.getLoggedUser()
    //     .subscribe(
    //       projects => fail(`shouldn't call this, because I'm expecting an error.`),
    //       err => expect(_.isError(err)).toBeTruthy());
    // })));
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