# Connectome Navigator Web Demo
 
An interactive 3D web visualizer built with **React 18**, **Vite**, and **Three.js** to explore the *Drosophila melanogaster* Central Complex connectome and observe reinforcement learning agents navigating in 3D.

> 🚀 **Live Demo:** [https://connectome-agent.vercel.app/](https://connectome-agent.vercel.app/)

---

## Features

- **Hardware-Accelerated 3D Connectome**: 1,243 Central Complex neurons rendered at 60 FPS using `THREE.InstancedMesh`.
- **Dynamic Synapse Activity**: `LineSegments` pulsing with biological synaptic strength.
- **Interactive Raycasting**: Hover over any neuron to inspect anatomical metadata (Body ID, cell type, neuropil, degree, coordinates).
- **Trajectory Replay Controller**: Play, pause, step through, and adjust playback speed for multi-step agent navigation episodes.
- **Head-to-Head Comparison Mode**: Juxtaposes Connectome-Constrained vs. Baseline agents navigating to the same spatial target.
- **Live Metrics Dashboard**: Responsive Recharts graphs showing comparative learning curves, path efficiency, and neuron activations.

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Production Build
```bash
npm run build
npm run preview
```
The static build is bundled into `web/dist/` ready for zero-config deployment on Vercel, Netlify, or GitHub Pages.
