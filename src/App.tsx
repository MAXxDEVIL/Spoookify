import { type ReactNode } from 'react'
import { BrowserRouter, Navigate, NavLink, Route, Routes, useLocation } from 'react-router-dom'
import { Search as SearchIcon, Settings as SettingsIcon } from 'lucide-react'
import PlayerBar from './components/PlayerBar'
import Album from './pages/Album'
import Search from './pages/Search'
import Settings from './pages/Settings'
import { PlayerProvider } from './state/player'
import { ServerProvider, useServer } from './state/server'

export default function App() {
  return (
    <BrowserRouter>
      <ServerProvider>
        <PlayerProvider>
          <Shell />
        </PlayerProvider>
      </ServerProvider>
    </BrowserRouter>
  )
}

function Shell() {
  const { config } = useServer()
  const { pathname } = useLocation()

  if (!config && pathname !== '/settings') return <Navigate to="/settings" replace />

  return (
    <div className="grid h-dvh grid-rows-[minmax(0,1fr)_auto]">
      <div className="grid min-h-0 grid-cols-[56px_minmax(0,1fr)] sm:grid-cols-[224px_minmax(0,1fr)]">
        <nav aria-label="Main" className="flex flex-col gap-1 border-r border-border bg-surface p-2 sm:p-3">
          <p className="hidden px-2 py-3 text-sm font-semibold sm:block">Spoookify</p>
          <NavItem to="/search" icon={<SearchIcon size={20} />} label="Search" />
          <NavItem to="/settings" icon={<SettingsIcon size={20} />} label="Settings" />
        </nav>

        <main className="min-h-0 overflow-y-auto p-4 sm:p-8">
          <Routes>
            <Route path="/" element={<Navigate to="/search" replace />} />
            <Route path="/search" element={<Search />} />
            <Route path="/album/:id" element={<Album />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/search" replace />} />
          </Routes>
        </main>
      </div>

      <PlayerBar />
    </div>
  )
}

function NavItem({ to, icon, label }: { to: string; icon: ReactNode; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-md px-3 py-2 text-sm ${
          isActive ? 'bg-surface-2 text-text' : 'text-text-muted hover:text-text'
        }`
      }
    >
      <span aria-hidden="true">{icon}</span>
      <span className="hidden sm:inline">{label}</span>
      <span className="sr-only sm:hidden">{label}</span>
    </NavLink>
  )
}
