import { createStoreHook } from './create-store-hook';
import { membrane } from './create-membrane';
import { storeNameCheck } from './store-name-check';
import { createStoreTakenMembraneHook } from './create-store-taken-membrane-hook';


export const createStore = storeConfig => {
  storeNameCheck(storeConfig.name);
  const storeHasMembrane = membrane[storeConfig.name];
  if (storeHasMembrane) {
    return createStoreTakenMembraneHook(storeConfig, storeHasMembrane);
  }
  return createStoreHook(storeConfig);
};
