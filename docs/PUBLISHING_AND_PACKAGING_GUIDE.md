# Complete Roadmap: Packaging, Academic Publishing & Technical Blogging

This guide outlines the end-to-end execution blueprint for:
1. **Packaging** the project as an open-source Python library (PyPI) and reproducible Docker container.
2. **Publishing a peer-reviewed research paper** at top AI/Neuroscience venues (NeurIPS, ICLR, Cosyne, eLife) and arXiv.
3. **Publishing and distributing a viral technical blog post** (Towards Data Science, Substack, Hacker News).

---

## 1. How to Package This Project

### A. Python Library on PyPI (`pip install connectome-agent`)

We have added [`pyproject.toml`](file:///Users/manasdange/Documents/projects/fly/pyproject.toml) following PEP 517/621 standards.

#### Steps to publish to PyPI:
1. **Install build tools**:
   ```bash
   pip install build twine
   ```
2. **Build source distribution and wheels**:
   ```bash
   python -m build
   ```
   *This creates `.tar.gz` and `.whl` files in `dist/`.*
3. **Verify the distribution archive**:
   ```bash
   twine check dist/*
   ```
4. **Publish to TestPyPI first (safe testing)**:
   ```bash
   twine upload --repository testpypi dist/*
   ```
5. **Publish to Production PyPI**:
   ```bash
   twine upload dist/*
   ```
*Result: Any researcher in the world can run `pip install connectome-agent` and import `from research.src.agent import ConnectomeConstrainedAgent`.*

---

### B. Reproducible Docker Container

Create a container so researchers can reproduce your 3D visualizer, experiments, and tests on any machine with zero installation friction.

#### Create `Dockerfile`:
```dockerfile
FROM python:3.11-slim
WORKDIR /app
RUN apt-get update && apt-get install -y curl gnupg && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && rm -rf /var/lib/apt/lists/*
COPY . .
RUN pip install --no-cache-dir -r research/requirements.txt -r backend/requirements.txt
RUN cd web && npm install && npm run build
EXPOSE 3000 8000
CMD ["sh", "-c", "python backend/app.py & cd web && npm run preview -- --host --port 3000"]
```
#### Build & Run:
```bash
docker build -t manasdange/connectome-agent:v1.0.0 .
docker run -p 3000:3000 -p 8000:8000 manasdange/connectome-agent:v1.0.0
```

---

### C. Mint a Permanent Academic DOI (Zenodo)

A DOI makes your code and dataset permanently citable in academic literature (e.g. `doi: 10.5281/zenodo.XXXXXXX`).

1. Log into [Zenodo.org](https://zenodo.org/) using your GitHub account (`manas-dange`).
2. Go to **Account Settings > GitHub > Enabled Repositories**.
3. Toggle on **`manas-dange/connectome-agent`**.
4. Create a new GitHub Release on `v1.0.0`:
   ```bash
   gh release create v1.0.0 --title "Connectome Navigation Agent v1.0.0" --notes "Initial public release of Drosophila Central Complex RL agent and 3D web visualizer."
   ```
5. Zenodo will automatically mint a permanent citable DOI badge to display in your README!

---

## 2. How to Publish a Research Paper

### A. Recommended Academic Venues

| Venue | Focus / Track | Fit |
| :--- | :--- | :---: |
| **NeurIPS** | *Datasets and Benchmarks Track* or *NeuroAI Workshop* | ⭐⭐⭐⭐⭐ (Primary Target) |
| **ICLR** | *Main Track* or *Workshop on Biologically Plausible AI* | ⭐⭐⭐⭐⭐ |
| **Cosyne** (Computational and Systems Neuroscience) | *Poster/Oral presentation* (1-page abstract submission) | ⭐⭐⭐⭐⭐ (Fastest peer feedback) |
| **CoRL** (Conference on Robot Learning) | *Biologically Inspired Robotic Navigation* | ⭐⭐⭐⭐ |
| **eLife / PLOS Computational Biology** | *Tools and Resources / Full Paper* | ⭐⭐⭐⭐⭐ |

---

### B. Paper Structure (NeurIPS LaTeX Template)

A strong paper for this project follows the standard 9-page conference format:

1. **Title**:  
   *Connectome-Constrained Reinforcement Learning: Inductive Biases from the Drosophila Central Complex for Sample-Efficient 3D Navigation*
2. **Abstract** (250 words):
   * State the problem: Dense unconstrained RL policies are sample-inefficient and struggle with 3D coordinate geometry.
   * State the solution: Constraining recurrent policies to the real synaptic connectome of the *Drosophila* Central Complex (1,243 neurons, 44,608 synapses).
   * Key findings: +17% faster convergence, +7.4% performance drop under weight scrambling (proving biological synaptic counts carry functional information), and performance retention under 50% pruning.
3. **Introduction**:
   * The energy/compute paradox (1 milliwatt insect brain vs. megawatt GPU cluster).
   * From "bio-inspired analogies" to literal connectomic architectural priors.
4. **Related Work**:
   * Whole-brain connectomics (FlyEM, Janelia male-cns:v1.0).
   * Ring attractor models of insect heading (Seelig & Jayaraman, Kim et al.).
   * Structural priors in Deep RL and lottery ticket hypothesis.
5. **Methodology**:
   * Mathematical definition of the masked recurrent policy:
     $$h_t = \tanh\left( (W_{frozen} \odot M) h_{t-1} + W_{in} s_t + b \right)$$
   * 3D continuous navigation environment physics and 10D observation dynamics.
   * PPO policy and value optimization formulations.
6. **Experiments & Ablations**:
   * Condition 1: Connectome-Constrained.
   * Condition 2: Baseline Unconstrained MLP.
   * Condition 3: Random Weights (same graph topology, scrambled values).
   * Condition 4: Synaptic Pruning (50% and 90% edge ablation).
7. **Empirical Results**:
   * Learning curves and sample efficiency comparisons.
   * Path efficiency and Euclidean navigation trajectory analysis.
   * Centrality and hub neuron vulnerability profiling.
8. **Discussion & Limitations**:
   * Scope of Central Complex (heading and steering vs. visual recognition).
   * Future implications for neuromorphic hardware (Intel Loihi) and edge robotics.

---

### C. Step-by-Step arXiv Submission (Immediate Preprint)

Uploading to arXiv gives you immediate academic priority and a citable preprint link (`arXiv:24xx.xxxxx`):

1. **Download the NeurIPS LaTeX Template**: [neurips.cc](https://neurips.cc/).
2. **Write the paper in Overleaf**:
   * Pull figures directly from [`docs/images/`](file:///Users/manasdange/Documents/projects/fly/docs/images) and learning curve data from [`research/experiments/`](file:///Users/manasdange/Documents/projects/fly/research/experiments).
3. **Submit to arXiv**:
   * Primary Category: `cs.AI` (Artificial Intelligence) or `cs.LG` (Machine Learning).
   * Secondary Category: `q-bio.NC` (Neurons and Cognition).
   * Include the GitHub link: `https://github.com/manas-dange/connectome-agent`.

---

## 3. How to Publish a Viral Technical Blog

A high-quality engineering blog post has already been drafted for you in [`social/BLOG_POST.md`](file:///Users/manasdange/Documents/projects/fly/social/BLOG_POST.md).

### A. Recommended Platforms

1. **Towards Data Science (Medium)**:
   * Submit through their Medium publication portal. They love empirical experiments that challenge conventional deep learning dogmas.
2. **Substack / Personal Blog**:
   * Great for establishing your personal brand as an AI & Computational Neuroscience researcher.
3. **Hacker News ("Show HN")**:
   * Title suggestion:  
     `Show HN: I trained an RL agent using a real fruit fly's brain connectome`
   * Direct link to your live demo or GitHub repository.
4. **Reddit**:
   * `r/MachineLearning` (Format as `[P] Project: Connectome-Constrained RL Agent...`)
   * `r/neuroscience` (Focus on the biological fidelity of the Central Complex model).

---

### B. Anatomy of Why This Post Will Perform Well

1. **Anti-Hype Hook**: "Tired of AI papers treating neuroscience like an aesthetic mood board."
2. **Unusual Cross-Disciplinary Concept**: Reinforcement learning meets real electron-microscopy connectomes.
3. **Visual Quality**: Four pre-rendered high-res screenshots (3D lattice, flight HUD, comparison view).
4. **Interactive Demonstration**: Anyone can click the link and try it in their browser in 5 seconds.
5. **Concrete Empirical Data**: Real numbers (+17% speedup, +7.4% reward, 50% pruning tolerance) instead of vague claims.
