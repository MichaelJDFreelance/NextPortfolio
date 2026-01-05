import React from "react";
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
} from "recharts";

export default function SimplePieChart({data}:{data:any[]}) {
    return (
        <ResponsiveContainer width="100%" height={300} className={`relative`}>
            <div className={`text-center absolute inset-0 flex items-center justify-center flex flex-col`}>
                <span className={`text-preset-1`}>$338</span>
                <span className={`text-preset-5`}>of $975 limit</span>
            </div>
            <PieChart>
                <Pie className={`opacity-80`}
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={80}
                    dataKey="maximum"
                    label={false}
                    labelLine={false}
                    startAngle={90}
                    endAngle={-270}
                >
                    {data.map((entry, index) => (
                        <Cell
                            key={`cell-${index}`}
                            fill={data[index % data.length].theme}
                        />
                    ))}
                </Pie>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={100}
                    dataKey="maximum"
                    label={false}
                    labelLine={false}
                    startAngle={90}
                    endAngle={-270}
                >
                    {data.map((entry, index) => (
                        <Cell
                            key={`cell-${index}`}
                            fill={data[index % data.length].theme}
                        />
                    ))}
                </Pie>
            </PieChart>
        </ResponsiveContainer>
    );
}
