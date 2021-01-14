import React from 'react';
import { createStore } from './create-store';

export const AppContext = React.createContext();

export function createStoreContext(storeConfig) {
  storeConfig.name = 'storeContext';
  return createStore(storeConfig);
}