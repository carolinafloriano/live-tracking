import Map from './components/Map';
import BoatList from './components/BoatList';
import BoatDetail from './components/BoatDetail';
import { useBoatSimulation } from './hooks/useBoatSimulation';
import { RACE_CONFIG } from './data/mockData';

function SailIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3 L12 20 L20 16 Z" fill="#00d4ff" opacity="0.9" />
      <path d="M12 7 L12 18 L6 15 Z" fill="#4fc3f7" opacity="0.7" />
      <line x1="4" y1="20" x2="20" y2="20" stroke="#00d4ff" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function LiveDot() {
  return (
    <div className="live-badge">
      <span className="live-dot" />
      <span>LIVE</span>
    </div>
  );
}

function Timestamp({ date }) {
  const t = date.toLocaleTimeString('pt-PT', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  return (
    <div className="last-update">
      ÚLTIMA ACTUALIZAÇÃO&nbsp;
      <span className="last-update__time">{t}</span>
    </div>
  );
}

export default function App() {
  const { boats, lastUpdate, selectedBoat, selectBoat } = useBoatSimulation();

  return (
    <div className="app">
      <header className="app-header">
        <div className="app-header__brand">
          <SailIcon />
          <h1 className="app-header__title">{RACE_CONFIG.name}</h1>
          <span className="app-header__leg">{RACE_CONFIG.leg}</span>
          <LiveDot />
        </div>
        <Timestamp date={lastUpdate} />
      </header>

      <div className="app-body">
        <aside className="sidebar">
          <BoatList
            boats={boats}
            selectedBoatId={selectedBoat?.id}
            onBoatSelect={selectBoat}
          />
          <BoatDetail boat={selectedBoat} onClose={() => selectBoat(selectedBoat?.id)} />
        </aside>

        <main className="map-wrap">
          <Map boats={boats} selectedBoat={selectedBoat} onBoatSelect={selectBoat} />
        </main>
      </div>
    </div>
  );
}
