import { ReplaySubject, BehaviorSubject } from 'rxjs'

export const createStoreSubject = new ReplaySubject(20)
export const connectSubject = new BehaviorSubject('null')
