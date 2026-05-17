import { X } from '@phosphor-icons/react';
import { PieChart, Pie, Cell, ResponsiveContainer, Sector, Tooltip, Legend } from 'recharts';

const COLORS = ['#0088FE', '#FFBB28', '#FF8042'];

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="custom-tooltip" style={{ backgroundColor: '#fff', padding: '10px', border: '1px solid #ccc' }}>
                <p className="label">{`${label} : ${payload[0].value}`}</p>
                <p className="desc">Anything you want can be displayed here.</p>
            </div>
        )
    }
}

export const PieChartComponent = ({ data, isAnimationActive }) => {
  return (
    <ResponsiveContainer width="100%" aspect={1}> {/* aspect = w / h */}
        <PieChart>
            <Pie data={data} dataKey="percentage" nameKey="label" cx="50%" cy="50%" innerRadius="60%" outerRadius="90%" cornerRadius="40%" paddingAngle={3} fill="#8884d8" label isAnimationActive={isAnimationActive}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
        </PieChart>
    </ResponsiveContainer>
  );
}