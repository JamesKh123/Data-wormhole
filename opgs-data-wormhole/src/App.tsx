import { useEffect, useState, useMemo } from 'react';
import { StatCards } from './components/StatCards';
import { BarChartByYear } from './components/BarChartByYear';
import { LineChartOverTime } from './components/LineChartOverTime';
import { DataTable } from './components/DataTable';
import { CanadaMap } from './components/CanadaMap';
import { CsvUploader } from './components/CsvUploader';
import { parseCSV, loadDefaultCSV } from './utils/csvParser';
import {
  aggregateByYear,
  aggregateByRegion,
  getSummary,
  filterRecords,
} from './utils/aggregations';
import type { SiteRecord } from './types';
import './App.css';

type MapMetric = 'Trainings' | 'Users' | 'Sites';

export default function App() {
  const [allData, setAllData] = useState<SiteRecord[]>([]);
  const [hasCustomData, setHasCustomData] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [yearFilter, setYearFilter] = useState('');
  const [regionFilter, setRegionFilter] = useState('');
  const [searchFilter, setSearchFilter] = useState('');
  const [mapMetric, setMapMetric] = useState<MapMetric>('Trainings');

  useEffect(() => {
    loadDefaultCSV()
      .then((data) => {
        setAllData(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load sample data.');
        setLoading(false);
      });
  }, []);

  const handleUpload = async (file: File) => {
    try {
      setLoading(true);
      const data = await parseCSV(file);
      setAllData(data);
      setHasCustomData(true);
      setYearFilter('');
      setRegionFilter('');
      setSearchFilter('');
      setLoading(false);
    } catch {
      setError('Failed to parse CSV file. Please check the format.');
      setLoading(false);
    }
  };

  const handleReset = async () => {
    try {
      setLoading(true);
      const data = await loadDefaultCSV();
      setAllData(data);
      setHasCustomData(false);
      setYearFilter('');
      setRegionFilter('');
      setSearchFilter('');
      setLoading(false);
    } catch {
      setError('Failed to reload sample data.');
      setLoading(false);
    }
  };

  const filteredData = useMemo(
    () => filterRecords(allData, yearFilter, regionFilter, searchFilter),
    [allData, yearFilter, regionFilter, searchFilter]
  );

  const summary = useMemo(() => getSummary(filteredData), [filteredData]);
  const yearAggregates = useMemo(() => aggregateByYear(filteredData), [filteredData]);
  const regionAggregates = useMemo(
    () => aggregateByRegion(filterRecords(allData, '', regionFilter, '')),
    [allData, regionFilter]
  );

  const allYears = useMemo(
    () => Array.from(new Set(allData.map((r) => r.Year))).sort(),
    [allData]
  );
  const allRegions = useMemo(
    () => Array.from(new Set(allData.map((r) => r.Region))).sort(),
    [allData]
  );

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-inner">
          <div className="header-brand">
            <div className="header-logo">
              <svg viewBox="0 0 40 40" fill="none" width={40} height={40}>
                <circle cx="20" cy="20" r="20" fill="#26374a" />
                <path
                  d="M10 20 Q15 10 20 20 Q25 30 30 20"
                  stroke="#ffffff"
                  strokeWidth="2.5"
                  fill="none"
                  strokeLinecap="round"
                />
                <circle cx="10" cy="20" r="3" fill="#f4a300" />
                <circle cx="30" cy="20" r="3" fill="#f4a300" />
              </svg>
            </div>
            <div>
              <div className="header-title">OPGS Data Wormhole</div>
              <div className="header-subtitle">
                Government of Canada &mdash; Site Training Dashboard
              </div>
            </div>
          </div>
          <CsvUploader
            onUpload={handleUpload}
            onReset={handleReset}
            hasCustomData={hasCustomData}
          />
        </div>
      </header>

      <main className="app-main">
        {loading && (
          <div className="loading-overlay">
            <div className="spinner" />
            <span>Loading data&hellip;</span>
          </div>
        )}

        {error && (
          <div className="error-banner">
            <strong>Error:</strong> {error}
            <button className="btn-link" onClick={() => setError(null)} style={{ marginLeft: 12 }}>
              Dismiss
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            <StatCards
              sites={summary.sites}
              users={summary.users}
              trainings={summary.trainings}
              regions={summary.regions}
            />

            <div className="charts-row">
              <BarChartByYear data={yearAggregates} />
              <LineChartOverTime data={yearAggregates} />
            </div>

            <div className="map-section">
              <div className="map-metric-picker">
                <span className="map-metric-label">Show on map:</span>
                {(['Trainings', 'Users', 'Sites'] as MapMetric[]).map((m) => (
                  <button
                    key={m}
                    className={`metric-btn ${mapMetric === m ? 'metric-btn--active' : ''}`}
                    onClick={() => setMapMetric(m)}
                  >
                    {m}
                  </button>
                ))}
              </div>
              <CanadaMap data={regionAggregates} metric={mapMetric} />
            </div>

            <DataTable
              data={filteredData}
              yearFilter={yearFilter}
              regionFilter={regionFilter}
              searchFilter={searchFilter}
              onYearChange={setYearFilter}
              onRegionChange={setRegionFilter}
              onSearchChange={setSearchFilter}
              years={allYears}
              regions={allRegions}
            />
          </>
        )}
      </main>

      <footer className="app-footer">
        <span>OPGS Data Wormhole v1 &mdash; Government Public Sector Dashboard</span>
      </footer>
    </div>
  );
}
