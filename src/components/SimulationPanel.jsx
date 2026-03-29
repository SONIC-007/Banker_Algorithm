import { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipForward, SkipBack, RotateCcw, Gauge, CheckCircle, XCircle, ArrowRight } from 'lucide-react';

/**
 * SimulationPanel — Step-by-step simulation controls and visualization.
 * Includes result badge and safe sequence (merged from ResultPanel).
 * No outer card wrapper — lives inside DashboardTabs.
 */
function SimulationPanel({
    result, currentStep, currentStepData,
    isRunning, speed,
    onSpeedChange, onNextStep, onPrevStep,
    onAutoRun, onPause, onReset,
}) {
    const totalSteps = result?.steps?.length || 0;
    const progress = totalSteps > 0 ? ((currentStep + 1) / totalSteps) * 100 : 0;

    return (
        <div className="space-y-3">
            {/* Result Badge Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {result.safe
                        ? <CheckCircle className="w-4 h-4 text-emerald-500" />
                        : <XCircle className="w-4 h-4 text-red-500" />
                    }
                    <span className="text-sm font-bold text-gray-800 dark:text-white">Result</span>
                </div>
                <div className={result.safe ? 'badge-safe' : 'badge-deadlock'}>
                    {result.safe ? '✅ SAFE' : '❌ DEADLOCK'}
                </div>
            </div>

            {/* Safe Sequence or Deadlocked Processes */}
            {result.safe && result.sequence.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap p-2.5 rounded-lg bg-emerald-500/5 border border-emerald-500/15">
                    <span className="text-[10px] text-emerald-500 font-semibold mr-1">SEQUENCE:</span>
                    {result.sequence.map((pIdx, i) => (
                        <span key={i} className="flex items-center gap-1">
                            <span className="px-2 py-0.5 rounded-md bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-mono text-[11px] font-bold">
                                P{pIdx}
                            </span>
                            {i < result.sequence.length - 1 && (
                                <ArrowRight className="w-3 h-3 text-emerald-400" />
                            )}
                        </span>
                    ))}
                </div>
            )}
            {!result.safe && (
                <div className="p-2.5 rounded-lg bg-red-500/5 border border-red-500/15">
                    <p className="text-xs text-red-400">
                        <strong>Deadlocked:</strong>{' '}
                        {result.steps[result.steps.length - 1]?.finish.map((f, i) => (!f ? `P${i}` : null)).filter(Boolean).join(', ')}
                    </p>
                </div>
            )}

            <div className="section-divider" />

            {/* Controls — sticky */}
            <div className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-lg py-2 -mx-1 px-1">
                <div className="flex flex-wrap items-center gap-2">
                    <button onClick={onPrevStep} disabled={currentStep <= -1}
                        className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700/50 hover:bg-gray-200 dark:hover:bg-gray-600/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                        <SkipBack className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
                    </button>

                    {isRunning ? (
                        <button onClick={onPause}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-semibold shadow-sm transition-all hover:scale-105 active:scale-95">
                            <Pause className="w-3.5 h-3.5" /> Pause
                        </button>
                    ) : (
                        <button onClick={onAutoRun}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-sm transition-all hover:scale-105 active:scale-95">
                            <Play className="w-3.5 h-3.5" /> Auto Run
                        </button>
                    )}

                    <button onClick={onNextStep} disabled={currentStep >= totalSteps - 1}
                        className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700/50 hover:bg-gray-200 dark:hover:bg-gray-600/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                        <SkipForward className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
                    </button>

                    <button onClick={onReset}
                        className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700/50 hover:bg-gray-200 dark:hover:bg-gray-600/50 transition-all">
                        <RotateCcw className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
                    </button>

                    {/* Speed */}
                    <div className="flex items-center gap-1.5 ml-auto">
                        <Gauge className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-[10px] text-gray-400 min-w-[26px]">
                            {speed < 500 ? 'Fast' : speed < 1200 ? 'Med' : 'Slow'}
                        </span>
                        <input
                            type="range" min="100" max="2000" step="100"
                            value={speed}
                            onChange={e => onSpeedChange(Number(e.target.value))}
                            className="w-20 accent-violet-500"
                        />
                    </div>
                </div>

                {/* Progress bar */}
                <div className="mt-2">
                    <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full"
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>
                    <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                        <span>Step {Math.max(0, currentStep + 1)} / {totalSteps}</span>
                        <span>{Math.round(progress)}%</span>
                    </div>
                </div>
            </div>

            {/* Current Step Info */}
            <AnimatePresence mode="wait">
                {currentStepData && (
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 12 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -12 }}
                        transition={{ duration: 0.15 }}
                    >
                        {/* Step Message */}
                        <div className={`p-2.5 rounded-lg mb-3 font-mono text-xs ${currentStepData.type === 'check_pass'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/15'
                                : currentStepData.type === 'check_fail'
                                    ? 'bg-red-500/10 text-red-400 border border-red-500/15'
                                    : currentStepData.type === 'allocate'
                                        ? 'bg-sky-500/10 text-sky-400 border border-sky-500/15'
                                        : currentStepData.type === 'result'
                                            ? result.safe
                                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/15'
                                                : 'bg-red-500/10 text-red-400 border border-red-500/15'
                                            : 'bg-gray-500/10 text-gray-400 border border-gray-500/15'
                            }`}>
                            {currentStepData.message}
                        </div>

                        {/* Work & Finish */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                                <h4 className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
                                    Work Vector
                                </h4>
                                <div className="flex gap-1.5">
                                    {currentStepData.work.map((w, j) => (
                                        <div key={j}
                                            className="w-10 h-8 flex items-center justify-center rounded-md bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 font-mono font-bold text-xs">
                                            {w}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h4 className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
                                    Finish Array
                                </h4>
                                <div className="flex gap-1 flex-wrap">
                                    {currentStepData.finish.map((f, i) => (
                                        <div key={i}
                                            className={`px-2 py-1 rounded-md font-mono text-[10px] font-semibold ${f ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-400'
                                                }`}>
                                            P{i}:{f ? '✓' : '✗'}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Current Safe Sequence */}
            {currentStepData?.sequence?.length > 0 && (
                <div>
                    <h4 className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
                        Sequence (so far)
                    </h4>
                    <div className="flex items-center gap-1 flex-wrap">
                        {currentStepData.sequence.map((processIdx, i) => (
                            <span key={i} className="flex items-center gap-0.5">
                                <span className="px-2 py-1 rounded-md bg-gradient-to-r from-violet-500 to-indigo-500 text-white font-mono text-[11px] font-bold shadow-sm">
                                    P{processIdx}
                                </span>
                                {i < currentStepData.sequence.length - 1 && (
                                    <span className="text-violet-400 font-bold text-xs">→</span>
                                )}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default memo(SimulationPanel);
