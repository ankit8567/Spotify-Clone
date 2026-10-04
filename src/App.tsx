/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { MusicProvider, useMusic } from './context/MusicContext';
import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import { Player } from './components/layout/Player';
import { HomeView } from './components/views/HomeView';
import { SearchView } from './components/views/SearchView';
import { PlaylistView } from './components/views/PlaylistView';
import { ArtistView } from './components/views/ArtistView';
import { ProfileView } from './components/views/ProfileView';
import { PremiumView } from './components/views/PremiumView';
import { LyricsView } from './components/views/LyricsView';
import { EqualizerModal } from './components/modals/EqualizerModal';
import { DeviceModal } from './components/modals/DeviceModal';
import { QueueModal } from './components/modals/QueueModal';
import { EditPlaylistModal } from './components/modals/EditPlaylistModal';
import { CheckoutModal } from './components/modals/CheckoutModal';
import { OfflineAlertModal } from './components/modals/OfflineAlertModal';

const MainLayout: React.FC = () => {
  const { currentView, isLyricsOpen } = useMusic();

  const renderActiveView = () => {
    switch (currentView) {
      case 'home':
        return <HomeView />;
      case 'search':
        return <SearchView />;
      case 'playlist':
        return <PlaylistView />;
      case 'artist':
        return <ArtistView />;
      case 'profile':
        return <ProfileView />;
      case 'premium':
        return <PremiumView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-black text-white font-sans">
      {/* Upper viewport: Sidebar + Main Content Frame */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* Left Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#121212] rounded-lg my-2 mr-2 overflow-hidden relative shadow-inner">
          {/* Top Bar */}
          <TopBar />

          {/* Scrollable View Container */}
          <main
            id="main-scroll-container"
            className="flex-1 overflow-y-auto overflow-x-hidden relative"
          >
            {renderActiveView()}
          </main>
        </div>
      </div>

      {/* Sticky Bottom Audio Player */}
      <Player />

      {/* Overlays and Modals */}
      {isLyricsOpen && <LyricsView />}
      <EqualizerModal />
      <DeviceModal />
      <QueueModal />
      <EditPlaylistModal />
      <CheckoutModal />
      <OfflineAlertModal />
    </div>
  );
};

export default function App() {
  return (
    <MusicProvider>
      <MainLayout />
    </MusicProvider>
  );
}
