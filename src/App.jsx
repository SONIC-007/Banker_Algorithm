import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, Cpu, Play, Minimize2, Maximize2 } from 'lucide-react';
import InputPanel from './components/InputPanel';
import MatrixDisplay from './components/MatrixDisplay';
import SimulationPanel from './components/SimulationPanel';
import GraphSection from './components/GraphSection';
import LogsPanel from './components/LogsPanel';
import EducationalSection from './components/EducationalSection';
import DashboardTabs from './components/DashboardTabs';
import {
    runSafetyAlgorithm,
    calculateNeedMatrix,
    validateInputs,
    generateRandomExample,
    getStandardExample,
    getUnsafeExample,
} from './utils/bankerAlgorithm';

function App() {
    // Theme
    const [darkMode, setDarkMode] = useState(true);

    // Input state
    const [numProcesses, setNumProcesses] = useState(5);
    const [numResources, setNumResources] = useState(3);
    const [available, setAvailable] = useState([3, 3, 2]);
    const [max, setMax] = useState([
        [7, 5, 3], [3, 2, 2], [9, 0, 2], [2, 2, 2], [4, 3, 3],
    ]);
    const [allocation, setAllocation] = useState([
        [0, 1, 0], [2, 0, 0], [3, 0, 2], [2, 1, 1], [0, 0, 2],
    ]);

    // Simulation state
    //Developed user interface for input matrices 
    

    // Resize matrices
    const resizeMatrices = useCallback((newP, newR) => {
        const resizeMatrix = (matrix, rows, cols) => {
            const m = [];
            for (let i = 0; i < rows; i++) {
                m[i] = [];
                for (let j = 0; j < cols; j++) {
                    m[i][j] = matrix[i]?.[j] ?? 0;
                }
            }
            return m;
        };
        const resizeVector = (vec, len) => {
            const v = [];
            for (let j = 0; j < len; j++) v[j] = vec[j] ?? 0;
            return v;
        };
        setMax(prev => resizeMatrix(prev, newP, newR));
        setAllocation(prev => resizeMatrix(prev, newP, newR));
        setAvailable(prev => resizeVector(prev, newR));
    }, []);

    const handleProcessChange = (val) => {
        const newP = Math.max(1, Math.min(10, val));
        setNumProcesses(newP);
        resizeMatrices(newP, numResources);
        resetSimulation();
    };

    const handleResourceChange = (val) => {
        const newR = Math.max(1, Math.min(6, val));
        setNumResources(newR);
        resizeMatrices(numProcesses, newR);
        resetSimulation();
    };

    // Run simulation
    const runSimulation = useCallback(() => {
        const validationErrors = validateInputs(available, max, allocation, numProcesses, numResources);
        if (validationErrors.length > 0) {
            setErrors(validationErrors);
            return;
        }
        setErrors([]);
        const res = runSafetyAlgorithm(available, max, allocation);
        setResult(res);
        setCurrentStep(-1);
        setLogs(res.steps.map(s => s.message));
        setIsRunning(false);
        setActiveTab('simulation');
    }, [available, max, allocation, numProcesses, numResources]);

    // Step controls
    const nextStep = useCallback(() => {
        if (!result) return;
        setCurrentStep(prev => Math.min(prev + 1, result.steps.length - 1));
    }, [result]);

    const prevStep = useCallback(() => {
        setCurrentStep(prev => Math.max(prev - 1, -1));
    }, []);

    const startAutoRun = useCallback(() => {
        if (!result) return;
        setIsRunning(true);
        setCurrentStep(-1);
    }, [result]);

    useEffect(() => {
        if (isRunning && result) {
            intervalRef.current = setInterval(() => {
                setCurrentStep(prev => {
                    const next = prev + 1;
                    if (next >= result.steps.length) {
                        setIsRunning(false);
                        clearInterval(intervalRef.current);
                        return result.steps.length - 1;
                    }
                    return next;
                });
            }, speed);
            return () => clearInterval(intervalRef.current);
        }
    }, [isRunning, result, speed]);

    const pauseAutoRun = useCallback(() => {
        setIsRunning(false);
        clearInterval(intervalRef.current);
    }, []);

    const resetSimulation = useCallback(() => {
        setResult(null);
        setCurrentStep(-1);
        setIsRunning(false);
        setLogs([]);
        setErrors([]);
        clearInterval(intervalRef.current);
    }, []);

    // Example loaders
    const loadRandomExample = useCallback(() => {
        const ex = generateRandomExample(numProcesses, numResources);
        setAvailable(ex.available);
        setMax(ex.max);
        setAllocation(ex.allocation);
        resetSimulation();
    }, [numProcesses, numResources, resetSimulation]);

    const loadStandardExample = useCallback(() => {
        const ex = getStandardExample();
        setNumProcesses(ex.numProcesses);
        setNumResources(ex.numResources);
        setAvailable(ex.available);
        setMax(ex.max);
        setAllocation(ex.allocation);
        resetSimulation();
    }, [resetSimulation]);

    const loadUnsafeExample = useCallback(() => {
        const ex = getUnsafeExample();
        setNumProcesses(ex.numProcesses);
        setNumResources(ex.numResources);
        setAvailable(ex.available);
        setMax(ex.max);
        setAllocation(ex.allocation);
        resetSimulation();
    }, [resetSimulation]);

    // Tab content renderer
    const renderTabContent = () => {
        switch (activeTab) {
            case 'simulation':
                return (
                    <SimulationPanel
                        result={result}
                        currentStep={currentStep}
                        currentStepData={currentStepData}
                        isRunning={isRunning}
                        speed={speed}
                        onSpeedChange={setSpeed}
                        onNextStep={nextStep}
                        onPrevStep={prevStep}
                        onAutoRun={startAutoRun}
                        onPause={pauseAutoRun}
                        onReset={() => { setCurrentStep(-1); setIsRunning(false); }}
                    />
                );
            case 'graphs':
                return (
                    <GraphSection
                        available={available}
                        max={max}
                        allocation={allocation}
                        needMatrix={needMatrix}
                        numProcesses={numProcesses}
                        numResources={numResources}
                        result={result}
                        currentStepData={currentStepData}
                    />
                );
            case 'logs':
                return <LogsPanel logs={logs} currentStep={currentStep} result={result} />;
            default:
                return null;
        }
    };

    return (
        <div className={`h-screen flex flex-col transition-colors duration-300 ${darkMode
                ? 'bg-gradient-to-br from-gray-950 via-gray-900 to-violet-950'
                : 'bg-gradient-to-br from-slate-50 via-violet-50/50 to-indigo-50'
            }`}>
            {/* ===== Header ===== */}
            <header className="flex-shrink-0 h-14 flex items-center justify-between px-4 sm:px-6 border-b border-gray-200/20 dark:border-gray-700/20 bg-white/50 dark:bg-gray-900/50 backdrop-blur-md z-50">
                <div className="flex items-center gap-2.5">
                    <div className="p-1.5 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 shadow-md shadow-violet-500/20">
                        <Cpu className="w-4 h-4 text-white" />
                    </div>
                    <div>
                        <h1 className="text-sm font-bold gradient-text leading-tight">Banker's Algorithm</h1>
                        <p className="text-[10px] text-gray-400 dark:text-gray-500 leading-tight">Deadlock Avoidance Simulator</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {/* Compact toggle */}
                    <button
                        onClick={() => setCompact(!compact)}
                        className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700/50 hover:bg-gray-200 dark:hover:bg-gray-600/50 transition-colors"
                        title={compact ? 'Expand view' : 'Compact view'}
                    >
                        {compact
                            ? <Maximize2 className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
                            : <Minimize2 className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
                        }
                    </button>
                    {/* Theme toggle */}
                    <button
                        onClick={() => setDarkMode(!darkMode)}
                        className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700/50 hover:bg-gray-200 dark:hover:bg-gray-600/50 transition-colors"
                        aria-label="Toggle theme"
                    >
                        <AnimatePresence mode="wait">
                            {darkMode ? (
                                <motion.div key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                                    <Sun className="w-3.5 h-3.5 text-amber-400" />
                                </motion.div>
                            ) : (
                                <motion.div key="moon" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                                    <Moon className="w-3.5 h-3.5 text-violet-600" />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </button>
                </div>
            </header>

            {/* ===== Dashboard Grid ===== */}
            <main className="flex-1 dashboard-grid min-h-0">
                {/* Left Panel — Config & Matrices */}
                <div className="panel panel-scroll p-4 space-y-4">
                    <InputPanel
                        numProcesses={numProcesses}
                        numResources={numResources}
                        available={available}
                        max={max}
                        allocation={allocation}
                        onProcessChange={handleProcessChange}
                        onResourceChange={handleResourceChange}
                        onAvailableChange={setAvailable}
                        onMaxChange={setMax}
                        onAllocationChange={setAllocation}
                        onRandomExample={loadRandomExample}
                        onStandardExample={loadStandardExample}
                        onUnsafeExample={loadUnsafeExample}
                        onReset={resetSimulation}
                        errors={errors}
                        compact={compact}
                    />

                    <div className="section-divider" />

                    {/* Need Matrix */}
                    <MatrixDisplay
                        title="Need Matrix"
                        subtitle="Need = Max − Allocation"
                        matrix={needMatrix}
                        numProcesses={numProcesses}
                        numResources={numResources}
                        highlightRow={currentStepData?.processIndex ?? -1}
                        compact={compact}
                    />
                </div>

                {/* Right Panel — Tabbed Area */}
                <div className="h-full min-h-0 overflow-hidden">
                    <DashboardTabs
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                        hasResult={!!result}
                    >
                        {renderTabContent()}
                    </DashboardTabs>
                </div>
            </main>

            {/* ===== Collapsible Learn Section ===== */}
            <EducationalSection />

            {/* ===== Floating Run Button ===== */}
            <AnimatePresence>
                {!result && (
                    <motion.button
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                        onClick={runSimulation}
                        className="fab"
                    >
                        <Play className="w-4 h-4" />
                        <span className="text-sm">Run Simulation</span>
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    );
}

export default App;
