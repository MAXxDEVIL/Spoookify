import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useRef,
  type ReactNode,
} from 'react'
import { streamUrl, type Track } from '../lib/subsonic'
import { useServer } from './server'

export type Repeat = 'off' | 'all' | 'one'

export type PlayerState = {
  queue: Track[]
  index: number
  playing: boolean
  positionMs: number
  volume: number
  shuffle: boolean
  repeat: Repeat
  seq: number
}

export const initialState: PlayerState = {
  queue: [],
  index: 0,
  playing: false,
  positionMs: 0,
  volume: 0.8,
  shuffle: false,
  repeat: 'off',
  seq: 0,
}

export type Action =
  | { type: 'play'; tracks: Track[]; start: number }
  | { type: 'toggle' }
  | { type: 'next' }
  | { type: 'prev' }
  | { type: 'seek'; ms: number }
  | { type: 'progress'; ms: number }
  | { type: 'ended' }
  | { type: 'volume'; volume: number }
  | { type: 'shuffle' }
  | { type: 'repeat' }

const PLAYER_KEY = 'spoookify.player'

function clampPosition(ms: number, track?: Track) {
  const floor = Math.max(0, ms)
  const ceiling = (track?.duration ?? 0) * 1000
  return ceiling > 0 ? Math.min(floor, ceiling) : floor
}

function shuffleList<T>(list: T[]) {
  const out = [...list]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

export function reducer(state: PlayerState, action: Action): PlayerState {
  switch (action.type) {
    case 'play': {
      if (!action.tracks.length) return state
      const same = state.queue[state.index]?.id === action.tracks[action.start]?.id
      return {
        ...state,
        queue: action.tracks,
        index: action.start,
        positionMs: 0,
        playing: true,
        seq: same ? state.seq + 1 : state.seq,
      }
    }
    case 'toggle':
      return state.queue.length ? { ...state, playing: !state.playing } : state
    case 'next': {
      if (!state.queue.length) return state
      if (state.index < state.queue.length - 1) {
        return { ...state, index: state.index + 1, positionMs: 0, playing: true }
      }
      if (state.repeat === 'all') {
        return { ...state, index: 0, positionMs: 0, playing: true }
      }
      return { ...state, playing: false, positionMs: 0 }
    }
    case 'prev': {
      if (!state.queue.length) return state
      if (state.positionMs > 3000) return { ...state, positionMs: 0 }
      if (state.index > 0) return { ...state, index: state.index - 1, positionMs: 0, playing: true }
      if (state.repeat === 'all') {
        return { ...state, index: state.queue.length - 1, positionMs: 0, playing: true }
      }
      return { ...state, positionMs: 0 }
    }
    case 'seek':
      return { ...state, positionMs: clampPosition(action.ms, state.queue[state.index]) }
    case 'progress':
      return { ...state, positionMs: action.ms }
    case 'ended':
      if (state.repeat === 'one') return { ...state, positionMs: 0, playing: true }
      return reducer(state, { type: 'next' })
    case 'volume':
      return { ...state, volume: Math.min(1, Math.max(0, action.volume)) }
    case 'shuffle': {
      const shuffle = !state.shuffle
      if (!shuffle || !state.queue.length) return { ...state, shuffle }
      const current = state.queue[state.index]
      const rest = state.queue.filter((_, i) => i !== state.index)
      return { ...state, shuffle, queue: [current, ...shuffleList(rest)], index: 0 }
    }
    case 'repeat': {
      const order: Repeat[] = ['off', 'all', 'one']
      return { ...state, repeat: order[(order.indexOf(state.repeat) + 1) % order.length] }
    }
    default:
      return state
  }
}

function restore(): PlayerState {
  try {
    const raw = localStorage.getItem(PLAYER_KEY)
    if (!raw) return initialState
    const saved = JSON.parse(raw) as Partial<PlayerState>
    if (!Array.isArray(saved.queue)) return initialState
    return { ...initialState, ...saved, playing: false, seq: 0 }
  } catch {
    return initialState
  }
}

type PlayerApi = {
  state: PlayerState
  play: (tracks: Track[], start?: number) => void
  toggle: () => void
  next: () => void
  prev: () => void
  seek: (ms: number) => void
  setVolume: (volume: number) => void
  toggleShuffle: () => void
  cycleRepeat: () => void
}

const PlayerContext = createContext<PlayerApi | null>(null)

export function PlayerProvider({ children }: { children: ReactNode }) {
  const { config } = useServer()
  const [state, dispatch] = useReducer(reducer, undefined, restore)
  const audioRef = useRef<HTMLAudioElement>(null)
  const current = state.queue[state.index]

  // Load a track only when its identity changes; positionMs is read, never watched.
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !current || !config) return
    audio.src = streamUrl(config, current.id)
    audio.currentTime = state.positionMs / 1000
    if (state.playing) void audio.play().catch(() => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current?.id, state.seq, config])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !current) return
    if (state.playing) {
      if (audio.paused) void audio.play().catch(() => {})
    } else if (!audio.paused) {
      audio.pause()
    }
  }, [state.playing, current])

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = state.volume
  }, [state.volume])

  const latest = useRef(state)
  latest.current = state

  useEffect(() => {
    const save = () => {
      const now = latest.current
      if (now.queue.length) localStorage.setItem(PLAYER_KEY, JSON.stringify({ ...now, seq: 0 }))
    }
    const timer = window.setInterval(save, 5000)
    window.addEventListener('pagehide', save)
    return () => {
      window.clearInterval(timer)
      window.removeEventListener('pagehide', save)
      save()
    }
  }, [])

  const api: PlayerApi = {
    state,
    play: (tracks, start = 0) => dispatch({ type: 'play', tracks, start }),
    toggle: () => dispatch({ type: 'toggle' }),
    next: () => dispatch({ type: 'next' }),
    prev: () => dispatch({ type: 'prev' }),
    seek: (ms) => dispatch({ type: 'seek', ms }),
    setVolume: (volume) => dispatch({ type: 'volume', volume }),
    toggleShuffle: () => dispatch({ type: 'shuffle' }),
    cycleRepeat: () => dispatch({ type: 'repeat' }),
  }

  return (
    <PlayerContext.Provider value={api}>
      <audio
        ref={audioRef}
        preload="metadata"
        onTimeUpdate={(event) =>
          dispatch({ type: 'progress', ms: event.currentTarget.currentTime * 1000 })
        }
        onEnded={() => {
          if (state.repeat === 'one') {
            const audio = audioRef.current
            if (audio) {
              audio.currentTime = 0
              void audio.play().catch(() => {})
            }
            dispatch({ type: 'progress', ms: 0 })
          } else {
            dispatch({ type: 'ended' })
          }
        }}
      />
      {children}
    </PlayerContext.Provider>
  )
}

export function usePlayer() {
  const context = useContext(PlayerContext)
  if (!context) throw new Error('usePlayer must be used inside PlayerProvider')
  return context
}
