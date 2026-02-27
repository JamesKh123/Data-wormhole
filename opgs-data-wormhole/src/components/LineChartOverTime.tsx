import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { YearAggregate } from '../types';

interface LineChartOverTimeProps {
  data: YearAggregate[];
}

export const LineChartOverTime: React.FC<LineChartOverTimeProps> = ({ data }) => {
  return (
    <div className="chart-card">
      <h2 className="chart-title">Trend Over Time</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="Year" tick={{ fontSize: 13 }} />
          <YAxis tick={{ fontSize: 13 }} />
          <Tooltip
            contentStyle={{ fontSize: 13, borderRadius: 6 }}
            formatter={(value: number | undefined, name: string | undefined) => [(value ?? 0).toLocaleString(), name ?? '']}
          />
          <Legend wrapperStyle={{ fontSize: 13 }} />
          <Line
            type="monotone"
            dataKey="Trainings"
            stroke="#26374a"
            strokeWidth={2.5}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
            name="Trainings"
          />
          <Line
            type="monotone"
            dataKey="Users"
            stroke="#2b7f45"
            strokeWidth={2.5}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
            name="Users"
          />
          <Line
            type="monotone"
            dataKey="Sites"
            stroke="#7d4e9e"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ r: 3 }}
            name="Active Sites"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
