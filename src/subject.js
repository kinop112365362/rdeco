import { BehaviorSubject, AsyncSubject, ReplaySubject } from 'rxjs'

export const subject = new ReplaySubject(20)
export const asyncSubject = new AsyncSubject('null')
export const connectSubject = new BehaviorSubject('null')
