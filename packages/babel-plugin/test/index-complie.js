/* eslint-disable import/no-unresolved */

/* eslint-disable no-unused-vars */

/* eslint-disable no-undef */
import lodash from 'lodash';
import React from 'react';
import React3 from 'react-dom';
import { createComponent, create } from '@rdeco/web-app-sdk';
import * as axios from "axios";
import * as dplReact from "dpl-react";
import { loadRemoteConfig } from '@afe/browser-runtime-loader';
loadRemoteConfig({
  appCode: "hrss-component",
  name: "hrss-data-model1",
  type: 'js'
});
loadRemoteConfig({
  appCode: "hrss-component",
  name: "hrss-data-model",
  type: 'js'
});
window.axios = axios;
window.dplReact = dplReact;
const helloFooo = rdeco.inject("@hrss-component-hrss-data-model1/hello-fooo");
const foo1 = rdeco.inject("@hrss-component-hrss-data-model1/foo-1");
const helloFooo2 = rdeco.inject("@hrss-component-hrss-data-model/hello-fooo-2");
const foo = rdeco.inject("@hrss-component-hrss-data-model/foo");
createComponent({
  name: @hrss-component-hrss-data-model/hello-fooo,
  view: {
    render() {
      return null;
    }

  }
});
createComponent({
  name: @hrss-component-hrss-data-model/hello-fooo-2,
  view: {
    render() {
      return null;
    }

  }
});
create({
  name: @hrss-component-hrss-data-model/foo,
  controller: {
    onMount() {
      console.log('MYModule');
    }

  }
});
