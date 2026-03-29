import { memo, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BarChart3 } from 'lucide-react';

/**
 * GraphSection — Charts for resource analysis.
 * No outer card wrapper — lives inside DashboardTabs Graph tab.
 * Memoized to only re-render when simulation data changes.
 */
function GraphSection({
    available, max, allocation, needMatrix,
    numProcesses, numResources, result, currentStepData,
}) {
    const resourceLabels = useMemo(() =>
        Array.from({ length: numResources }, (_, i) => String.fromCharCode(65 + i)),
        [numResources]
    );

    const availableChartData = useMemo(() =>
        resourceLabels.map((label, j) => ({
            name: label,
            'Before': available[j],
            'After': result?.finalWork?.[j] ?? available[j],
            'Current Work': currentStepData?.work?.[j] ?? available[j],
        })),
        [resourceLabels, available, result, currentStepData]
    );

    const usageChartData = useMemo(() =>
        resourceLabels.map((label, j) => {
            let totalAlloc = 0, totalMax = 0;
            for (let i = 0; i < numProcesses; i++) {
                totalAlloc += allocation[i][j];
                totalMax += max[i][j];
            }
            return { name: label, Allocated: totalAlloc, Maximum: totalMax, Need: totalMax - totalAlloc };
        }),
        [resourceLabels, allocation, max, numProcesses]
    );

    const heatmapColor = (val) => {
        if (val <= 0) return '#10b981';
        if (val <= 2) return '#06b6d4';
        if (val <= 4) return '#f59e0b';
        if (val <= 6) return '#f97316';
        return '#ef4444';
    };

    const tooltipStyle = {
        background: 'rgba(30,30,50,0.95)',
        border: '1px solid rgba(139,92,246,0.2)',
        borderRadius: '8px',
        color: '#fff',
        fontSize: '11px',
    };

    return (
        <div className="space-y-4">
            {/* Available Resources Chart */}
            <div className="section-card p-3">
                <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-2">
                    📊 Available Resources (Before vs After)
                </h4>
                <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={availableChartData} barCategoryGap="20%">
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(139,92,246,0.08)" />
                        <XAxis dataKey="name" stroke="#9ca3af" fontSize={11} />
                        <YAxis stroke="#9ca3af" fontSize={11} />
                        <Tooltip contentStyle={tooltipStyle} />
                        <Legend wrapperStyle={{ fontSize: '11px' }} />
                        <Bar dataKey="Before" fill="#8b5cf6" radius={[3, 3, 0, 0]} />
                        <Bar dataKey="Current Work" fill="#06b6d4" radius={[3, 3, 0, 0]} />
                        <Bar dataKey="After" fill="#10b981" radius={[3, 3, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Resource Usage Chart */}
            <div className="section-card p-3">
                <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-2">
                    📈 Resource Usage (Allocated vs Maximum)
                </h4>
                <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={usageChartData} barCategoryGap="20%">
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(139,92,246,0.08)" />
                        <XAxis dataKey="name" stroke="#9ca3af" fontSize={11} />
                        <YAxis stroke="#9ca3af" fontSize={11} />
                        <Tooltip contentStyle={tooltipStyle} />
                        <Legend wrapperStyle={{ fontSize: '11px' }} />
                        <Bar dataKey="Allocated" fill="#f59e0b" radius={[3, 3, 0, 0]} />
                        <Bar dataKey="Maximum" fill="#ef4444" radius={[3, 3, 0, 0]} />
                        <Bar dataKey="Need" fill="#06b6d4" radius={[3, 3, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Need Matrix Heatmap */}
            <div className="section-card p-3">
                <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-2">
                    🌡️ Need Matrix Heatmap
                </h4>
                <div className="overflow-x-auto">
                    <table className="border-collapse mx-auto">
                        <thead>
                            <tr>
                                <th className="text-[10px] font-mono text-gray-400 px-1.5 pb-1"></th>
                                {resourceLabels.map((r, j) => (
                                    <th key={j} className="text-[10px] font-mono text-violet-500 px-1.5 pb-1">{r}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {needMatrix.map((row, i) => (
                                <tr key={i}>
                                    <td className="text-[10px] font-mono text-gray-400 px-1.5 font-semibold">P{i}</td>
                                    {row.map((val, j) => (
                                        <td key={j} className="p-0.5">
                                            <div
                                                className="w-10 h-8 flex items-center justify-center rounded-md font-mono text-xs font-bold text-white"
                                                style={{ backgroundColor: heatmapColor(val) }}
                                            >
                                                {val}
                                            </div>
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="flex items-center justify-center gap-2 mt-2">
                    <span className="text-[10px] text-gray-400">Low</span>
                    {['#10b981', '#06b6d4', '#f59e0b', '#f97316', '#ef4444'].map(c => (
                        <div key={c} className="w-5 h-3 rounded" style={{ backgroundColor: c }} />
                    ))}
                    <span className="text-[10px] text-gray-400">High</span>
                </div>
            </div>
        </div>
    );
}

export default memo(GraphSection);
