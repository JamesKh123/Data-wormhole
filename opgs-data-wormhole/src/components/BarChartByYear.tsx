import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { YearAggregate } from '../types';

interface BarChartByYearProps {
  data: YearAggregate[];
}

export const BarChartByYear: React.FC<BarChartByYearProps> = ({ data }) => {
  return (
    <div className="chart-card">
      <h2 className="chart-title">Trainings &amp; Users by Year</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis dataKey="Year" tick={{ fontSize: 13 }} />
          <YAxis tick={{ fontSize: 13 }} />
          <Tooltip
            contentStyle={{ fontSize: 13, borderRadius: 6 }}
            formatter={(value: number | undefined, name: string | undefined) => [(value ?? 0).toLocaleString(), name ?? '']}
          />
          <Legend wrapperStyle={{ fontSize: 13 }} />
          <Bar dataKey="Trainings" fill="#26374a" radius={[3, 3, 0, 0]} name="Trainings" />
          <Bar dataKey="Users" fill="#1c578a" radius={[3, 3, 0, 0]} name="Users" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
