import { async, inject, TestBed } from '@angular/core/testing';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { HttpModule, Http, XHRBackend, Response, ResponseOptions } from '@angular/http';

import { AuthService } from './auth.service';
import { AuthGuard } from './auth-guard.service';
import { Router } from "@angular/router";

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
      imports: [ HttpModule ],
      providers: [ AuthService, AuthGuard,
        { provide: XHRBackend, useClass: MockBackend },
        { provide: Router, useValue: router }
      ]
    });
  }));

  it('can instantiate service when inject service',
    inject([AuthGuard], (service: AuthGuard) => {
      expect(service instanceof AuthGuard).toEqual(true);
    }));

  it('can instantiate service with "new"', inject([Http], (http: Http) => {
    expect(http).not.toBeNull('http should be provided');
    let service = new AuthGuard(new AuthService(http), router);
    expect(service instanceof AuthGuard).toEqual(true, 'new service should be ok');
  }));

  it('can provide the mockBackend as XHRBackend', inject([XHRBackend], (backend: MockBackend) => {
    expect(backend).not.toBeNull('backend should be provided');
  }));

  describe('#canActivate()', () => {
    let backend: MockBackend;
    let service: AuthGuard;

    beforeEach(inject([Http, XHRBackend], (http: Http, be: MockBackend) => {
      backend = be;
      service = new AuthGuard( new AuthService(http), router);
      // I want a clean session storage to create independent tests
      window.sessionStorage.removeItem('auth');
    }));

    it('should be OK', async(inject([], () => {
      mockRespByStatusAndBody(backend, 200, JSON.stringify(JSON.stringify(JWT_MOCK)));
      // Since I'm using a service with another service inside that uses session storage I have to provide
      // a fake element into session storage with key = 'auth'
      // TODO FIXME - it's ok (because I'm testing canActivate not the inner methods), but it could be a good idea to refactor getLoggedUser and getUserFromSessionStorage
      window.sessionStorage.setItem('auth', JWT_TOKEN);
      service.canActivate()
        .subscribe(resp => expect(resp).toBeTruthy());
    })));

    it('should be NOT OK', async(inject([], () => {
      mockRespByStatusAndBody(backend, 200, null);
      // Since I'm using a service with another service inside that uses session storage I have to provide
      // a fake element into session storage with key = 'auth'
      // TODO FIXME - it's ok (because I'm testing canActivate not the inner methods), but it could be a good idea to refactor getLoggedUser and getUserFromSessionStorage
      window.sessionStorage.setItem('auth', JWT_TOKEN);
      service.canActivate()
        .subscribe(resp => {
          expect(resp).toBeFalsy();
          expect(router.navigate).toHaveBeenCalledWith(['/login']);
        });
    })));

    it('should catch an Observable error', async(inject([], () => {
      mockError(backend);
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
}

function mockError(backend: MockBackend) {
  backend.connections.subscribe((c: MockConnection) => c.mockError(new Error()));
}
