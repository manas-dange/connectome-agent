# Installation & Setup Guide

This guide provides instructions for setting up the Python research pipeline, running the automated test suite, launching the interactive web demo, and deploying the optional FastAPI backend.

---

## 1. System Requirements

- **Operating System**: macOS, Linux, or Windows (WSL2 recommended)
- **Python**: Version 3.9, 3.10, 3.11, or 3.12
- **Node.js**: Version 18+ (with npm)
- **Hardware**: CPU-only works great (subgraphs are ~1k-3k neurons); CUDA/MPS accelerated GPU supported automatically if available.

---

## 2. Research Environment (Python)

### Step 1: Clone Repository
```bash
git clone https://github.com/manas-dange/connectome-agent.git
cd connectome-agent
```

### Step 2: Create Virtual Environment
```bash
python3 -m venv venv
source venv/bin/activate
# On Windows: venv\Scripts\activate
```

### Step 3: Install Research Dependencies
```bash
pip install --upgrade pip
pip install -r research/requirements.txt
```

### Step 4: Configure neuPrint API Token (Optional)
If you wish to query the live HHMI Janelia database:
1. Register for an account at [neuprint.janelia.org](https://neuprint.janelia.org/).
2. Copy your authentication token under your user profile.
3. Export it as an environment variable:
   ```bash
   export NEUPRINT_TOKEN="your_token_here"
   ```
*(Note: If no token is provided, `ConnectomeData` automatically generates a biologically calibrated Central Complex connectome matching Janelia male-cns:v1.0 properties, allowing full offline operation!)*

### Step 5: Run Automated Tests
```bash
PYTHONPATH=. pytest research/tests -v
```
You should see all 14 unit tests pass.

---

## 3. Interactive Web Demo (React + Vite + Three.js)

> 💡 **Instant Live Access:** You can explore the pre-deployed 3D simulator directly at **[https://connectome-agent.vercel.app/](https://connectome-agent.vercel.app/)** without local setup.

### Step 1: Navigate to the Web Directory
```bash
cd web
```

### Step 2: Install Node Dependencies
```bash
npm install
```

### Step 3: Start Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your web browser.

### Step 4: Production Build
```bash
npm run build
# Preview production build locally:
npm run preview -- --port 4173
```

---

## 4. Live Inference Backend (FastAPI - Optional)

For live single-step policy evaluation and real-time trajectory simulation:

```bash
cd backend
pip install -r requirements.txt
python app.py
# Server starts at http://localhost:8000
# Interactive Swagger docs: http://localhost:8000/docs
```

---

## 5. Troubleshooting & FAQ

### Issue: `ModuleNotFoundError: No module named 'research'`
**Solution**: Ensure `PYTHONPATH=.` is prefixed to your command or that you are in the project root:
```bash
PYTHONPATH=. pytest research/tests -v
```

### Issue: `neuprint.client.ClientException: Unauthorized`
**Solution**: Check your `NEUPRINT_TOKEN`. If running offline or without credentials, unset the variable (`unset NEUPRINT_TOKEN`) to allow automatic fallback to the synthetic Central Complex generator.

### Issue: Web visualizer shows blank screen or WebGL error
**Solution**: Ensure hardware acceleration is enabled in your browser settings (`chrome://settings/system`).
