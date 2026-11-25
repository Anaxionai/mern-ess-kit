import { describe, it } from 'vitest'

// Unit tests for searchSchema. Run them with: npm test
// TODO(task 9): import searchSchema from './searchSchema', write each case,
// and change `it.skip` to `it` as you go.
describe('searchSchema', () => {
  it.skip('accepts a valid search', () => {
    throw new Error('TODO(task 9): parse NDLS to BCT on a future date and expect success')
  })

  it.skip('makes lowercase station codes uppercase', () => {
    throw new Error('TODO(task 9): parse lowercase codes and expect them in uppercase')
  })

  it.skip('refuses the same station twice', () => {
    throw new Error('TODO(task 9): expect a failure with a message on the "to" field')
  })

  it.skip('refuses a date in the past', () => {
    throw new Error('TODO(task 9): expect a failure for a date before today')
  })

  it.skip("refuses the input the AI's schema let through", () => {
    throw new Error("TODO(task 9): the input from your AI_LOG.md entry, and the failure you expect")
  })
})
