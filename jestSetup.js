import { requestIdleCallback } from '@shopify/jest-dom-mocks'

window.requestIdleCallback = jest.fn((x) => x)
