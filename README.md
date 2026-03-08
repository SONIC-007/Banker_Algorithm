# Banker_Algorithm
Banker’s Algorithm Simulator is a program that simulates the Banker’s Algorithm used in Operating Systems for deadlock avoidance. The simulator allows users to input processes, resource allocation, maximum resource requirements, and available resources to determine whether the system is in a safe state to generate the safe sequence of processes.
# 🏦 Banker's Algorithm Simulator

An interactive, visual simulator for the **Banker's Algorithm** — a classic deadlock avoidance technique in Operating Systems. Built with React, Vite, and Tailwind CSS, featuring step-by-step execution, animated visualizations, and an educational deep-dive.

## ✨ Features

- **Interactive Input** — Configure processes (1–10) and resource types (1–6), edit Allocation/Max matrices and the Available vector directly in the UI
- **Step-by-Step Simulation** — Walk through the safety algorithm one step at a time with full state visibility (Work vector, Finish array, Need comparison)
- **Auto-Run Mode** — Watch the algorithm execute automatically with adjustable speed control
- **Graphical Analysis** — Recharts-powered bar and area charts visualizing resource allocation, need, and availability
- **Preset Examples** — Load the classic Silberschatz textbook example (safe), an unsafe-state example, or generate a random scenario
- **Input Validation** — Real-time validation ensures matrices are consistent (e.g., Allocation ≤ Max, non-negative integers)
- **Dark / Light Theme** — Toggle between a sleek dark mode and a clean light mode
- **Educational Section** — Collapsible panel explaining deadlock concepts, the Banker's Algorithm, and the Safety Algorithm
- **Execution Logs** — Timestamped log panel showing every check and allocation during the simulation
- **Responsive Dashboard** — CSS Grid layout with tabs (Simulation / Graphs / Logs), compact mode toggle, and a floating "Run" button

## 🛠 Tech Stack

| Layer        | Technology                              |
| ------------ | --------------------------------------- |
| Framework    | React 19                                |
| Bundler      | Vite 6                                  |
| Styling      | Tailwind CSS 3                          |
| Animations   | Framer Motion 12                        |
| Charts       | Recharts 2                              |
| Icons        | Lucide React                            |
| Fonts        | Inter, JetBrains Mono (Google Fonts)    |





## 📂 Project Structure

```
bankers-algorithm/
├── index.html                  # Entry HTML
├── vite.config.js              # Vite configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── postcss.config.js           # PostCSS plugins
├── package.json
├── src/
│   ├── main.jsx                # React entry point
│   ├── App.jsx                 # Root component & state management
│   ├── index.css               # Global styles & custom utilities
│   ├── components/
│   │   ├── InputPanel.jsx      # Process/resource config & matrix editors
│   │   ├── MatrixDisplay.jsx   # Read-only matrix renderer (Need matrix)
│   │   ├── SimulationPanel.jsx # Step-by-step execution & controls
│   │   ├── GraphSection.jsx    # Recharts visualizations
│   │   ├── LogsPanel.jsx       # Execution log viewer
│   │   ├── DashboardTabs.jsx   # Tab navigation (Simulation/Graphs/Logs)
│   │   └── EducationalSection.jsx # Collapsible theory & concepts
│   └── utils/
│       └── bankerAlgorithm.js  # Core algorithm, validation & examples
└── dist/                       # Production build output
```

## 📖 How It Works

1. **Configure** the number of processes and resource types
2. **Fill in** the Allocation matrix, Max matrix, and Available vector — or load a preset example
3. **Run** the Safety Algorithm (click the floating ▶ button)
4. **Step through** results manually or use Auto-Run to watch the algorithm animate
5. **Analyze** resource usage via the Graphs tab and review the Logs tab for a complete execution trace

### The Safety Algorithm (Simplified)



> **Time Complexity:** O(n² × m) — where *n* = number of processes, *m* = number of resource types.

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
