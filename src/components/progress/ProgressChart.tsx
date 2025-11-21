// components/progress/ProgressChart.tsx

'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { formatDateForDisplay } from '@/lib/utils/dateHelpers';

interface ProgressChartProps {
    data: {
        date: string;
        completed: number;
        total: number;
        percentage: number;
    }[];
}

export const ProgressChart: React.FC<ProgressChartProps> = ({ data }) => {
    const chartData = data.map(item => ({
        name: formatDateForDisplay(item.date, 'short'),
        'Taux de completion': item.percentage,
        'Habitudes complétées': item.completed,
    }));

    return (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis
                    dataKey="name"
                    stroke="#6B7280"
                    style={{ fontSize: '12px' }}
                />
                <YAxis
                    stroke="#6B7280"
                    style={{ fontSize: '12px' }}
                    label={{ value: '% Completion', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip
                    contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #E5E7EB',
                        borderRadius: '8px',
                    }}
                />
                <Legend />
                <Line
                    type="monotone"
                    dataKey="Taux de completion"
                    stroke="#3C82F6"
                    strokeWidth={3}
                    dot={{ fill: '#3C82F6', r: 4 }}
                    activeDot={{ r: 6 }}
                />
            </LineChart>
        </ResponsiveContainer>
    );
};