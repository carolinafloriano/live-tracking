import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { RACE_CONFIG } from '../data/mockData';

function createBoatIcon(boat, isSelected) {
  const size = isSelected ? 40 : 32;
  const c = boat.color;
  const h = boat.heading;
  const ring = isSelected
    ? `<circle cx="20" cy="20" r="18" fill="none" stroke="${c}" stroke-width="2" opacity="0.5"/>
       <circle cx="20" cy="20" r="22" fill="none" stroke="${c}" stroke-width="1" opacity="0.25"/>`
    : '';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 40 40">
    ${ring}
    <g transform="translate(20,20) rotate(${h})">
      <polygon points="0,-13 -7,9 0,5 7,9"
        fill="${c}"
        stroke="${isSelected ? '#ffffff' : 'rgba(5,15,30,0.85)'}"
        stroke-width="${isSelected ? 2 : 1.5}"
        stroke-linejoin="round"/>
    </g>
    <circle cx="20" cy="20" r="8" fill="${isSelected ? 'rgba(0,212,255,0.25)' : 'rgba(5,15,30,0.75)'}"/>
    <text x="20" y="24" text-anchor="middle" font-size="9" font-weight="bold"
      fill="${isSelected ? '#ffffff' : c}" font-family="'Courier New',monospace">${boat.rank}</text>
  </svg>`;

  return L.divIcon({
    html: svg,
    className: '',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2 - 4],
  });
}

const FINISH_ICON = L.divIcon({
  html: `<svg xmlns="http://www.w3.org/2000/svg" width="26" height="34" viewBox="0 0 26 34">
    <line x1="3" y1="2" x2="3" y2="34" stroke="#ff6b6b" stroke-width="2.5"/>
    <rect x="3" y="2" width="23" height="8" fill="#ff6b6b"/>
    <rect x="3" y="10" width="23" height="8" fill="#ffffff" opacity="0.85"/>
    <rect x="3" y="18" width="23" height="8" fill="#ff6b6b"/>
    <rect x="3" y="26" width="23" height="8" fill="#ffffff" opacity="0.85"/>
  </svg>`,
  className: '',
  iconSize: [26, 34],
  iconAnchor: [3, 34],
  popupAnchor: [10, -36],
});

// Updates the icon via the Leaflet API when boat state changes
function BoatMarker({ boat, isSelected, onSelect }) {
  const markerRef = useRef(null);

  useEffect(() => {
    markerRef.current?.setIcon(createBoatIcon(boat, isSelected));
  }, [boat.heading, boat.rank, isSelected, boat.color, boat]);

  return (
    <Marker
      ref={markerRef}
      position={[boat.lat, boat.lng]}
      icon={createBoatIcon(boat, isSelected)}
      eventHandlers={{ click: () => onSelect(boat.id) }}
    >
      <Popup className="boat-popup">
        <div className="popup-inner">
          <span className="popup-rank" style={{ color: boat.color }}>#{boat.rank}</span>
          <strong className="popup-name">{boat.name}</strong>
          <span className="popup-sail">{boat.sail}</span>
          <div className="popup-stats">
            <span>{boat.speed.toFixed(1)} kn</span>
            <span>{boat.distToFinish?.toFixed(1)} nm</span>
          </div>
        </div>
      </Popup>
    </Marker>
  );
}

function FlyToSelected({ selectedBoat }) {
  const map = useMap();
  useEffect(() => {
    if (selectedBoat) {
      map.flyTo([selectedBoat.lat, selectedBoat.lng], Math.max(map.getZoom(), 11), {
        animate: true,
        duration: 0.8,
      });
    }
  }, [selectedBoat?.id, map]);
  return null;
}

export default function Map({ boats, selectedBoat, onBoatSelect }) {
  return (
    <MapContainer
      center={[RACE_CONFIG.center.lat, RACE_CONFIG.center.lng]}
      zoom={RACE_CONFIG.zoom}
      style={{ height: '100%', width: '100%' }}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        subdomains="abcd"
        maxZoom={19}
      />

      <Marker position={[RACE_CONFIG.finishLine.lat, RACE_CONFIG.finishLine.lng]} icon={FINISH_ICON}>
        <Popup className="boat-popup">
          <div className="popup-inner">
            <strong className="popup-name">Linha de Chegada</strong>
            <span className="popup-sail">{RACE_CONFIG.leg}</span>
          </div>
        </Popup>
      </Marker>

      {boats.map((boat) => (
        <BoatMarker
          key={boat.id}
          boat={boat}
          isSelected={selectedBoat?.id === boat.id}
          onSelect={onBoatSelect}
        />
      ))}
      {boats.map((boat) =>
        boat.history.length > 1 ? (
          <Polyline
            key={`track-${boat.id}`}
            positions={[
              ...boat.history.map((h) => [h.lat, h.lng]),
              [boat.lat, boat.lng],
            ]}
            color={boat.color}
            weight={selectedBoat?.id === boat.id ? 2.5 : 1.5}
            opacity={selectedBoat?.id === boat.id ? 0.8 : 0.4}
            dashArray="5,5"
          />
        ) : null
      )}

      <FlyToSelected selectedBoat={selectedBoat} />
    </MapContainer>
  );
}
