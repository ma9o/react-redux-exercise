import { ADD_DICT, Dictionary, EDIT_DICT, REMOVE_DICT } from '../utils/types';

export function addDict(
  added: Dictionary[]
): { type: string; entries: Dictionary[] } {
  return {
    type: ADD_DICT,
    entries: added
  };
}

export function editDict(changed: {
  [key: string]: Dictionary;
}): { type: string; entries: { [key: string]: Dictionary } } {
  return {
    type: EDIT_DICT,
    entries: changed
  };
}

export function deleteDict(ids: string[]): { type: string; entries: string[] } {
  return { type: REMOVE_DICT, entries: ids };
}
