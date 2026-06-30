export default function BoatList({ boats, selectedBoatId, onBoatSelect }) {
  const sorted = [...boats].sort((a, b) => a.rank - b.rank);

  return (
    <div className="boat-list">
      <div className="section-label">EMBARCAÇÕES · {boats.length} EM CORRIDA</div>
      {sorted.map((boat) => (
        <button
          key={boat.id}
          className={`boat-item${selectedBoatId === boat.id ? ' boat-item--selected' : ''}`}
          onClick={() => onBoatSelect(boat.id)}
        >
          <div className="boat-item__rank" style={{ color: boat.color }}>
            #{boat.rank}
          </div>
          <span className="boat-item__dot" style={{ background: boat.color }} />
          <div className="boat-item__info">
            <div className="boat-item__name">{boat.name}</div>
            <div className="boat-item__sail">{boat.sail}</div>
          </div>
          <div className="boat-item__metrics">
            <div className="mono-value" style={{ color: boat.color }}>
              {boat.speed.toFixed(1)} <span className="unit">kn</span>
            </div>
            <div className="mono-sub">{boat.distToFinish?.toFixed(1)} nm</div>
          </div>
        </button>
      ))}
    </div>
  );
}
