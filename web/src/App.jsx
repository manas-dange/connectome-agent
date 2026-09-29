import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { ConnectomeViewer } from './components/ConnectomeViewer';
import { AgentController } from './components/AgentController';
import { MetricsPanel } from './components/MetricsPanel';
import { ComparisonView } from './components/ComparisonView';
import { InfoModal } from './components/InfoModal';
import { FooterStrip } from './components/FooterStrip';
import { DocumentationView } from './components/DocumentationView';
import { AboutView } from './components/AboutView';
import { ErrorBoundary } from './components/ErrorBoundary';

export function App() {
  const [connectomeData, setConnectomeData] = useState(null);
  const [connectomeTraj, setConnectomeTraj] = useState(null);
  const [baselineTraj, setBaselineTraj] = useState(null);

  const getUrlParam = (key, fallback) => {
    if (typeof window === 'undefined') return fallback;
    const params = new URLSearchParams(window.location.search);
    return params.get(key) || fallback;
  };

  const [currentTab, setCurrentTab] = useState(() => getUrlParam('tab', 'demo'));
  const [viewMode, setViewMode] = useState(() => getUrlParam('view', 'single'));
  const [agentType, setAgentType] = useState('connectome'); // 'connectome' or 'baseline'
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Sync state changes with URL query parameters for deep linking
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    params.set('tab', currentTab);
    params.set('view', viewMode);
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(null, '', newUrl);
  }, [currentTab, viewMode]);

  // 1. Fetch Connectome and Trajectory Data
  useEffect(() => {
    Promise.all([
      fetch('/data/connectome.json').then((r) => r.json()),
      fetch('/data/trajectories/connectome/trajectory_1.json').then((r) => r.json()).catch(() => null),
      fetch('/data/trajectories/baseline/trajectory_1.json').then((r) => r.json()).catch(() => null),
    ])
      .then(([connectome, connTraj, baseTraj]) => {
        setConnectomeData(connectome);
        setConnectomeTraj(connTraj);
        setBaselineTraj(baseTraj);
        setIsLoading(false);

        // DESIGN.md §7.1: First-Time Visitor Flow — Auto-play short demo after 1.5s
        const timer = setTimeout(() => {
          setIsPlaying(true);
        }, 1500);
        return () => clearTimeout(timer);
      })
      .catch((err) => {
        console.error('Data initialization error:', err);
        setIsLoading(false);
      });
  }, []);

  // 2. Active Trajectory
  const activeTrajectory = agentType === 'connectome' ? connectomeTraj : baselineTraj;
  const totalSteps = activeTrajectory?.steps?.length || 200;

  // 3. Playback Loop (Variable speed)
  useEffect(() => {
    if (!isPlaying) return;

    const baseInterval = 80;
    const intervalMs = Math.max(16, Math.round(baseInterval / playbackSpeed));

    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev + 1 >= totalSteps) {
          // Loop playback
          return 0;
        }
        return prev + 1;
      });
    }, intervalMs);

    return () => clearInterval(interval);
  }, [isPlaying, totalSteps, playbackSpeed]);

  // Current Position & Dynamics
  const stepData = activeTrajectory?.steps?.[currentStep] || null;
  const currentPos = stepData?.position || [0, 0, 0];
  const goalPos = activeTrajectory?.goal || [35, 25, 15];
  const currentAction = stepData?.action ?? 0;

  const distanceToGoal = Math.hypot(
    currentPos[0] - goalPos[0],
    currentPos[1] - goalPos[1],
    currentPos[2] - goalPos[2]
  );

  // Cumulative reward progressive scaling
  const maxReward = activeTrajectory?.reward || (agentType === 'connectome' ? 95.2 : 88.9);
  const rewardProgress = (currentStep / Math.max(1, totalSteps - 1)) * maxReward;
  const efficiency = activeTrajectory?.path_efficiency || (agentType === 'connectome' ? 0.78 : 0.65);

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStep(0);
  };

  const handleSeek = (newStep) => {
    setCurrentStep(newStep);
  };

  if (isLoading) {
    return (
      <div style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-primary)',
        gap: 'var(--space-3)'
      }}>
        <div style={{
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          background: 'var(--accent-primary)',
        }} className="pulse-indicator" />
        <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Loading Central Complex Connectome...</span>
      </div>
    );
  }

  return (
    <>
      <Header
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onOpenInfo={() => setIsInfoOpen(true)}
      />

      {currentTab === 'docs' ? (
        <div className="page-container">
          <ErrorBoundary onReset={() => setCurrentTab('demo')}>
            <DocumentationView onNavigateToDemo={() => setCurrentTab('demo')} />
          </ErrorBoundary>
        </div>
      ) : currentTab === 'about' ? (
        <div className="page-container">
          <ErrorBoundary onReset={() => setCurrentTab('demo')}>
            <AboutView
              onNavigateToDemo={() => setCurrentTab('demo')}
              onNavigateToDocs={() => setCurrentTab('docs')}
            />
          </ErrorBoundary>
        </div>
      ) : viewMode === 'single' ? (
        <div className="app-container">
          {/* Main 3D Viewport (2fr) */}
          <main style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
            <ConnectomeViewer
              connectomeData={connectomeData}
              agentPosition={currentPos}
              goalPosition={goalPos}
              stepIndex={currentStep}
              isMini={false}
            />
          </main>

          {/* Control Column (380px) */}
          <aside style={{
            background: 'var(--bg-panel)',
            borderLeft: '1px solid var(--border-subtle)',
            padding: 'var(--space-4)',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-3)'
          }}>
            <AgentController
              agentType={agentType}
              onAgentTypeChange={(type) => {
                setAgentType(type);
                setCurrentStep(0);
              }}
              currentStep={currentStep}
              totalSteps={totalSteps}
              cumulativeReward={rewardProgress}
              pathEfficiency={efficiency}
              isPlaying={isPlaying}
              onPlayToggle={() => setIsPlaying(!isPlaying)}
              onReset={handleReset}
              onSeek={handleSeek}
              playbackSpeed={playbackSpeed}
              onSpeedChange={setPlaybackSpeed}
              currentAction={currentAction}
              distanceToGoal={distanceToGoal}
            />

            <MetricsPanel />
          </aside>
        </div>
      ) : (
        /* Side-by-Side Comparison View */
        <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
          <ComparisonView
            connectomeData={connectomeData}
            connectomeTrajectory={connectomeTraj}
            baselineTrajectory={baselineTraj}
          />
        </div>
      )}

      <FooterStrip
        onOpenInfo={() => setIsInfoOpen(true)}
        numNodes={connectomeData?.metadata?.num_nodes || 850}
        numEdges={connectomeData?.metadata?.num_edges || 44608}
      />

      <InfoModal
        isOpen={isInfoOpen}
        onClose={() => setIsInfoOpen(false)}
      />
    </>
  );
}
export default App;
