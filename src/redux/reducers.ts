import produce from 'immer';
import {
  ADD_DICT,
  Dictionary,
  EDIT_DICT,
  ReduxState,
  REMOVE_DICT
} from '../utils/types';
import { combineReducers } from 'redux';

const initialState: ReduxState = {
  rows: new Array<Dictionary>()
};

function main(state = initialState, action: any) {
  switch (action.type) {
    case ADD_DICT:
      return produce(state, tmpState => {
        tmpState.rows.unshift(...action.entries);
      });
    case EDIT_DICT:
      return produce(state, tmpState => {
        tmpState.rows = tmpState.rows.map(row =>
          action.entries[row.id] ? { ...row, ...action.entries[row.id] } : row
        );
      });
    case REMOVE_DICT:
      return produce(state, tmpState => {
        action.entries.forEach((id: string) => {
          tmpState.rows.splice(tmpState.rows.findIndex(x => x.id === id), 1);
        });
      });

    default:
      return state;
  }
}

export default combineReducers({ main });
