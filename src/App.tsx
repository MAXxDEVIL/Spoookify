import { type ReactNode } from 'react'
import { BrowserRouter, Navigate, NavLink, Route, Routes, useLocation } from 'react-router-dom'
import {
  Heart,
  Home as HomeIcon,
  Library as LibraryIcon,
  Search as SearchIcon,
  Settings as SettingsIcon,
} from 'lucide-react'
import PlayerBar from './components/PlayerBar'
import Album from './pages/Album'
import Artist from './pages/Artist'
import Home from './pages/Home'
import Library from './pages/Library'
import Liked from './pages/Liked'
import Playlist from './pages/Playlist'
import Search from './pages/Search'
import Settings from './pages/Settings'
import { PlayerProvider } from './state/player'
import { ServerProvider, useServer } from './state/server'
import { StarredProvider } from './state/starred'

export default function App() {
  return (
    <BrowserRouter>
      <ServerProvider>
        <PlayerProvider>
          <StarredProvider>
            <Shell />
          </StarredProvider>
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
          <p className="hidden px-2 py-3 text-sm font-semibold sm:block">Wholecrate</p>
          <NavItem to="/" end icon={<HomeIcon size={20} />} label="Home" />
          <NavItem to="/search" icon={<SearchIcon size={20} />} label="Search" />
          <NavItem to="/library" icon={<LibraryIcon size={20} />} label="Library" />
          <NavItem to="/liked" icon={<Heart size={20} />} label="Liked" />
          <NavItem to="/settings" icon={<SettingsIcon size={20} />} label="Settings" />
        </nav>

        <main className="min-h-0 overflow-y-auto p-4 sm:p-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/library" element={<Library />} />
            <Route path="/liked" element={<Liked />} />
            <Route path="/album/:id" element={<Album />} />
            <Route path="/artist/:id" element={<Artist />} />
            <Route path="/playlist/:id" element={<Playlist />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>

      <PlayerBar />
    </div>
  )
}

function NavItem({
  to,
  end,
  icon,
  label,
}: {
  to: string
  end?: boolean
  icon: ReactNode
  label: string
}) {
  return (
    <NavLink
      to={to}
      end={end}
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
