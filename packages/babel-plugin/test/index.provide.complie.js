/* eslint-disable import/no-unresolved */

/* eslint-disable no-unused-vars */

/* eslint-disable no-undef */
import { createComponent, create } from '@rdeco/web-app-sdk' // import {scope} from '@/contanst'

const helloFooo = req('@hrss-component/hrss-data-model/hello-fooo')
createComponent({
  name: '@hrss-component/hrss-data-model/hello-fooo',
  service: {
    createDataModel(dataModelName) {
      create({
        name: dataModelName,
        state: {
          view: {},
          onEnd: (c) => c,
          data: [],
          selectList: new Set(),
          selectData: [],
          disabled: false,
          currentDragData: null,
          checkable: true,
          onCheck: () => {},
          renderContent: (c) => c,
          checkedKeys: [],
          cssStyle: {
            itme: '',
            checkbox: `
            position: absolute;
            left: 12px;`,
          },
          isInit: true,
        },
        service: {
          filterByKey(data, list, target) {
            data.forEach((d) => {
              if (list.has(d.key)) {
                const newDate = { ...d, children: [] }
                target.push(newDate)

                if (d.children) {
                  this.service.filterByKey(d.children, list, newDate.children)
                }
              }
            })
            return target
          },
        },
        exports: {
          modify([path, key, value]) {
            const target = get(this.state, path)

            if (target) {
              target[key] = value
            }
          },

          setCssStyle([css]) {
            if (css) {
              this.setter.cssStyle(css)
            }
          },

          setView([view]) {
            if (view) {
              this.setter.view(view)
            }
          },

          sortData([data]) {
            this.state.onEnd(data)
            this.setter.data(data)
          },

          setOnEnd([onEnd]) {
            if (onEnd) {
              this.state.onEnd = onEnd
            }
          },

          setCheckedKeys([checkedKeys]) {
            this.state.checkedKeys = checkedKeys || []
          },

          setOnCheck([onCheck, checkable]) {
            if (checkable) {
              this.state.onCheck = debounce(onCheck, 100)
            }
          },

          setRenderContent([fn]) {
            if (fn) {
              this.state.renderContent = fn
            }
          },

          setData([data]) {
            this.setter.data(data)
          },

          setCheckable([checkable]) {
            this.setter.checkable(checkable)
          },

          disabled([disabled]) {
            this.setter.disabled(disabled)
          },

          delete([key]) {
            this.state.selectList.delete(key)
          },

          add([key]) {
            this.state.selectList.add(key)
          },

          filterSelectData: throttle(function () {
            const selectData = this.service.filterByKey(
              this.state.data,
              this.state.selectList,
              []
            )
            this.setter.selectData(selectData)
            this.state.onCheck([
              this.state.selectData,
              Array.from(this.state.selectList),
            ])
          }, 100),
        },
      })
    },
  },
  view: {
    render() {
      return null
    },
  },
})
createComponent({
  name: '@hrss-component/hrss-data-model/hello-fooo',
  view: {
    render() {
      return null
    },
  },
})
createComponent({
  name: '@hrss-component/hrss-data-model/hello-fooo2',
  view: {
    render() {
      return null
    },
  },
})
create({
  name: '@hrss-component/hrss-data-model/foo',
  controller: {
    onMount() {
      console.log('MYModule')
    },
  },
})
