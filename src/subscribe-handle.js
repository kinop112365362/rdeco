import { combination } from './combination'

// import cloneDeep from 'lodash.clonedeep'
// eslint-disable-next-line valid-jsdoc
export function subscribeHandle(name, subscribe) {
  const targetComponentKeys = Object.keys(subscribe)
  targetComponentKeys.forEach((targetComponentKey) => {
    const eventKeys = Object.keys(subscribe[targetComponentKey])
    eventKeys.forEach((eventKey) => {
      const handle = subscribe[targetComponentKey][eventKey]
      if (eventKey === 'state') {
        combination.$addDep(name, {
          eventName: `${targetComponentKey}_state_finaly`,
          handle,
        })
      } else {
        combination.$addDep(name, {
          eventName: `${targetComponentKey}_controller_${eventKey}`,
          handle,
        })
      }
    })
  })
}
