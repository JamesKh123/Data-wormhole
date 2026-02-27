import React from 'react';

interface StatCardsProps {
  sites: number;
  users: number;
  trainings: number;
  regions: number;
}

const cards = [
  {
    key: 'sites' as const,
    label: 'Total Sites',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={28} height={28}>
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    color: '#26374a',
  },
  {
    key: 'regions' as const,
    label: 'Provinces / Territories',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={28} height={28}>
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" />
      </svg>
    ),
    color: '#1c578a',
  },
  {
    key: 'users' as const,
    label: 'Total Users',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={28} height={28}>
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
    color: '#2b7f45',
  },
  {
    key: 'trainings' as const,
    label: 'Total Trainings',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={28} height={28}>
        <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" />
        <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
      </svg>
    ),
    color: '#7d4e9e',
  },
];

export const StatCards: React.FC<StatCardsProps> = ({ sites, users, trainings, regions }) => {
  const values: Record<string, number> = { sites, users, trainings, regions };

  return (
    <div className="stat-cards">
      {cards.map((card) => (
        <div className="stat-card" key={card.key} style={{ borderTopColor: card.color }}>
          <div className="stat-card-icon" style={{ color: card.color }}>
            {card.icon}
          </div>
          <div className="stat-card-content">
            <div className="stat-card-value">{values[card.key].toLocaleString()}</div>
            <div className="stat-card-label">{card.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
};
