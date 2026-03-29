import { useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, ChevronDown, ChevronUp } from 'lucide-react';

const sections = [
    {
        title: '🔒 What is Deadlock?',
        content: `A deadlock occurs when two or more processes are blocked forever, each waiting for the other to release a resource. None of the processes can proceed, and the system is stuck.\n\nExample: Process A holds Resource 1 and needs Resource 2, while Process B holds Resource 2 and needs Resource 1. Neither can proceed.`,
    },
    {
        title: '⚠️ Four Necessary Conditions',
        content: `All four must hold simultaneously:\n\n1. **Mutual Exclusion** — At least one resource is held in a non-shareable mode\n2. **Hold and Wait** — A process holds at least one resource and waits for more\n3. **No Preemption** — Resources cannot be forcibly taken from a process\n4. **Circular Wait** — A circular chain of processes exists, each waiting for a resource held by the next`,
    },
    {
        title: '🟢 Safe vs Unsafe State',
        content: `**Safe State:** The system can allocate resources to each process in some order and still avoid deadlock.\n\n**Unsafe State:** No safe sequence exists. This does NOT mean deadlock has occurred — it means deadlock is *possible*.\n\n**Key insight:** Every deadlocked state is unsafe, but not every unsafe state leads to deadlock.`,
    },
    {
        title: '🛡️ Avoidance vs Prevention',
        content: `**Prevention:** Ensure at least one of the four necessary conditions cannot hold. Conservative, but may limit resource utilization.\n\n**Avoidance:** Allow all four conditions to potentially hold, but make smart choices. The Banker's Algorithm checks if granting a request would leave the system in a safe state.`,
    },
    {
        title: '🏦 Bank Loan Analogy',
        content: `Think of the OS as a bank with limited cash (resources), and processes as customers with credit limits (max demand).\n\n- The bank knows each customer's maximum credit need\n- Before approving a loan, the bank checks: "If I approve this, can I still satisfy all customers?"\n- If yes → grant the loan (safe state)\n- If no → deny and make the customer wait (avoid unsafe state)`,
    },
    {
        title: '⏱️ Time Complexity',
        content: `The Banker's Safety Algorithm runs in **O(n² × m)** time, where:\n- **n** = number of processes\n- **m** = number of resource types\n\nIn each iteration, we scan all n processes to find one that can execute (O(n × m) per scan), and we do at most n iterations.`,
    },
];

/**
 * EducationalSection — Collapsible bottom accordion.
 * Collapsed by default. Does not affect main dashboard layout when collapsed.
 */
function EducationalSection() {
    const [isExpanded, setIsExpanded] = useState(false);
    const [openIndex, setOpenIndex] = useState(-1);

    const toggle = (i) => setOpenIndex(openIndex === i ? -1 : i);

    return (
        <div className="border-t border-gray-200/40 dark:border-gray-700/20">
            {/* Master Toggle */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-semibold text-gray-500 dark:text-gray-400 hover:text-violet-500 dark:hover:text-violet-400 transition-colors"
            >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Learn: Deadlock & Banker's Algorithm</span>
                {isExpanded
                    ? <ChevronUp className="w-3.5 h-3.5" />
                    : <ChevronDown className="w-3.5 h-3.5" />
                }
            </button>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <div className="max-w-5xl mx-auto px-4 pb-4 space-y-1.5">
                            {sections.map((sec, i) => (
                                <div key={i} className="rounded-lg border border-gray-200/50 dark:border-gray-700/25 overflow-hidden">
                                    <button
                                        onClick={() => toggle(i)}
                                        className="w-full flex items-center justify-between px-3 py-2.5 text-left hover:bg-gray-50 dark:hover:bg-gray-700/20 transition-colors"
                                    >
                                        <span className="font-semibold text-gray-700 dark:text-gray-300 text-xs">{sec.title}</span>
                                        {openIndex === i
                                            ? <ChevronUp className="w-3.5 h-3.5 text-gray-400" />
                                            : <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                                        }
                                    </button>
                                    <AnimatePresence>
                                        {openIndex === i && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.25 }}
                                            >
                                                <div className="px-3 pb-3 text-xs text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                                                    {sec.content}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default memo(EducationalSection);
