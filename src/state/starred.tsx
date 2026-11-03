import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { getStarred, star, unstar, type Track } from '../lib/subsonic'
import { useServer } from './server'

type StarredApi = {
  ids: Set<string>
  pending: Set<string>
  toggle: (track: Track) => void
}

const StarredContext = createContext<StarredApi | null>(null)

export function StarredProvider({ children }: { children: ReactNode }) {
  const { config } = useServer()
  const [ids, setIds] = useState<Set<string>>(new Set())
  const [pending, setPending] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (!config) return
    let cancelled = false
    getStarred(config)
      .then((songs) => {
        if (!cancelled) setIds(new Set(songs.map((song) => song.id)))
      })
      .catch(() => {
        // The heart simply stays empty; a failed write below is a no-op too.
      })
    return () => {
      cancelled = true
    }
  }, [config])

  async function toggle(track: Track) {
    if (!config || pending.has(track.id)) return
    const starred = ids.has(track.id)
    setPending((prev) => new Set(prev).add(track.id))
    try {
      await (starred ? unstar(config, track.id) : star(config, track.id))
      setIds((prev) => {
        const next = new Set(prev)
        if (starred) next.delete(track.id)
        else next.add(track.id)
        return next
      })
    } catch {
      // Leave the set untouched; the next click retries.
    } finally {
      setPending((prev) => {
        const next = new Set(prev)
        next.delete(track.id)
        return next
      })
    }
  }

  return (
    <StarredContext.Provider value={{ ids, pending, toggle }}>{children}</StarredContext.Provider>
  )
}

export function useStarred() {
  const context = useContext(StarredContext)
  if (!context) throw new Error('useStarred must be used inside StarredProvider')
  return context
}
