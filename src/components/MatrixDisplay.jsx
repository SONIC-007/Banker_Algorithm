import { memo } from 'react';
import { motion } from 'framer-motion';

/**
 * MatrixDisplay — Read-only matrix with optional row highlighting.
 * Compact variant supported. No outer card wrapper.
 */
function MatrixDisplay({
    title, subtitle, matrix, numProcesses, numResources,
    highlightRow = -1, compact = false,
}) {
    const resourceLabels = Array.from({ length: numResources }, (_, i) =>
        String.fromCharCode(65 + i)
    );

    const getCellColor = (val) => {
        if (val <= 0) return 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300';
        if (val <= 2) return 'bg-sky-100 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300';
        if (val <= 4) return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300';
        if (val <= 6) return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300';
        return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300';
    };

    const cellSize = compact ? 'w-9 h-7 text-[11px]' : 'w-11 h-8 text-xs';

    return (
        <div>
            <div className="flex items-center gap-1.5 mb-1">
                <span className="text-sm">📊</span>
                <h3 className="text-xs font-bold text-gray-800 dark:text-white uppercase tracking-wide">{title}</h3>
            </div>
            {subtitle && (
                <p className="text-[10px] text-gray-400 dark:text-gray-500 mb-2">{subtitle}</p>
            )}

            <div className="overflow-x-auto">
                <table className="border-collapse">
                    <thead>
                        <tr>
                            <th className="text-[10px] font-mono text-gray-400 pr-2"></th>
                            {resourceLabels.map((r, j) => (
                                <th key={j} className="text-[10px] font-mono text-violet-500 px-1 pb-1">{r}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {matrix.map((row, i) => (
                            <tr
                                key={i}
                                className={highlightRow === i ? 'ring-1 ring-violet-500/50 rounded' : ''}
                            >
                                <td className={`text-[10px] font-mono pr-2 font-semibold py-0.5 ${highlightRow === i ? 'text-violet-500' : 'text-gray-400'
                                    }`}>
                                    P{i}
                                </td>
                                {row.map((val, j) => (
                                    <td key={j} className="p-0.5">
                                        <div
                                            className={`${cellSize} flex items-center justify-center rounded-md font-mono font-semibold ${getCellColor(val)} ${highlightRow === i ? 'ring-1 ring-violet-400/40' : ''
                                                }`}
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
        </div>
    );
}

export default memo(MatrixDisplay);
