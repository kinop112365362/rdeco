import { ReplaySubject, BehaviorSubject } from 'rxjs'

export const createStoreSubject = new ReplaySubject(20)
export const stateSubject = new ReplaySubject(20)
export const viewSubject = new ReplaySubject(20)
export const controllerSubject = new ReplaySubject(20)
export const serviceSubject = new ReplaySubject(20)
export const hooksSubject = new ReplaySubject(99)
export const connectSubject = new BehaviorSubject('null')
