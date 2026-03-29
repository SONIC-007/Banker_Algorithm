/**
 * Banker's Algorithm - Core Logic
 * ================================
 * 
 * The Banker's Algorithm is a deadlock avoidance algorithm used in Operating Systems.
 * It was developed by Edsger Dijkstra and is named after the way banks manage loans.
 * 
 * KEY CONCEPTS:
 * - Available: Vector of currently available resources of each type
 * - Max: Matrix defining maximum demand of each process
 * - Allocation: Matrix defining resources currently allocated to each process
 * - Need: Matrix defining remaining resource need (Need = Max - Allocation)
 * 
 * SAFETY ALGORITHM:
 * 1. Let Work = Available, Finish[i] = false for all i
 * 2. Find process i such that Finish[i] == false AND Need[i] <= Work
 * 3. Work = Work + Allocation[i], Finish[i] = true, go to step 2
 * 4. If all Finish[i] == true → system is in SAFE state
 *    Otherwise → system is in UNSAFE state (deadlock possible)
 * 
 * TIME COMPLEXITY: O(n² × m) where n = processes, m = resource types
 */

/**
 * Calculate Need Matrix = Max - Allocation
 * Each entry Need[i][j] = Max[i][j] - Allocation[i][j]
 * represents how many more resources process i may need of type j
 */
export function calculateNeedMatrix(max, allocation) {
    const n = max.length;
    const m = max[0].length;
    const need = [];
    for (let i = 0; i < n; i++) {
        need[i] = [];
        for (let j = 0; j < m; j++) {
            need[i][j] = max[i][j] - allocation[i][j];
        }
    }
    return need;
}

/**
 * Run the Banker's Safety Algorithm
 * Returns detailed step-by-step execution for visualization
 * 
 * @param {number[]} available - Available resources vector
 * @param {number[][]} max - Maximum demand matrix
 * @param {number[][]} allocation - Current allocation matrix
 * @returns {{ safe: boolean, sequence: number[], steps: object[] }}
 */
export function runSafetyAlgorithm(available, max, allocation) {
    const n = max.length;       // Number of processes
    const m = available.length; // Number of resource types
    const need = calculateNeedMatrix(max, allocation);

    // Step 1: Initialize Work = Available, Finish = [false, false, ...]
    let work = [...available];
    const finish = new Array(n).fill(false);
    const sequence = [];
    const steps = [];

    // Record initial state
    steps.push({
        type: 'init',
        message: `Initialized: Work = [${work.join(', ')}], all processes unfinished`,
        work: [...work],
        finish: [...finish],
        sequence: [],
        processIndex: -1,
    });

    // Step 2 & 3: Repeat finding a safe process
    let found = true;
    while (found) {
        found = false;
        for (let i = 0; i < n; i++) {
            if (finish[i]) continue;

            // Check if Need[i] <= Work (for all resource types)
            let canAllocate = true;
            for (let j = 0; j < m; j++) {
                if (need[i][j] > work[j]) {
                    canAllocate = false;
                    break;
                }
            }

            if (canAllocate) {
                // Step 3: Process i can complete — release its resources
                steps.push({
                    type: 'check_pass',
                    message: `P${i}: Need [${need[i].join(', ')}] ≤ Work [${work.join(', ')}] ✓ — Process can execute`,
                    work: [...work],
                    finish: [...finish],
                    sequence: [...sequence],
                    processIndex: i,
                    need: [...need[i]],
                    allocation: [...allocation[i]],
                });

                // Work = Work + Allocation[i] (process releases resources after completion)
                for (let j = 0; j < m; j++) {
                    work[j] += allocation[i][j];
                }
                finish[i] = true;
                sequence.push(i);

                steps.push({
                    type: 'allocate',
                    message: `P${i}: Completed! Work = Work + Allocation[${i}] = [${work.join(', ')}]`,
                    work: [...work],
                    finish: [...finish],
                    sequence: [...sequence],
                    processIndex: i,
                });

                found = true;
                break; // Restart the search from the beginning
            } else {
                // Log skipped process
                steps.push({
                    type: 'check_fail',
                    message: `P${i}: Need [${need[i].join(', ')}] > Work [${work.join(', ')}] ✗ — Cannot execute yet`,
                    work: [...work],
                    finish: [...finish],
                    sequence: [...sequence],
                    processIndex: i,
                    need: [...need[i]],
                });
            }
        }
    }

    // Step 4: Check if all processes finished
    const safe = finish.every(f => f);

    steps.push({
        type: 'result',
        message: safe
            ? `✅ SAFE STATE: All processes can complete. Safe sequence: ${sequence.map(i => `P${i}`).join(' → ')}`
            : `❌ UNSAFE STATE: Deadlock possible! Processes ${finish.map((f, i) => !f ? `P${i}` : null).filter(Boolean).join(', ')} cannot complete.`,
        work: [...work],
        finish: [...finish],
        sequence: [...sequence],
        processIndex: -1,
    });

    return { safe, sequence, steps, need, finalWork: work };
}

/**
 * Validate all inputs before running the algorithm
 * Checks:
 * - All values are non-negative integers
 * - Allocation[i][j] <= Max[i][j] for all i, j
 * - Sum of Allocation columns + Available >= 0 (resource consistency)
 */
export function validateInputs(available, max, allocation, numProcesses, numResources) {
    const errors = [];

    // Check dimensions
    if (available.length !== numResources) {
        errors.push('Available vector length must match number of resource types');
    }
    if (max.length !== numProcesses || allocation.length !== numProcesses) {
        errors.push('Matrix rows must match number of processes');
    }

    // Check non-negative values
    for (let j = 0; j < numResources; j++) {
        if (available[j] < 0 || !Number.isInteger(available[j])) {
            errors.push(`Available[${j}] must be a non-negative integer`);
        }
    }

    for (let i = 0; i < numProcesses; i++) {
        if (max[i]?.length !== numResources || allocation[i]?.length !== numResources) {
            errors.push(`Row ${i} must have ${numResources} columns`);
            continue;
        }
        for (let j = 0; j < numResources; j++) {
            if (max[i][j] < 0 || !Number.isInteger(max[i][j])) {
                errors.push(`Max[${i}][${j}] must be a non-negative integer`);
            }
            if (allocation[i][j] < 0 || !Number.isInteger(allocation[i][j])) {
                errors.push(`Allocation[${i}][${j}] must be a non-negative integer`);
            }
            if (allocation[i][j] > max[i][j]) {
                errors.push(`Allocation[${i}][${j}] (${allocation[i][j]}) exceeds Max[${i}][${j}] (${max[i][j]})`);
            }
        }
    }

    return errors;
}

/**
 * Generate a random valid example
 * Ensures Allocation <= Max and Available is positive
 */
export function generateRandomExample(numProcesses, numResources) {
    const totalPerResource = [];
    const max = [];
    const allocation = [];

    // Generate max and allocation matrices
    for (let i = 0; i < numProcesses; i++) {
        max[i] = [];
        allocation[i] = [];
        for (let j = 0; j < numResources; j++) {
            max[i][j] = Math.floor(Math.random() * 10) + 1; // 1-10
            allocation[i][j] = Math.floor(Math.random() * (max[i][j] + 1)); // 0 to max
        }
    }

    // Calculate available = total - sum(allocation)
    // Set total resources so available is positive
    const available = [];
    for (let j = 0; j < numResources; j++) {
        let sumAlloc = 0;
        for (let i = 0; i < numProcesses; i++) {
            sumAlloc += allocation[i][j];
        }
        // Ensure available is at least 1 and at most 5
        available[j] = Math.floor(Math.random() * 5) + 1;
    }

    return { available, max, allocation };
}

/**
 * Standard OS Textbook Example (from Silberschatz "Operating System Concepts")
 * 5 processes, 3 resource types (A, B, C)
 * This example results in a SAFE state
 */
export function getStandardExample() {
    return {
        numProcesses: 5,
        numResources: 3,
        resourceNames: ['A', 'B', 'C'],
        available: [3, 3, 2],
        max: [
            [7, 5, 3],  // P0
            [3, 2, 2],  // P1
            [9, 0, 2],  // P2
            [2, 2, 2],  // P3
            [4, 3, 3],  // P4
        ],
        allocation: [
            [0, 1, 0],  // P0
            [2, 0, 0],  // P1
            [3, 0, 2],  // P2
            [2, 1, 1],  // P3
            [0, 0, 2],  // P4
        ],
        // Safe sequence: P1 → P3 → P4 → P0 → P2
    };
}

/**
 * Standard OS Textbook Example that results in an UNSAFE state
 * Useful for demonstrating deadlock detection
 */
export function getUnsafeExample() {
    return {
        numProcesses: 4,
        numResources: 3,
        resourceNames: ['A', 'B', 'C'],
        available: [1, 0, 0],
        max: [
            [4, 3, 2],  // P0
            [3, 2, 2],  // P1
            [5, 3, 3],  // P2
            [4, 4, 1],  // P3
        ],
        allocation: [
            [2, 1, 1],  // P0
            [2, 1, 1],  // P1
            [3, 2, 1],  // P2
            [2, 2, 0],  // P3
        ],
    };
}
