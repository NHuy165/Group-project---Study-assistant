import { X } from '@phosphor-icons/react';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';



// #region Sample data
const data = [
  {
    name: 'Page A',
    uv: 4000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: 'Page B',
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: 'Page C',
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: 'Page D',
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: 'Page E',
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
  {
    name: 'Page F',
    uv: 2390,
    pv: 3800,
    amt: 2500,
  },
  {
    name: 'Page G',
    uv: 3490,
    pv: 4300,
    amt: 2100,
  },
];
// #endregion

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

export const LineChartComponent = ({data, isAnimationActive}) => {
  return (
    <ResponsiveContainer width="100%" aspect={1}>
        <LineChart width={500} height={400} data={data} margin={{ right: 30}}>
            <XAxis dataKey="label" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Line type="monotone" dataKey="count" stroke="#8884d8" fill="#8884d8" />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
        </LineChart>
    </ResponsiveContainer>
    
    
  );
}