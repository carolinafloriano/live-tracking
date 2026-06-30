import { useState, useEffect, useCallback } from 'react';
import { INITIAL_BOATS, RACE_CONFIG } from '../data/mockData';

const TICK_MS = 3000;
// Heavily accelerated vs real time so movement is visible in the demo
const SIM_DEG_PER_KN_PER_TICK = 0.00022;
const MAX_HISTORY = 25;

function toRad(deg) {
  return (deg * Math.PI) / 180;
}

function haversineNm(lat1, lng1, lat2, lng2) {
  const R = 3440.065;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function stepBoat(boat) {
  const speedJitter = (Math.random() - 0.5) * 0.6;
  const headingJitter = (Math.random() - 0.5) * 5;

  const newSpeed = Math.max(6, Math.min(18, boat.speed + speedJitter));
  const newHeading = boat.heading + headingJitter;
  const headingRad = toRad(newHeading);
  const dist = newSpeed * SIM_DEG_PER_KN_PER_TICK;

  // Correct longitude for latitude compression
  const newLat = boat.lat + dist * Math.cos(headingRad);
  const newLng = boat.lng + (dist * Math.sin(headingRad)) / Math.cos(toRad(boat.lat));

  const distToFinish = haversineNm(
    newLat,
    newLng,
    RACE_CONFIG.finishLine.lat,
    RACE_CONFIG.finishLine.lng
  );

  const newHistory = [
    ...boat.history.slice(-(MAX_HISTORY - 1)),
    { lat: boat.lat, lng: boat.lng, ts: Date.now() },
  ];

  return { ...boat, lat: newLat, lng: newLng, speed: newSpeed, heading: newHeading, distToFinish, history: newHistory };
}

function rerank(boats) {
  const byDist = [...boats].sort((a, b) => a.distToFinish - b.distToFinish);
  return boats.map((b) => ({ ...b, rank: byDist.findIndex((x) => x.id === b.id) + 1 }));
}

export function useBoatSimulation() {
  const [boats, setBoats] = useState(() =>
    INITIAL_BOATS.map((b) => ({
      ...b,
      distToFinish: haversineNm(b.lat, b.lng, RACE_CONFIG.finishLine.lat, RACE_CONFIG.finishLine.lng),
    }))
  );
  const [lastUpdate, setLastUpdate] = useState(() => new Date());
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    const id = setInterval(() => {
      setBoats((prev) => rerank(prev.map(stepBoat)));
      setLastUpdate(new Date());
    }, TICK_MS);
    return () => clearInterval(id);
  }, []);

  const selectBoat = useCallback((id) => {
    setSelectedId((prev) => (prev === id ? null : id));
  }, []);

  const selectedBoat = boats.find((b) => b.id === selectedId) ?? null;

  return { boats, lastUpdate, selectedBoat, selectBoat };
}
