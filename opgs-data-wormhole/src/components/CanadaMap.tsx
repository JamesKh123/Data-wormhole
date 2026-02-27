import React, { useState } from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  type GeoFeature,
} from 'react-simple-maps';
import { scaleQuantize } from 'd3-scale';
import type { RegionAggregate } from '../types';

// GeoJSON for Canada provinces — using natural earth hosted topology
const GEO_URL =
  'https://cdn.jsdelivr.net/npm/canada-geo@1.0.0/canada.json';

// Province name normalizer: maps common abbreviations/variations to our data keys
const PROVINCE_NAME_MAP: Record<string, string> = {
  'Ontario': 'Ontario',
  'Quebec': 'Quebec',
  'British Columbia': 'British Columbia',
  'Alberta': 'Alberta',
  'Manitoba': 'Manitoba',
  'Saskatchewan': 'Saskatchewan',
  'Nova Scotia': 'Nova Scotia',
  'New Brunswick': 'New Brunswick',
  'Newfoundland and Labrador': 'Newfoundland and Labrador',
  'Prince Edward Island': 'Prince Edward Island',
  'Northwest Territories': 'Northwest Territories',
  'Nunavut': 'Nunavut',
  'Yukon': 'Yukon',
  'Yukon Territory': 'Yukon',
};

interface CanadaMapProps {
  data: RegionAggregate[];
  metric: 'Trainings' | 'Users' | 'Sites';
}

export const CanadaMap: React.FC<CanadaMapProps> = ({ data, metric }) => {
  const [tooltip, setTooltip] = useState<{
    name: string;
    value: number;
    x: number;
    y: number;
  } | null>(null);

  const dataByRegion = new Map<string, RegionAggregate>();
  data.forEach((r) => dataByRegion.set(r.Region, r));

  const maxVal = Math.max(...data.map((d) => d[metric]), 1);

  const colorScale = scaleQuantize<string>()
    .domain([0, maxVal])
    .range([
      '#d6e4f0',
      '#a8ccde',
      '#7ab4cc',
      '#4d9bbb',
      '#2683a9',
      '#1c6b8a',
      '#145270',
      '#0d3a56',
    ]);

  return (
    <div className="chart-card" style={{ position: 'relative' }}>
      <div className="chart-title-row">
        <h2 className="chart-title">{metric} by Province / Territory</h2>
      </div>

      <div style={{ position: 'relative' }}>
        <ComposableMap
          projection="geoAzimuthalEqualArea"
          projectionConfig={{
            rotate: [96, -62, 0],
            scale: 700,
          }}
          style={{ width: '100%', height: 'auto' }}
          viewBox="0 0 800 500"
        >
          <Geographies geography={GEO_URL}>
            {({ geographies }: { geographies: GeoFeature[] }) =>
              geographies.map((geo: GeoFeature) => {
                const geoName: string =
                  geo.properties?.name ||
                  geo.properties?.PRENAME ||
                  geo.properties?.NAME ||
                  '';
                const normalizedName = PROVINCE_NAME_MAP[geoName] ?? geoName;
                const regionData = dataByRegion.get(normalizedName);
                const value = regionData ? regionData[metric] : 0;
                const fill = value > 0 ? colorScale(value) : '#eaeaea';

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={fill}
                    stroke="#ffffff"
                    strokeWidth={0.8}
                    style={{
                      default: { outline: 'none' },
                      hover: { fill: '#f4a300', outline: 'none', cursor: 'pointer' },
                      pressed: { outline: 'none' },
                    }}
                    onMouseEnter={(e: React.MouseEvent<SVGPathElement>) => {
                      const rect = (e.target as SVGElement)
                        .closest('svg')
                        ?.getBoundingClientRect();
                      setTooltip({
                        name: normalizedName || geoName,
                        value,
                        x: e.clientX - (rect?.left ?? 0),
                        y: e.clientY - (rect?.top ?? 0),
                      });
                    }}
                    onMouseLeave={() => setTooltip(null)}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>

        {tooltip && (
          <div
            className="map-tooltip"
            style={{ left: tooltip.x + 12, top: tooltip.y - 10 }}
          >
            <strong>{tooltip.name}</strong>
            <br />
            {metric}: {tooltip.value.toLocaleString()}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="map-legend">
        <span className="legend-label">Low</span>
        {colorScale.range().map((color, i) => (
          <div
            key={i}
            style={{ width: 28, height: 14, backgroundColor: color, display: 'inline-block' }}
          />
        ))}
        <span className="legend-label">High</span>
      </div>
    </div>
  );
};
