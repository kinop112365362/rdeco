import { ReplaySubject } from 'rxjs'

export const createStoreCubject = new ReplaySubject(20)
export const stateSubject = new ReplaySubject(20)
export const viewSubject = new ReplaySubject(20)
export const controllerSubject = new ReplaySubject(20)
export const serviceSubject = new ReplaySubject(20)
export const hooksSubject = new ReplaySubject(99)
