import { createRC } from './reducer-utils';
import { createRefs } from './create-refs';

export function createSharedContext(stateKeys, dispatch, state, { refKeys, ref }) {
  console.log(stateKeys);
  const rc = createRC(stateKeys, dispatch, state);
  const refs = createRefs(refKeys, ref);
  return {
    rc,
    refs,
    state,
  };
}
