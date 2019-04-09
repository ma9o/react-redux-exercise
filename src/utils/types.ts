export const ADD_DICT = 'ADD_DICT';
export const REMOVE_DICT = 'REMOVE_DICT';
export const EDIT_DICT = 'EDIT_DICT';
export const EDIT_ROW = 'EDIT_ROW';

export interface Pair {
  id: string;
  key: string;
  value: string;
  errors: {
    cycle: boolean;
    chain: boolean;
    fork: boolean;
    duplicate: boolean;
  };
}

export interface Dictionary {
  id: string;
  name: string;
  data: Pair[];
}

export interface ReduxState {
  rows: Dictionary[];
}

export interface Err {
  fork: boolean;
  duplicate: boolean;
  chain: boolean;
  cycle: boolean;
}

export interface MyActions {
  addDict(added: Dictionary[]): { type: string; entries: Dictionary[] };
  deleteDict(ids: string[]): { type: string; entries: string[] };
  editDict(changed: {
    [key: string]: Dictionary;
  }): { type: string; entries: { [key: string]: Dictionary } };
}

export const schema = {
  properties: {
    id: { type: 'string' },
    key: { type: 'string' },
    value: { type: 'string' }
  }
};
