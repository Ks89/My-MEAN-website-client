import { Action } from '@ngrx/store';

export const GET_PAGE = '[PageNum] Get Page';
export const SET_PAGE = '[PageNum] Set Page';

export class GetPageNum implements Action {
  readonly type = GET_PAGE;

  constructor(public payload: number) {
  }
}

export class SetPageNum implements Action {
  readonly type = SET_PAGE;

  constructor(public payload: number) {
  }
}

export type Actions =
  | GetPageNum
  | SetPageNum;
