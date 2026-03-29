import { memo } from 'react';
import { Settings, Shuffle, BookOpen, AlertTriangle, RotateCcw, Plus, Minus, Minimize2, Maximize2 } from 'lucide-react';

/**
 * InputPanel — Compact dashboard-friendly configuration panel.
 * Parent provides the card/container wrapper.
 */
function InputPanel({
    numProcesses, numResources,
    available, max, allocation,
    onProcessChange, onResourceChange,
    onAvailableChange, onMaxChange, onAllocationChange,
    onRandomExample, onStandardExample, onUnsafeExample, onReset,
    errors, compact,
}) {
    const updateMatrixCell = (matrix, setMatrix, row, col, value) => {
        const val = value === '' ? 0 : parseInt(value, 10);
        if (isNaN(val)) return;
        const newMatrix = matrix.map(r => [...r]);
        newMatrix[row][col] = val;
        setMatrix(newMatrix);
    };

    const updateAvailable = (col, value) => {
        const val = value === '' ? 0 : parseInt(value, 10);
        if (isNaN(val)) return;
        const newAvail = [...available];
        newAvail[col] = val;
        onAvailableChange(newAvail);
    };

    const resourceLabels = Array.from({ length: numResources }, (_, i) =>
        String.fromCharCode(65 + i)
    );

    const cellClass = compact ? 'matrix-cell-compact' : 'matrix-cell';

    return (
        <div className="space-y-4">
            {/* Section Header */}
            <div className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-violet-500" />
                <h2 className="text-sm font-bold text-gray-800 dark:text-white tracking-wide uppercase">
                    Configuration
                </h2>
            </div>

            {/* Process / Resource Count */}
            <div className="grid grid-cols-2 gap-3">
                <div>
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">
                        Processes
                    </label>
                    <div className="flex items-center gap-1.5">
                        <button onClick={() => onProcessChange(numProcesses - 1)}
                            className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-700/60 hover:bg-gray-200 dark:hover:bg-gray-600/60 transition-colors">
                            <Minus className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                        </button>
                        <span className="w-8 text-center font-bold text-lg text-gray-800 dark:text-white">{numProcesses}</span>
                        <button onClick={() => onProcessChange(numProcesses + 1)}
                            className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-700/60 hover:bg-gray-200 dark:hover:bg-gray-600/60 transition-colors">
                            <Plus className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                        </button>
                    </div>
                </div>
                <div>
                    <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">
                        Resources
                    </label>
                    <div className="flex items-center gap-1.5">
                        <button onClick={() => onResourceChange(numResources - 1)}
                            className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-700/60 hover:bg-gray-200 dark:hover:bg-gray-600/60 transition-colors">
                            <Minus className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                        </button>
                        <span className="w-8 text-center font-bold text-lg text-gray-800 dark:text-white">{numResources}</span>
                        <button onClick={() => onResourceChange(numResources + 1)}
                            className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-700/60 hover:bg-gray-200 dark:hover:bg-gray-600/60 transition-colors">
                            <Plus className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="section-divider" />

            {/* Available Resources */}
            <div>
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 block">
                    Available Resources
                </label>
                <div className="flex gap-1.5 flex-wrap">
                    {available.map((val, j) => (
                        <div key={j} className="flex flex-col items-center gap-0.5">
                            <span className="text-[10px] font-mono text-violet-500 font-semibold">{resourceLabels[j]}</span>
                            <input
                                type="number" min="0" value={val}
                                onChange={e => updateAvailable(j, e.target.value)}
                                className={cellClass}
                            />
                        </div>
                    ))}
                </div>
            </div>

            <div className="section-divider" />

            {/* Max Matrix */}
            <div>
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 block">
                    Max Demand
                </label>
                <div className="overflow-x-auto">
                    <table className="border-collapse">
                        <thead>
                            <tr>
                                <th className="text-[10px] font-mono text-gray-400 pr-1.5"></th>
                                {resourceLabels.map((r, j) => (
                                    <th key={j} className="text-[10px] font-mono text-violet-500 px-0.5 pb-0.5">{r}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {max.map((row, i) => (
                                <tr key={i}>
                                    <td className="text-[10px] font-mono text-gray-400 pr-1.5 font-semibold">P{i}</td>
                                    {row.map((val, j) => (
                                        <td key={j} className="p-0.5">
                                            <input
                                                type="number" min="0" value={val}
                                                onChange={e => updateMatrixCell(max, onMaxChange, i, j, e.target.value)}
                                                className={cellClass}
                                            />
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="section-divider" />

            {/* Allocation Matrix */}
            <div>
                <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 block">
                    Current Allocation
                </label>
                <div className="overflow-x-auto">
                    <table className="border-collapse">
                        <thead>
                            <tr>
                                <th className="text-[10px] font-mono text-gray-400 pr-1.5"></th>
                                {resourceLabels.map((r, j) => (
                                    <th key={j} className="text-[10px] font-mono text-violet-500 px-0.5 pb-0.5">{r}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {allocation.map((row, i) => (
                                <tr key={i}>
                                    <td className="text-[10px] font-mono text-gray-400 pr-1.5 font-semibold">P{i}</td>
                                    {row.map((val, j) => (
                                        <td key={j} className="p-0.5">
                                            <input
                                                type="number" min="0" value={val}
                                                onChange={e => updateMatrixCell(allocation, onAllocationChange, i, j, e.target.value)}
                                                className={cellClass}
                                            />
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Errors */}
            {errors.length > 0 && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                    <p className="text-xs font-semibold text-red-400 mb-1">⚠️ Validation Errors</p>
                    <ul className="text-xs text-red-300 space-y-0.5">
                        {errors.map((e, i) => <li key={i}>• {e}</li>)}
                    </ul>
                </div>
            )}

            <div className="section-divider" />

            {/* Action Toolbar */}
            <div className="flex flex-wrap gap-2">
                <button onClick={onRandomExample}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700/50 hover:bg-gray-200 dark:hover:bg-gray-600/50 text-gray-600 dark:text-gray-300 text-xs font-medium transition-all hover:scale-105 active:scale-95">
                    <Shuffle className="w-3 h-3" /> Random
                </button>
                <button onClick={onStandardExample}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/25 hover:bg-emerald-200 dark:hover:bg-emerald-800/35 text-emerald-600 dark:text-emerald-400 text-xs font-medium transition-all hover:scale-105 active:scale-95">
                    <BookOpen className="w-3 h-3" /> Safe
                </button>
                <button onClick={onUnsafeExample}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-100 dark:bg-red-900/25 hover:bg-red-200 dark:hover:bg-red-800/35 text-red-600 dark:text-red-400 text-xs font-medium transition-all hover:scale-105 active:scale-95">
                    <AlertTriangle className="w-3 h-3" /> Unsafe
                </button>
                <button onClick={onReset}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-700/50 hover:bg-gray-200 dark:hover:bg-gray-600/50 text-gray-600 dark:text-gray-300 text-xs font-medium transition-all hover:scale-105 active:scale-95">
                    <RotateCcw className="w-3 h-3" /> Reset
                </button>
            </div>
        </div>
    );
}

export default memo(InputPanel);
