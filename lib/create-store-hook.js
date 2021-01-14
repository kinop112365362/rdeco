import { useContext, useReducer } from 'react';
import { createReducer, reducerHelper } from './reducer-utils';
import { initStateMetaHandler } from './init-state-meta-handler';
import { log } from './utils/log';
import { AppContext } from './app-context';
import { createStoreInHook } from './create-store-in-hook';
import { storeNameList } from './store-name-list';


export const createStoreHook = storeConfig => {
  const storeStateConfig = initStateMetaHandler(storeConfig);
  const reducer = reducerHelper(createReducer(storeStateConfig.stateKeys));
  return function useStore(...props) {
    if (props.length > 0 && !storeNameList[name]) {
      throw new Error(` 这个 store ${name} 并没有设置 membrane, 传入的参数将不会起到任何作用 ${props}`);
    }
    const context = useContext(AppContext);
    const [state, dispatch] = useReducer(reducer, storeStateConfig.initState, storeStateConfig.init);
    return createStoreInHook({ dispatch, state, context, ...storeConfig, ...storeStateConfig });
  };
};
