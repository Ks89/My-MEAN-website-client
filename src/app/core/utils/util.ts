import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';

export function handleError(error: HttpErrorResponse) {
  return Observable.throw(error.error);
}