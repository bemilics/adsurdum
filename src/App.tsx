import { useState } from 'react'
import { TabBar, type TabId } from './components/TabBar'
import { Feed } from './views/Feed'
import { Explore } from './views/Explore'
import { Reels } from './views/Reels'
import { GhostPersona } from './views/GhostPersona'
import { Transparency } from './views/Transparency'

export default function App() {
  const [tab, setTab] = useState<TabId>('feed')

  return (
    <div className="flex min-h-dvh flex-col bg-void text-paper">
      <main className="flex-1 overflow-hidden">
        {tab === 'feed' && <Feed />}
        {tab === 'explore' && <Explore />}
        {tab === 'reels' && <Reels />}
        {tab === 'persona' && <GhostPersona />}
        {tab === 'transparency' && <Transparency />}
      </main>
      <TabBar active={tab} onChange={setTab} />
    </div>
  )
}
