import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { loadConfig, saveConfig, type ServerConfig } from '../lib/subsonic'

type ServerApi = {
  config: ServerConfig | null
  setConfig: (config: ServerConfig | null) => void
}

const ServerContext = createContext<ServerApi | null>(null)

export function ServerProvider({ children }: { children: ReactNode }) {
  const [config, setConfigState] = useState<ServerConfig | null>(loadConfig)

  const value = useMemo<ServerApi>(
    () => ({
      config,
      setConfig: (next) => {
        saveConfig(next)
        setConfigState(next)
      },
    }),
    [config],
  )

  return <ServerContext.Provider value={value}>{children}</ServerContext.Provider>
}

export function useServer() {
  const context = useContext(ServerContext)
  if (!context) throw new Error('useServer must be used inside ServerProvider')
  return context
}
