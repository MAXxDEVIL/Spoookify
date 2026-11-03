import { describe, expect, it } from 'vitest'
import { initialState, reducer, type PlayerState } from './player'

const track = (id: string, duration = 100) => ({ id, title: id, duration })

const seeded: PlayerState = {
  ...initialState,
  queue: [track('a'), track('b'), track('c')],
  index: 0,
  playing: true,
}

describe('player reducer', () => {
  it('clamps a seek to the track bounds', () => {
    expect(reducer(seeded, { type: 'seek', ms: -5 }).positionMs).toBe(0)
    expect(reducer(seeded, { type: 'seek', ms: 999_999 }).positionMs).toBe(100_000)
  })

  it('wraps on next only when repeat is all', () => {
    const last = { ...seeded, index: 2 }
    expect(reducer(last, { type: 'next' })).toMatchObject({ index: 2, playing: false })
    expect(reducer({ ...last, repeat: 'all' }, { type: 'next' })).toMatchObject({
      index: 0,
      playing: true,
    })
  })

  it('shuffle keeps the current track loaded and the same set', () => {
    const shuffled = reducer({ ...seeded, index: 1 }, { type: 'shuffle' })
    expect(shuffled.shuffle).toBe(true)
    expect(shuffled.queue[0].id).toBe('b')
    expect(shuffled.index).toBe(0)
    expect(shuffled.queue.map((t) => t.id).sort()).toEqual(['a', 'b', 'c'])
  })
})
