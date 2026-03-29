import { memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, BarChart3, ScrollText, Inbox } from 'lucide-react';

const tabs = [
    { id: 'simulation', label: 'Simulation', icon: Zap },
    { id: 'graphs', label: 'Graphs', icon: BarChart3 },
    { id: 'logs', label: 'Logs', icon: ScrollText },
];

const tabVariants = {
    enter: { opacity: 0, x: 16 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -16 },
};

function DashboardTabs({ activeTab, onTabChange, children, hasResult }) {
    return (
        <div className="flex flex-col h-full">
            {/* Tab Bar */}
            <div className="flex-shrink-0 px-4 pt-3 pb-2">
                <div className="tab-bar">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => onTabChange(tab.id)}
                                className={`tab-btn ${activeTab === tab.id ? 'tab-active' : ''}`}
                            >
                                <Icon className="w-3.5 h-3.5" />
                                <span className="hidden sm:inline">{tab.label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto px-4 pb-4">
                {!hasResult ? (
                    <div className="flex flex-col items-center justify-center h-full text-center py-16 opacity-50">
                        <Inbox className="w-12 h-12 text-gray-400 dark:text-gray-500 mb-3" />
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                            Run the simulation to see results
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                            Configure inputs on the left, then press Run
                        </p>
                    </div>
                ) : (
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            variants={tabVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.2, ease: 'easeOut' }}
                            className="h-full"
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                )}
            </div>
        </div>
    );
}

export default memo(DashboardTabs);
