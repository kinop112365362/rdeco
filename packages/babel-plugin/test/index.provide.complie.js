/* eslint-disable import/no-unresolved */

/* eslint-disable no-unused-vars */

/* eslint-disable no-undef */
import { createComponent, create, ReqComponent } from '@rdeco/web-app-sdk';
import React from 'react'; // import {scope} from '@/contanst'

const helloFooo = req("@hrss-component/data-model/hello-fooo");
const helloFooo1 = inject("@hrss-component/data-model/hello-fooo");

const Comp = () => {
  return /*#__PURE__*/React.createElement(ReqComponent, {
    name: "@hrss-component/data-model/hello-fff"
  });
};

createComponent({
  name: "@hrss-component/data-model/hello-fooo",
  service: {
    createDataModel(dataModelName) {
      create({
        name: dataModelName,
        subscribe: {
          "@hrss-component/data-model/ttt2": {
            event() {}

          },
          "@hrss-component/data-model/tt12": {}
        },
        state: {
          view: {},
          onEnd: c => c,
          data: [],
          selectList: new Set(),
          selectData: [],
          disabled: false,
          currentDragData: null,
          checkable: true,
          onCheck: () => {},
          renderContent: c => c,
          checkedKeys: [],
          cssStyle: {
            itme: '',
            checkbox: `
            position: @scope/absolute;
            left: 12px;`
          },
          isInit: true
        },
        service: {
          filterByKey(data, list, target) {
            data.forEach(d => {
              if (list.has(d.key)) {
                const newDate = { ...d,
                  children: []
                };
                target.push(newDate);

                if (d.children) {
                  this.service.filterByKey(d.children, list, newDate.children);
                }
              }
            });
            return target;
          }

        },
        exports: {
          modify([path, key, value]) {
            const target = get(this.state, path);

            if (target) {
              target[key] = value;
            }
          },

          setCssStyle([css]) {
            if (css) {
              this.setter.cssStyle(css);
            }
          },

          setView([view]) {
            if (view) {
              this.setter.view(view);
            }
          },

          sortData([data]) {
            this.state.onEnd(data);
            this.setter.data(data);
          },

          setOnEnd([onEnd]) {
            if (onEnd) {
              this.state.onEnd = onEnd;
            }
          },

          setCheckedKeys([checkedKeys]) {
            this.state.checkedKeys = checkedKeys || [];
          },

          setOnCheck([onCheck, checkable]) {
            if (checkable) {
              this.state.onCheck = debounce(onCheck, 100);
            }
          },

          setRenderContent([fn]) {
            if (fn) {
              this.state.renderContent = fn;
            }
          },

          setData([data]) {
            this.setter.data(data);
          },

          setCheckable([checkable]) {
            this.setter.checkable(checkable);
          },

          disabled([disabled]) {
            this.setter.disabled(disabled);
          },

          delete([key]) {
            this.state.selectList.delete(key);
          },

          add([key]) {
            this.state.selectList.add(key);
          },

          filterSelectData: throttle(function () {
            const selectData = this.service.filterByKey(this.state.data, this.state.selectList, []);
            this.setter.selectData(selectData);
            this.state.onCheck([this.state.selectData, Array.from(this.state.selectList)]);
          }, 100)
        }
      });
    }

  },
  view: {
    render() {
      return null;
    }

  }
});
createComponent({
  name: "@hrss-component/data-model/hello-fooo",
  subscribe: {
    "@hrss-component/data-model/ttt": {
      event: {
        helaoo() {}

      }
    },
    "@hrss-component/data-model/tt1": {}
  },
  view: {
    render() {
      return null;
    }

  }
});
createMembrane({
  name: "@hrss-component/data-model/hello-fooo2",
  view: {
    render() {
      return null;
    }

  }
});
create({
  name: "@hrss-component/data-model/foo",
  subscribe: {
    "@hrss-component/data-model/ttt3": {
      event() {}

    },
    "@hrss-component/data-model/tt14": {}
  },
  controller: {
    onMount() {
      console.log('MYModule');
    }

  }
});
