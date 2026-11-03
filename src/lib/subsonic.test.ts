import { describe, expect, it } from 'vitest'
import { coverUrl, endpoint, normalizeUrl, streamUrl } from './subsonic'

const config = { url: 'https://music.example.com', user: 'ada', password: 'p' }

describe('subsonic urls', () => {
  it('normalises trailing slashes and an accidental /rest', () => {
    expect(normalizeUrl('https://music.example.com/rest/')).toBe('https://music.example.com')
    expect(normalizeUrl('  https://music.example.com/  ')).toBe('https://music.example.com')
  })

  it('builds an authenticated json endpoint', () => {
    const url = new URL(endpoint(config, 'ping'))
    expect(url.pathname).toBe('/rest/ping')
    expect(url.searchParams.get('u')).toBe('ada')
    expect(url.searchParams.get('p')).toBe('p')
    expect(url.searchParams.get('v')).toBe('1.16.1')
    expect(url.searchParams.get('f')).toBe('json')
  })

  it('streams mp3 and drops empty covers', () => {
    expect(new URL(streamUrl(config, 'tr-1')).searchParams.get('format')).toBe('mp3')
    expect(coverUrl(config, undefined)).toBe('')
    expect(new URL(coverUrl(config, 'al-1')).searchParams.get('size')).toBe('300')
  })
})
