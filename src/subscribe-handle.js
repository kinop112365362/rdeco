import { combination } from './combination'
// eslint-disable-next-line valid-jsdoc
export function subscribeHandle(name, subscribe) {
  const targetComponentKeys = Object.keys(subscribe)
  targetComponentKeys.forEach((targetComponentKey) => {
    const eventKeys = Object.keys(subscribe[targetComponentKey])
    eventKeys.forEach((eventKey) => {
      if (eventKey === 'state') {
        const handle = subscribe[targetComponentKey][eventKey]
        return combination.$addDep(name, {
          eventName: `${targetComponentKey}_state_finaly`,
          handle,
        })
      } else {
        const eventKeys = Object.keys(subscribe[targetComponentKey][eventKey])
        return eventKeys.forEach((fnKey) => {
          const handle = subscribe[targetComponentKey][eventKey][fnKey]
          return combination.$addDep(name, {
            eventName: `${targetComponentKey}_${eventKey}_${fnKey}`,
            handle,
          })
        })
      }
    })
  })
}
