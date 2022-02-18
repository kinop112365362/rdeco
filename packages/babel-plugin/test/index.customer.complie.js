import { loadRemoteConfig } from '@afe/browser-runtime-loader';

/* eslint-disable import/no-unresolved */

/* eslint-disable no-unused-vars */

/* eslint-disable no-undef */
loadRemoteConfig({
  appCode: "hrss-component",
  name: "hrss-data-model",
  type: 'js'
});
const helloFooo2 = rdeco.inject("@hrss-component-hrss-data-model/hello-fooo-2");
const foo = rdeco.inject("@hrss-component-hrss-data-model/foo");
import lodash from 'lodash';
loadRemoteConfig({
  appCode: "hrss-component",
  name: "hrss-data-model1",
  type: 'js'
});
const helloFooo = rdeco.inject("@hrss-component-hrss-data-model1/hello-fooo");
const foo1 = rdeco.inject("@hrss-component-hrss-data-model1/foo-1");
import React from 'react';
foo.api('hello');
