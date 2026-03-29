import { memo } from 'react';
import { motion } from 'framer-motion';
import { ScrollText } from 'lucide-react';

/**
 * LogsPanel — Execution log display for the Logs tab.
 * Replaces the old ResultPanel's log section.
 */
function LogsPanel({ logs, currentStep, result }) {
    if (!result) return null;

    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2">
                <ScrollText className="w-4 h-4 text-gray-400" />
                <h4 className="text-sm font-bold text-gray-800 dark:text-white">Execution Log</h4>
                <span className="text-[10px] text-gray-400 ml-auto">{logs.length} entries</span>
            </div>
            <div className="rounded-lg bg-gray-50 dark:bg-gray-900/50 border border-gray-200/60 dark:border-gray-700/30 p-3 space-y-0.5">
                {logs.map((log, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.015 }}
                        className={`log-entry ${i <= currentStep
                                ? log.includes('✓') || log.includes('✅')
                                    ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/5'
                                    : log.includes('✗') || log.includes('❌')
                                        ? 'text-red-500 dark:text-red-400 bg-red-500/5'
                                        : log.includes('Completed')
                                            ? 'text-sky-600 dark:text-sky-400 bg-sky-500/5'
                                            : 'text-gray-600 dark:text-gray-400'
                                : 'text-gray-400 dark:text-gray-500 opacity-40'
                            }`}
                    >
                        <span className="text-gray-400 mr-2 select-none">[{i + 1}]</span>{log}
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

export default memo(LogsPanel);
