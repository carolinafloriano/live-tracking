function Avatar({ name, color }) {
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" aria-hidden="true">
      <circle cx="24" cy="24" r="24" fill={color} opacity="0.2" />
      <circle cx="24" cy="24" r="23" fill="none" stroke={color} strokeWidth="1.5" opacity="0.5" />
      <text
        x="24"
        y="30"
        textAnchor="middle"
        fontSize="16"
        fontWeight="700"
        fill={color}
        fontFamily="'Courier New',monospace"
      >
        {initials}
      </text>
    </svg>
  );
}

function BoatSilhouette({ color }) {
  return (
    <svg width="100%" height="72" viewBox="0 0 240 72" aria-hidden="true">
      <path d="M 120 8 L 120 58" stroke={color} strokeWidth="2" opacity="0.6" />
      <path d="M 120 12 L 120 55 L 168 42 Z" fill={color} opacity="0.35" />
      <path d="M 120 20 L 120 52 L 88 42 Z" fill={color} opacity="0.25" />
      <path d="M 55 62 Q 120 70 185 62" stroke={color} strokeWidth="2.5" fill="none" opacity="0.7" />
      <ellipse cx="120" cy="64" rx="66" ry="7" fill={color} opacity="0.1" />
      <line x1="55" y1="62" x2="185" y2="62" stroke={color} strokeWidth="1" opacity="0.3" />
    </svg>
  );
}

function StatCard({ label, value, unit, highlight }) {
  return (
    <div className="stat-card">
      <div className="stat-card__label">{label}</div>
      <div className={`stat-card__value${highlight ? ' stat-card__value--accent' : ''}`}>
        {value}
        {unit && <span className="stat-card__unit"> {unit}</span>}
      </div>
    </div>
  );
}

function formatTime(ts) {
  return new Date(ts).toLocaleTimeString('pt-PT', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

function formatCoord(val, posLabel, negLabel) {
  return `${Math.abs(val).toFixed(4)}° ${val >= 0 ? posLabel : negLabel}`;
}

export default function BoatDetail({ boat, onClose }) {
  if (!boat) return null;

  const recent = [...boat.history].reverse().slice(0, 6);

  return (
    <div className="boat-detail">
      <div className="boat-detail__header">
        <span className="boat-detail__accent-bar" style={{ background: boat.color }} />
        <div className="boat-detail__title">
          <h2 className="boat-detail__name">{boat.name}</h2>
          <span className="boat-detail__sail">{boat.sail}</span>
        </div>
        <button className="close-btn" onClick={onClose} aria-label="Fechar detalhe">
          ✕
        </button>
      </div>

      <div className="boat-detail__illustration">
        <BoatSilhouette color={boat.color} />
      </div>

      <div className="skipper-card">
        <Avatar name={boat.skipper} color={boat.color} />
        <div className="skipper-card__info">
          <div className="skipper-card__role">SKIPPER</div>
          <div className="skipper-card__name">{boat.skipper}</div>
          <div className="skipper-card__team">{boat.team}</div>
        </div>
      </div>

      <div className="stats-grid">
        <StatCard label="POSIÇÃO" value={`#${boat.rank}`} highlight />
        <StatCard label="VELOCIDADE" value={boat.speed.toFixed(1)} unit="kn" />
        <StatCard label="DIST. META" value={boat.distToFinish?.toFixed(1)} unit="nm" />
        <StatCard label="RUMO" value={`${Math.round(boat.heading) % 360}°`} />
      </div>

      <div className="coords-panel">
        <div className="coords-panel__label">POSIÇÃO ACTUAL</div>
        <div className="coords-panel__values">
          <span>{formatCoord(boat.lat, 'N', 'S')}</span>
          <span>{formatCoord(boat.lng, 'E', 'W')}</span>
        </div>
      </div>

      {recent.length > 0 && (
        <div className="history-panel">
          <div className="section-label">HISTÓRICO DE POSIÇÕES</div>
          <div className="history-list">
            {recent.map((pos, i) => (
              <div key={i} className="history-row">
                <span className="history-row__idx">{String(i + 1).padStart(2, '0')}</span>
                <span className="history-row__coords">
                  {formatCoord(pos.lat, 'N', 'S')} / {formatCoord(pos.lng, 'E', 'W')}
                </span>
                <span className="history-row__time">{formatTime(pos.ts)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
