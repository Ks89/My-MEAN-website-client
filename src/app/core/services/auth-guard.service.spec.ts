import { async, inject, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { Router } from "@angular/router";
import { HttpClient } from "@angular/common/http";

import { AuthService } from './auth.service';
import { AuthGuard } from './auth-guard.service';

import { URL_API_DECODE_TOKEN } from './auth.service';

const MOCK_GENERIC_ERROREVENT: ErrorEvent = new ErrorEvent('Error');

const JWT_TOKEN = 'valid.jwt.token';
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

describe('Http-AuthService (mockBackend)', () => {

  let router: any;

  beforeEach( async(() => {
    router = { navigate: jasmine.createSpy('navigate') };

    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [ AuthService, AuthGuard,
        { provide: Router, useValue: router }
      ]
    });
  }));

  it('can instantiate service when inject service',
    inject([AuthGuard], (service: AuthGuard) => {
      expect(service instanceof AuthGuard).toEqual(true);
    }));

  it('can instantiate service with "new"', inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {
    expect(http).not.toBeNull('http should be provided');
    let service = new AuthGuard(new AuthService(http), router);
    expect(service instanceof AuthGuard).toEqual(true, 'new service should be ok');
  }));

  it('can provide the mockBackend as XHRBackend', inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {
    expect(httpMock).not.toBeNull('httpMock should be provided');
  }));

  describe('#canActivate()', () => {
    let service: AuthGuard;

    beforeEach(inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {
      service = new AuthGuard( new AuthService(http), router);
      // I want a clean session storage to create independent tests
      window.sessionStorage.removeItem('auth');
    }));

    it('should be OK', async(inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {
      // mockRespByStatusAndBody(backend, 200, JSON.stringify(JSON.stringify(JWT_MOCK)));
      // Since I'm using a service with another service inside that uses session storage I have to provide
      // a fake element into session storage with key = 'auth'
      // TODO FIXME - it's ok (because I'm testing canActivate not the inner methods), but it could be a good idea to refactor getLoggedUser and getUserFromSessionStorage
      window.sessionStorage.setItem('auth', JWT_TOKEN);
      service.canActivate().subscribe(resp => expect(resp).toBeTruthy());
      mock(httpMock, `${URL_API_DECODE_TOKEN}/${JWT_TOKEN}`, 'GET', JWT_MOCK);
    })));

    it('should be NOT OK', async(inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {
      // mockRespByStatusAndBody(backend, 200, null);
      // Since I'm using a service with another service inside that uses session storage I have to provide
      // a fake element into session storage with key = 'auth'
      // TODO FIXME - it's ok (because I'm testing canActivate not the inner methods), but it could be a good idea to refactor getLoggedUser and getUserFromSessionStorage
      window.sessionStorage.setItem('auth', JWT_TOKEN);
      service.canActivate()
        .subscribe(resp => {
          expect(resp).toBeFalsy();
          expect(router.navigate).toHaveBeenCalledWith(['/login']);
        });
      mock(httpMock, `${URL_API_DECODE_TOKEN}/${JWT_TOKEN}`, 'GET', null);
    })));

    it('should catch an Observable error', async(inject([HttpClient, HttpTestingController], (http: HttpClient, httpMock: HttpTestingController) => {
      // mockError(backend);
      // Since I'm using a service with another service inside that uses session storage I have to provide
      // a fake element into session storage with key = 'auth'
      // TODO FIXME - it's ok (because I'm testing canActivate not the inner methods), but it could be a good idea to refactor getLoggedUser and getUserFromSessionStorage
      window.sessionStorage.setItem('auth', JWT_TOKEN);
      service.canActivate()
        .subscribe(
          projects => fail(`shouldn't call this, because I'm expecting an error.`),
          err => {
            expect(err).toBeFalsy();
            expect(router.navigate).toHaveBeenCalledWith(['/login']);
          });
      mockError(httpMock, `${URL_API_DECODE_TOKEN}/${JWT_TOKEN}`, 'GET');
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