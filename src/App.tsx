import './App.css'
import ShinyOfflineDatensynchr from './ShinyOfflineDatensynchr'

import { useEffect } from 'react';
import { Workbox } from 'workbox-window';

function App() {

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      const workbox = new Workbox('/sw.js');

      workbox.addEventListener('installed', (event) => {
        if (event.isUpdate) {
            console.log('A new service worker has been installed.');
        }
      });

      workbox.addEventListener('waiting', () => {
        console.log('A new service worker is waiting to activate.');
        // Optionally, prompt the user to update
        if (confirm('New version available. Update?')) {
          workbox.messageSW({ type: 'SKIP_WAITING' });
        }
      });

      workbox.addEventListener('controlling', () => {
        console.log('A new service worker is taking control.');
        window.location.reload();
      });

      workbox.register();
    }
  }, []);

  return (
    <>
        <h1>Shiny Offline Datensynchr</h1>
        <ShinyOfflineDatensynchr />
    </>
  )
}

export default App
