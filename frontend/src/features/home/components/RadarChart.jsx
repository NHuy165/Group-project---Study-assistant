import { X } from '@phosphor-icons/react';
import { RadarChart, Radar, ResponsiveContainer, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip, Legend } from 'recharts';


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

export const RadarChartComponent = ({ data, isAnimationActive }) => {
  return (
    <ResponsiveContainer width="100%" aspect={1}>
        <RadarChart outerRadius="80%" data={data} margin={{ right: 30, left: 30}}>
            <PolarGrid />
            <PolarAngleAxis dataKey="label" />
            <PolarRadiusAxis angle={90} domain={[0, 100]} tickCount={5} />
            <Radar dataKey="percentage" type="monotone" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} isAnimationActive={isAnimationActive} />
            <Tooltip />
        </RadarChart>
    </ResponsiveContainer>
  );
}