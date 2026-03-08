# Banker's Algorithm Simulator

A Python implementation of the **Banker's Algorithm** used in Operating Systems for deadlock avoidance.

The simulator allows users to input:
- Number of processes and resource types
- Resource **Allocation** matrix (currently held resources per process)
- **Maximum** demand matrix (max resources each process may ever need)
- **Available** resources vector

It then determines whether the system is in a **safe state** and outputs the safe execution sequence of processes. It also supports interactive simulation of resource requests.

---

## Project Structure

```
Banker_Algorithm/
├── banker.py        # Core algorithm: safety check & resource-request logic
├── main.py          # Interactive CLI simulator
├── test_banker.py   # Unit tests
└── README.md
```

---

## Getting Started

**Requirements:** Python 3.6 or later (no third-party libraries needed).

### Run the Simulator

```bash
python main.py
```

The program will prompt you step-by-step for all required inputs.

### Run the Tests

```bash
python -m unittest test_banker -v
```

---

## Example Session

Using the classic 5-process / 3-resource textbook example:

```
==================================================
    Banker's Algorithm Simulator
==================================================

Enter the number of processes: 5
Enter the number of resource types: 3

Enter the Allocation matrix
  P0: 0 1 0
  P1: 2 0 0
  P2: 3 0 2
  P3: 2 1 1
  P4: 0 0 2

Enter the Maximum demand matrix
  P0: 7 5 3
  P1: 3 2 2
  P2: 9 0 2
  P3: 2 2 2
  P4: 4 3 3

Enter the Available resources (3 values): 3 3 2

...

System is in a SAFE state.
Safe sequence: P1 -> P3 -> P0 -> P2 -> P4
```

---

## How It Works

### Safety Algorithm
1. Compute the **Need** matrix: `Need[i][j] = Maximum[i][j] - Allocation[i][j]`
2. Simulate process execution: find a process whose need can be satisfied by currently available resources, "finish" it, and release its resources.
3. Repeat until all processes finish (safe) or no progress can be made (unsafe).

### Resource-Request Algorithm
1. Verify the request does not exceed the process's declared maximum need.
2. Verify the request does not exceed currently available resources.
3. Tentatively allocate and run the safety algorithm. Grant only if the resulting state is safe.
