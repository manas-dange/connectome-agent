import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import {
  Orbit,
  Crosshair,
  Brain,
  Info,
  Layers,
  Compass,
  Video,
  RotateCcw,
  X,
  Focus,
  Sparkles,
  Check
} from 'lucide-react';

/**
 * Constructs a stylized, biologically recognizable 3D Drosophila melanogaster (fruit fly) model
 * complete with amber thorax, head with iconic ruby-red compound eyes, antennae,
 * striped segmented abdomen, folded legs, and translucent veined wings that flap during flight.
 */
function createDrosophilaFly() {
  const fly = new THREE.Group();

  // Chitin and biological insect materials
  const thoraxMat = new THREE.MeshStandardMaterial({
    color: 0x9E6233, // Amber-brown chitin thorax
    roughness: 0.35,
    metalness: 0.15
  });
  const headMat = new THREE.MeshStandardMaterial({
    color: 0x54361C, // Deep brown head
    roughness: 0.4
  });
  const eyeMat = new THREE.MeshStandardMaterial({
    color: 0xDC2626, // Iconic Drosophila ruby-red compound eyes
    emissive: 0x4B0808,
    roughness: 0.15,
    metalness: 0.2
  });
  const abdomenDarkMat = new THREE.MeshStandardMaterial({
    color: 0x22150B, // Dark tergite band
    roughness: 0.4
  });
  const abdomenLightMat = new THREE.MeshStandardMaterial({
    color: 0xD99343, // Yellow-amber tergite stripe
    roughness: 0.35
  });
  const wingMat = new THREE.MeshStandardMaterial({
    color: 0xE0F2FE,
    transparent: true,
    opacity: 0.7,
    roughness: 0.15,
    metalness: 0.2,
    side: THREE.DoubleSide
  });
  const legMat = new THREE.MeshStandardMaterial({
    color: 0x362010,
    roughness: 0.6
  });

  // 1. Thorax (Center body)
  const thoraxGeom = new THREE.SphereGeometry(1.2, 16, 14);
  const thorax = new THREE.Mesh(thoraxGeom, thoraxMat);
  thorax.scale.set(1.0, 0.95, 1.25);
  fly.add(thorax);

  // 2. Head
  const headGeom = new THREE.SphereGeometry(0.85, 16, 14);
  const head = new THREE.Mesh(headGeom, headMat);
  head.position.set(0, 0.1, 1.3);
  head.scale.set(1.05, 0.85, 0.85);
  fly.add(head);

  // 3. Iconic Drosophila Ruby-Red Eyes (Left & Right)
  const eyeGeom = new THREE.SphereGeometry(0.5, 14, 12);
  const leftEye = new THREE.Mesh(eyeGeom, eyeMat);
  leftEye.position.set(-0.62, 0.22, 1.4);
  leftEye.scale.set(0.85, 1.2, 1.1);
  leftEye.rotation.y = -0.25;
  fly.add(leftEye);

  const rightEye = new THREE.Mesh(eyeGeom, eyeMat);
  rightEye.position.set(0.62, 0.22, 1.4);
  rightEye.scale.set(0.85, 1.2, 1.1);
  rightEye.rotation.y = 0.25;
  fly.add(rightEye);

  // Antennae
  const antGeom = new THREE.CylinderGeometry(0.04, 0.04, 0.5, 6);
  const leftAnt = new THREE.Mesh(antGeom, legMat);
  leftAnt.position.set(-0.18, 0.45, 1.9);
  leftAnt.rotation.x = Math.PI / 4;
  leftAnt.rotation.z = -Math.PI / 8;
  fly.add(leftAnt);

  const rightAnt = new THREE.Mesh(antGeom, legMat);
  rightAnt.position.set(0.18, 0.45, 1.9);
  rightAnt.rotation.x = Math.PI / 4;
  rightAnt.rotation.z = Math.PI / 8;
  fly.add(rightAnt);

  // 4. Striped Abdomen (Alternating dark and amber segments)
  const abdomenGroup = new THREE.Group();
  abdomenGroup.position.set(0, -0.15, -1.0);

  const segments = [
    { z: -0.3, r: 0.95, mat: abdomenLightMat },
    { z: -0.85, r: 0.98, mat: abdomenDarkMat },
    { z: -1.4, r: 0.85, mat: abdomenLightMat },
    { z: -1.9, r: 0.65, mat: abdomenDarkMat },
    { z: -2.35, r: 0.4, mat: abdomenDarkMat }
  ];

  segments.forEach((seg) => {
    const segMesh = new THREE.Mesh(new THREE.SphereGeometry(seg.r, 14, 10), seg.mat);
    segMesh.position.set(0, 0, seg.z);
    segMesh.scale.set(1.0, 0.85, 0.8);
    abdomenGroup.add(segMesh);
  });
  fly.add(abdomenGroup);

  // 5. Wings (Curved, veined translucent membranes)
  const wingShape = new THREE.Shape();
  wingShape.moveTo(0, 0);
  wingShape.bezierCurveTo(0.4, 0.8, 1.2, 2.2, 0.8, 3.8);
  wingShape.bezierCurveTo(0.5, 4.4, -0.2, 4.2, -0.6, 3.4);
  wingShape.bezierCurveTo(-1.0, 2.2, -0.5, 0.8, 0, 0);

  const wingGeom = new THREE.ShapeGeometry(wingShape);

  // Left Wing with Pivot
  const leftWingPivot = new THREE.Group();
  leftWingPivot.position.set(-0.5, 0.85, 0.1);
  const leftWingMesh = new THREE.Mesh(wingGeom, wingMat);
  leftWingMesh.rotation.x = Math.PI / 2;
  leftWingMesh.rotation.y = -Math.PI / 10;
  leftWingPivot.add(leftWingMesh);
  fly.add(leftWingPivot);

  // Right Wing with Pivot
  const rightWingPivot = new THREE.Group();
  rightWingPivot.position.set(0.5, 0.85, 0.1);
  const rightWingMesh = new THREE.Mesh(wingGeom, wingMat);
  rightWingMesh.rotation.x = Math.PI / 2;
  rightWingMesh.rotation.y = Math.PI / 10;
  rightWingMesh.scale.x = -1; // Mirror right wing
  rightWingPivot.add(rightWingMesh);
  fly.add(rightWingPivot);

  // 6. Six Legs (folded for flight posture)
  const legGeom = new THREE.CylinderGeometry(0.05, 0.03, 1.2, 6);
  const legConfigs = [
    [-0.7, -0.5, 0.6, 0.4, -0.5],
    [0.7, -0.5, 0.6, 0.4, 0.5],
    [-0.8, -0.5, 0.0, 0.1, -0.6],
    [0.8, -0.5, 0.0, 0.1, 0.6],
    [-0.7, -0.5, -0.6, -0.4, -0.5],
    [0.7, -0.5, -0.6, -0.4, 0.5]
  ];
  legConfigs.forEach(([x, y, z, rx, rz]) => {
    const leg = new THREE.Mesh(legGeom, legMat);
    leg.position.set(x, y, z);
    leg.rotation.x = rx;
    leg.rotation.z = rz;
    fly.add(leg);
  });

  // Soft guiding beacon ring around the fly
  const auraGeom = new THREE.RingGeometry(2.6, 2.9, 32);
  const auraMat = new THREE.MeshBasicMaterial({
    color: 0x38BDF8,
    transparent: true,
    opacity: 0.4,
    side: THREE.DoubleSide
  });
  const aura = new THREE.Mesh(auraGeom, auraMat);
  aura.rotation.x = Math.PI / 2;
  fly.add(aura);

  // Overall scale: visible and well-proportioned
  fly.scale.set(1.5, 1.5, 1.5);
  fly.rotation.y = Math.PI; // Align head/eyes forward in direction of travel

  // High-frequency wing flapping handler
  fly.userData = {
    leftWingPivot,
    rightWingPivot,
    updateWings: (time, isMoving = true) => {
      if (isMoving) {
        const flap = Math.sin(time * 38) * 0.45;
        leftWingPivot.rotation.z = 0.2 + flap;
        rightWingPivot.rotation.z = -0.2 - flap;
        leftWingPivot.rotation.y = -0.15 + Math.cos(time * 38) * 0.2;
        rightWingPivot.rotation.y = 0.15 - Math.cos(time * 38) * 0.2;
      } else {
        leftWingPivot.rotation.z = 0.05;
        rightWingPivot.rotation.z = -0.05;
      }
    }
  };

  return fly;
}

export const ConnectomeViewer = ({
  connectomeData,
  agentPosition,
  goalPosition,
  stepIndex,
  isMini = false,
  label = null
}) => {
  const containerRef = useRef(null);
  const [hoveredNeuron, setHoveredNeuron] = useState(null);
  const [selectedNeuron, setSelectedNeuron] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [cameraMode, setCameraMode] = useState('orbit'); // 'orbit', 'chase', 'top', 'front'
  const cameraModeRef = useRef('orbit');
  cameraModeRef.current = cameraMode;
  const chaseDistanceRef = useRef(18.0);

  // Layer toggles
  const [showSynapses, setShowSynapses] = useState(true);
  const [showTrail, setShowTrail] = useState(true);
  const [showGrid, setShowGrid] = useState(true);
  const [isAutoRotate, setIsAutoRotate] = useState(true);
  const autoRotateRef = useRef(true);
  autoRotateRef.current = isAutoRotate;

  useEffect(() => {
    if (!connectomeData || !containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene Setup — Studio slate background with atmospheric depth
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1B1F2A);
    scene.fog = new THREE.Fog(0x1B1F2A, 140, 520);

    // 2. Camera Setup (Frustum framed for expanded globe)
    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 2000);
    camera.position.set(0, 36, 195);
    const currentLookAt = new THREE.Vector3(0, 0, 0);

    // 3. Renderer Setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 4. Bright Balanced Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfff7ed, 0.9);
    sunLight.position.set(60, 120, 80);
    scene.add(sunLight);

    const fillLight = new THREE.DirectionalLight(0x8899b5, 0.4);
    fillLight.position.set(-60, -40, -60);
    scene.add(fillLight);

    const headLight = new THREE.PointLight(0xffffff, 0.9, 1200);
    scene.add(headLight);

    // 5. Arena Ground Floor & Spatial Grid Group
    const gridGroup = new THREE.Group();
    const arenaGrid = new THREE.PolarGridHelper(90, 18, 8, 64, 0x475569, 0x2A3448);
    arenaGrid.position.y = -55;
    gridGroup.add(arenaGrid);

    // Arena boundary perimeter ring
    const ringGeom = new THREE.RingGeometry(89.4, 90.6, 64);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x5B8CFF, side: THREE.DoubleSide, transparent: true, opacity: 0.35 });
    const floorRing = new THREE.Mesh(ringGeom, ringMat);
    floorRing.rotation.x = Math.PI / 2;
    floorRing.position.y = -55;
    gridGroup.add(floorRing);

    // 4 spatial navigational beacons marking arena boundaries (N, S, E, W)
    const beaconGeom = new THREE.CylinderGeometry(0.4, 0.4, 45, 8);
    const beaconMat = new THREE.MeshBasicMaterial({ color: 0x5B8CFF, transparent: true, opacity: 0.25 });
    [ [90, 0], [-90, 0], [0, 90], [0, -90] ].forEach(([bx, bz]) => {
      const beacon = new THREE.Mesh(beaconGeom, beaconMat);
      beacon.position.set(bx, -32.5, bz);
      gridGroup.add(beacon);
    });
    scene.add(gridGroup);

    // 6. Instanced Neurons (High-contrast, clearly visible against the slate background)
    const nodes = connectomeData.nodes || [];
    const numNodes = nodes.length;

    const baseGeometry = new THREE.IcosahedronGeometry(1.2, 1);
    const nodeMaterial = new THREE.MeshPhongMaterial({
      shininess: 35,
      vertexColors: true,
      flatShading: true
    });

    const instancedMesh = new THREE.InstancedMesh(baseGeometry, nodeMaterial, numNodes);
    instancedMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

    const dummy = new THREE.Object3D();
    const defaultColors = new Float32Array(numNodes * 3);
    const colorSensory = new THREE.Color(0x38BDF8); // Bright Sky Blue
    const colorMotor = new THREE.Color(0xFBBF24);   // Amber Gold
    const colorResting = new THREE.Color(0x10B981); // Crisp Vibrant Emerald
    const colorActive = new THREE.Color(0xEF4444);  // Vivid Pulse Red

    nodes.forEach((node, i) => {
      dummy.position.set(node.x, node.y, node.z);
      const scale = node.is_hub ? 1.7 : 1.0;
      dummy.scale.set(scale, scale, scale);
      dummy.updateMatrix();
      instancedMesh.setMatrixAt(i, dummy.matrix);

      // Biological color assignment
      let c = colorResting;
      const t = (node.type || '').toLowerCase();
      if (t.includes('er') || t.includes('pn') || t.includes('sensory')) {
        c = colorSensory;
      } else if (t.includes('motor') || t.includes('vnc') || t.includes('b1')) {
        c = colorMotor;
      }

      defaultColors[i * 3] = c.r;
      defaultColors[i * 3 + 1] = c.g;
      defaultColors[i * 3 + 2] = c.b;
      instancedMesh.setColorAt(i, c);
    });

    instancedMesh.instanceColor.needsUpdate = true;
    instancedMesh.instanceMatrix.needsUpdate = true;
    scene.add(instancedMesh);

    // 7. Synaptic Edges (Clearly visible against the lighter background)
    const nodeMap = new Map();
    nodes.forEach((n, idx) => nodeMap.set(n.id, { x: n.x, y: n.y, z: n.z, idx }));

    const edgeCoords = [];
    const edgeList = connectomeData.edges || [];
    edgeList.forEach((edge) => {
      const src = nodeMap.get(edge.source);
      const tgt = nodeMap.get(edge.target);
      if (src && tgt) {
        edgeCoords.push(src.x, src.y, src.z, tgt.x, tgt.y, tgt.z);
      }
    });

    const edgeGeometry = new THREE.BufferGeometry();
    edgeGeometry.setAttribute('position', new THREE.Float32BufferAttribute(edgeCoords, 3));
    const edgeMaterial = new THREE.LineBasicMaterial({
      color: 0x64748B,
      transparent: true,
      opacity: 0.28
    });
    const lineSegments = new THREE.LineSegments(edgeGeometry, edgeMaterial);
    scene.add(lineSegments);

    // Selection Ring Marker (pulsing highlight on pinned neuron)
    const selectMarkerGeom = new THREE.RingGeometry(2.4, 3.2, 32);
    const selectMarkerMat = new THREE.MeshBasicMaterial({
      color: 0xF59E0B, // Vibrant Amber highlight
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.95
    });
    const selectMarker = new THREE.Mesh(selectMarkerGeom, selectMarkerMat);
    selectMarker.visible = false;
    scene.add(selectMarker);

    // 8. 3D Drosophila Fly Model (Authentic NeuroMechFly v2 GLTF model with procedural fallback)
    const agentMesh = new THREE.Group();
    const fallbackFly = createDrosophilaFly();
    agentMesh.add(fallbackFly);
    agentMesh.userData = fallbackFly.userData;
    scene.add(agentMesh);

    // Load user's custom 3D Fly GLB model
    const gltfLoader = new GLTFLoader();
    gltfLoader.load(
      '/models/fly.glb',
      (gltf) => {
        const flyModel = gltf.scene;

        // Pivot group to center the model and align its front (head/eyes) facing forward
        const flyPivot = new THREE.Group();
        flyModel.position.set(0, -2.6, 0.7); // Center offset
        flyModel.rotation.y = 0;              // Natural forward orientation (head faces direction of travel)
        flyPivot.add(flyModel);

        // Scale to fit the connectome arena (~5.2 units in length)
        flyPivot.scale.set(0.75, 0.75, 0.75);

        // Enhance materials
        let wingMesh = null;
        flyModel.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            if (child.name.includes('Mesh_1')) {
              // Wings: glassy translucent
              child.material.transparent = true;
              child.material.opacity = 0.75;
              child.material.roughness = 0.15;
              child.material.metalness = 0.1;
              child.material.side = THREE.DoubleSide;
              wingMesh = child;
            } else if (child.name.includes('Mesh_2')) {
              // Eyes: vibrant red
              child.material.color.set(0xEF4444);
              child.material.roughness = 0.2;
            } else {
              child.material.roughness = 0.4;
            }
          }
        });

        // Add soft tracking beacon ring around the fly
        const beaconRing = new THREE.Mesh(
          new THREE.RingGeometry(2.5, 2.8, 32),
          new THREE.MeshBasicMaterial({ color: 0x38BDF8, transparent: true, opacity: 0.35, side: THREE.DoubleSide })
        );
        beaconRing.rotation.x = Math.PI / 2;
        flyPivot.add(beaconRing);

        // Replace fallback with user's model
        agentMesh.clear();
        agentMesh.add(flyPivot);

        // Wing flutter / flight animation hook
        agentMesh.userData = {
          updateWings: (time, isMoving = true) => {
            if (wingMesh) {
              wingMesh.scale.y = isMoving ? 1.0 + Math.sin(time * 42) * 0.25 : 1.0;
            }
            if (isMoving) {
              flyModel.rotation.x = Math.sin(time * 30) * 0.05;
            }
          }
        };
      },
      undefined,
      (err) => {
        console.warn('Could not load fly.glb, using fallback:', err);
      }
    );

    // Trajectory flight trail
    const maxTrailPoints = 30;
    const trailPositions = new Float32Array(maxTrailPoints * 3);
    const trailGeom = new THREE.BufferGeometry();
    trailGeom.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));
    const trailMat = new THREE.LineBasicMaterial({
      color: 0x38BDF8,
      transparent: true,
      opacity: 0.75
    });
    const trailLine = new THREE.Line(trailGeom, trailMat);
    scene.add(trailLine);
    const trailHistory = [];

    // 9. Goal Marker (Rotating Octahedron)
    const goalGeom = new THREE.OctahedronGeometry(3.5, 0);
    const goalMat = new THREE.MeshBasicMaterial({
      color: 0x3DDC97,
      wireframe: true
    });
    const goalMesh = new THREE.Mesh(goalGeom, goalMat);
    if (goalPosition) {
      goalMesh.position.set(goalPosition[0], goalPosition[1], goalPosition[2]);
    }
    scene.add(goalMesh);

    // 10. Interactive Drag Orbit & Raycaster
    let isDragging = false;
    let mouseDownPos = { x: 0, y: 0 };
    let prevMouseX = 0;
    let prevMouseY = 0;
    let rotationSpeedX = 0;
    let rotationSpeedY = 0;

    const onMouseDown = (e) => {
      mouseDownPos = { x: e.clientX, y: e.clientY };
      if (cameraModeRef.current === 'chase') return;
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      if (isDragging && cameraModeRef.current !== 'chase') {
        const deltaX = e.clientX - prevMouseX;
        const deltaY = e.clientY - prevMouseY;
        rotationSpeedY = deltaX * 0.005;
        rotationSpeedX = deltaY * 0.005;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
      } else if (!isMini) {
        const mouseNorm = new THREE.Vector2(
          (mouseX / rect.width) * 2 - 1,
          -(mouseY / rect.height) * 2 + 1
        );
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouseNorm, camera);
        const intersects = raycaster.intersectObject(instancedMesh);

        if (intersects.length > 0) {
          const instanceId = intersects[0].instanceId;
          const node = nodes[instanceId];
          if (node) {
            setHoveredNeuron(node);
            setTooltipPos({ x: mouseX + 15, y: mouseY + 15 });
          }
        } else {
          setHoveredNeuron(null);
        }
      }
    };

    const onMouseUp = (e) => {
      // Click inspection detection (if mouse didn't drag)
      const distMoved = Math.hypot(e.clientX - mouseDownPos.x, e.clientY - mouseDownPos.y);
      if (distMoved < 6 && !isMini) {
        const rect = container.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        const mouseNorm = new THREE.Vector2(
          (mouseX / rect.width) * 2 - 1,
          -(mouseY / rect.height) * 2 + 1
        );
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouseNorm, camera);
        const intersects = raycaster.intersectObject(instancedMesh);

        if (intersects.length > 0) {
          const instanceId = intersects[0].instanceId;
          const node = nodes[instanceId];
          if (node) {
            setSelectedNeuron(node);
          }
        }
      }
      isDragging = false;
    };

    const onWheel = (e) => {
      e.preventDefault();
      if (cameraModeRef.current === 'chase') {
        chaseDistanceRef.current = THREE.MathUtils.clamp(
          chaseDistanceRef.current + e.deltaY * 0.04,
          8.0,
          50.0
        );
        return;
      }
      camera.position.z = THREE.MathUtils.clamp(camera.position.z + e.deltaY * 0.15, 40, 450);
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    container.addEventListener('wheel', onWheel, { passive: false });

    // 11. Animation Loop
    let animId;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsedTime = clock.getElapsedTime();

      // Camera Tracking: Chase Fly vs Presets/Orbit
      if (cameraModeRef.current === 'chase' && agentMesh) {
        // Immersive third-person chase camera following the fly
        const flyWorldPos = new THREE.Vector3();
        agentMesh.getWorldPosition(flyWorldPos);

        const flyForward = new THREE.Vector3();
        agentMesh.getWorldDirection(flyForward);

        const chaseDist = chaseDistanceRef.current;
        const chaseElev = chaseDist * 0.32;
        const targetCamPos = flyWorldPos.clone()
          .sub(flyForward.clone().multiplyScalar(chaseDist))
          .add(new THREE.Vector3(0, chaseElev, 0));

        camera.position.lerp(targetCamPos, 0.12);

        const lookAhead = flyWorldPos.clone().add(flyForward.clone().multiplyScalar(10.0));
        camera.lookAt(lookAhead);
      } else {
        // Smooth transition to target camera position (presets or focused neuron)
        if (container._targetCamPos) {
          camera.position.lerp(container._targetCamPos, 0.08);
          if (container._targetLookAt) {
            currentLookAt.lerp(container._targetLookAt, 0.08);
            camera.lookAt(currentLookAt);
          }
          if (camera.position.distanceTo(container._targetCamPos) < 0.5) {
            container._targetCamPos = null;
          }
        }

        // Continuous slow auto-rotation if enabled and not dragging
        if (autoRotateRef.current && !container._targetCamPos && !isDragging) {
          scene.rotation.y += 0.003;
        } else if (!autoRotateRef.current && !container._targetCamPos) {
          scene.rotation.y += rotationSpeedY;
          scene.rotation.x += rotationSpeedX;
          rotationSpeedX *= 0.92;
          rotationSpeedY *= 0.92;
        }
      }

      // Keep headlight at camera
      headLight.position.copy(camera.position);

      // Rotate goal marker
      goalMesh.rotation.x += 0.015;
      goalMesh.rotation.y += 0.02;

      // Pulse selection marker if visible
      if (selectMarker.visible) {
        const pulse = 1.0 + Math.sin(elapsedTime * 6) * 0.12;
        selectMarker.scale.set(pulse, pulse, pulse);
        selectMarker.lookAt(camera.position);
      }

      // Animate fly wings
      if (agentMesh && agentMesh.userData && agentMesh.userData.updateWings) {
        agentMesh.userData.updateWings(elapsedTime, true);
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Save refs for dynamic state updates
    container._camera = camera;
    container._scene = scene;
    container._agentMesh = agentMesh;
    container._trailLine = trailLine;
    container._trailHistory = trailHistory;
    container._goalMesh = goalMesh;
    container._instancedMesh = instancedMesh;
    container._defaultColors = defaultColors;
    container._nodes = nodes;
    container._lineSegments = lineSegments;
    container._gridGroup = gridGroup;
    container._selectMarker = selectMarker;
    container._targetCamPos = null;
    container._targetLookAt = null;
    container._prevAgentPos = null;

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('wheel', onWheel);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [connectomeData, isMini]);

  // Handle Dynamic Agent Trajectory & Heading Updates
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !container._agentMesh || !agentPosition) return;

    const agentMesh = container._agentMesh;
    const trailLine = container._trailLine;
    const trailHistory = container._trailHistory;
    const instancedMesh = container._instancedMesh;
    const defaultColors = container._defaultColors;
    const nodes = container._nodes;

    // Dynamically update goal position
    if (container._goalMesh && goalPosition) {
      container._goalMesh.position.set(goalPosition[0], goalPosition[1], goalPosition[2]);
    }

    // Reset history and previous position on start / rewind / loop
    if (stepIndex === 0) {
      container._prevAgentPos = null;
      trailHistory.length = 0;
    }

    // Update position and smoothly face forward along flight vector
    const prevPos = container._prevAgentPos;
    agentMesh.position.set(agentPosition[0], agentPosition[1], agentPosition[2]);

    if (prevPos) {
      const dx = agentPosition[0] - prevPos[0];
      const dy = agentPosition[1] - prevPos[1];
      const dz = agentPosition[2] - prevPos[2];
      const distSq = dx * dx + dy * dy + dz * dz;

      // Ignore huge scrub / loop-wrap jumps (> 8.0 units) to prevent backward spin
      if (distSq > 0.001 && distSq < 64.0) {
        const targetLook = new THREE.Vector3(
          agentPosition[0] + dx,
          agentPosition[1] + dy,
          agentPosition[2] + dz
        );
        agentMesh.lookAt(targetLook);
      }
    } else if (goalPosition) {
      // At step 0, face forward towards goal vector
      const gx = goalPosition[0] - agentPosition[0];
      const gy = goalPosition[1] - agentPosition[1];
      const gz = goalPosition[2] - agentPosition[2];
      if (gx * gx + gy * gy + gz * gz > 0.001) {
        agentMesh.lookAt(new THREE.Vector3(
          agentPosition[0] + gx * 0.1,
          agentPosition[1] + gy * 0.1,
          agentPosition[2] + gz * 0.1
        ));
      }
    }
    container._prevAgentPos = [...agentPosition];

    // Update trail buffer
    trailHistory.unshift([...agentPosition]);
    if (trailHistory.length > 30) trailHistory.pop();

    const positions = trailLine.geometry.attributes.position.array;
    for (let i = 0; i < 30; i++) {
      if (i < trailHistory.length) {
        positions[i * 3] = trailHistory[i][0];
        positions[i * 3 + 1] = trailHistory[i][1];
        positions[i * 3 + 2] = trailHistory[i][2];
      } else {
        positions[i * 3] = agentPosition[0];
        positions[i * 3 + 1] = agentPosition[1];
        positions[i * 3 + 2] = agentPosition[2];
      }
    }
    trailLine.geometry.attributes.position.needsUpdate = true;

    // Obstacle avoidance sensory illumination (proximity detection within 8.5 units)
    if (instancedMesh && nodes && defaultColors) {
      const activeColor = new THREE.Color(0xEF4444);
      const tmpColor = new THREE.Color();

      for (let i = 0; i < nodes.length; i++) {
        const ndx = nodes[i].x - agentPosition[0];
        const ndy = nodes[i].y - agentPosition[1];
        const ndz = nodes[i].z - agentPosition[2];
        const dSq = ndx * ndx + ndy * ndy + ndz * ndz;

        // Visual obstacle detection and avoidance alert zone
        if (dSq < 72) {
          instancedMesh.setColorAt(i, activeColor);
        } else {
          tmpColor.setRGB(defaultColors[i * 3], defaultColors[i * 3 + 1], defaultColors[i * 3 + 2]);
          instancedMesh.setColorAt(i, tmpColor);
        }
      }
      instancedMesh.instanceColor.needsUpdate = true;
    }
  }, [agentPosition, goalPosition, stepIndex]);

  // Update 3D selection marker when selectedNeuron changes
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !container._selectMarker) return;
    if (selectedNeuron) {
      container._selectMarker.position.set(selectedNeuron.x, selectedNeuron.y, selectedNeuron.z);
      container._selectMarker.visible = true;
    } else {
      container._selectMarker.visible = false;
    }
  }, [selectedNeuron]);

  // Layer visibility toggles
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (container._lineSegments) container._lineSegments.visible = showSynapses;
    if (container._trailLine) container._trailLine.visible = showTrail;
    if (container._gridGroup) container._gridGroup.visible = showGrid;
  }, [showSynapses, showTrail, showGrid]);

  const handleCameraPreset = (mode) => {
    const container = containerRef.current;
    if (!container || !container._camera) return;

    setCameraMode(mode);
    if (mode === 'orbit') {
      container._targetCamPos = new THREE.Vector3(0, 36, 195);
      container._targetLookAt = new THREE.Vector3(0, 0, 0);
    } else if (mode === 'top') {
      container._targetCamPos = new THREE.Vector3(0, 240, 0.01);
      container._targetLookAt = new THREE.Vector3(0, 0, 0);
    } else if (mode === 'front') {
      container._targetCamPos = new THREE.Vector3(0, 8, 220);
      container._targetLookAt = new THREE.Vector3(0, 8, 0);
    }
  };

  const handleResetCamera = () => {
    const container = containerRef.current;
    if (!container || !container._camera) return;
    setCameraMode('orbit');
    if (container._scene) container._scene.rotation.set(0, 0, 0);
    container._targetCamPos = new THREE.Vector3(0, 36, 195);
    container._targetLookAt = new THREE.Vector3(0, 0, 0);
  };

  const handleFocusNeuron = (neuron) => {
    const container = containerRef.current;
    if (!container || !container._camera || !neuron) return;
    setCameraMode('orbit');
    container._targetCamPos = new THREE.Vector3(neuron.x, neuron.y + 12, neuron.z + 36);
    container._targetLookAt = new THREE.Vector3(neuron.x, neuron.y, neuron.z);
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />

      {/* Top Left: Neural Manifold Badge & Layer Controls (Single View) */}
      {!isMini && !label && (
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          zIndex: 10
        }}>
          {/* Manifold Identity Tag */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(18, 22, 34, 0.88)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(56, 189, 248, 0.28)',
            borderRadius: 'var(--radius-full)',
            padding: '6px 14px',
            fontSize: '11px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.4)'
          }}>
            <Brain size={14} color="var(--accent-primary)" />
            <span style={{ color: 'var(--text-secondary)' }}>
              <strong style={{ color: 'var(--text-primary)' }}>Fly Brain Manifold:</strong> 3D Central Complex (850 Neurons, 44k Synapses)
            </span>
          </div>

          {/* Quick Layer Visibility Toggles */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(18, 22, 34, 0.82)',
            backdropFilter: 'blur(12px)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '3px 6px',
            width: 'fit-content'
          }}>
            <button
              onClick={() => setShowSynapses(!showSynapses)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '4px 8px',
                fontSize: '10.5px',
                fontWeight: 500,
                borderRadius: 'var(--radius-xs)',
                border: 'none',
                cursor: 'pointer',
                background: showSynapses ? 'rgba(56, 189, 248, 0.2)' : 'transparent',
                color: showSynapses ? '#38BDF8' : 'var(--text-tertiary)',
                transition: 'all 0.15s ease'
              }}
              title="Toggle synaptic connections"
            >
              <Layers size={11} /> Synapses
            </button>

            <button
              onClick={() => setShowTrail(!showTrail)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '4px 8px',
                fontSize: '10.5px',
                fontWeight: 500,
                borderRadius: 'var(--radius-xs)',
                border: 'none',
                cursor: 'pointer',
                background: showTrail ? 'rgba(56, 189, 248, 0.2)' : 'transparent',
                color: showTrail ? '#38BDF8' : 'var(--text-tertiary)',
                transition: 'all 0.15s ease'
              }}
              title="Toggle flight trajectory trail"
            >
              <Orbit size={11} /> Trail
            </button>

            <button
              onClick={() => setShowGrid(!showGrid)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '4px 8px',
                fontSize: '10.5px',
                fontWeight: 500,
                borderRadius: 'var(--radius-xs)',
                border: 'none',
                cursor: 'pointer',
                background: showGrid ? 'rgba(56, 189, 248, 0.2)' : 'transparent',
                color: showGrid ? '#38BDF8' : 'var(--text-tertiary)',
                transition: 'all 0.15s ease'
              }}
              title="Toggle spatial grid and beacons"
            >
              <Compass size={11} /> Grid
            </button>
          </div>
        </div>
      )}

      {/* Top Right: Camera Presets & Tracking Bar (Single View) */}
      {!isMini && (
        <div style={{
          position: 'absolute',
          top: '12px',
          right: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          background: 'rgba(18, 22, 34, 0.88)',
          backdropFilter: 'blur(12px)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '4px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
          zIndex: 10
        }}>
          <button
            onClick={() => handleCameraPreset('orbit')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: '5px 10px',
              fontSize: '11px',
              fontWeight: 500,
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              cursor: 'pointer',
              background: cameraMode === 'orbit' ? 'var(--accent-primary)' : 'transparent',
              color: cameraMode === 'orbit' ? '#FFFFFF' : 'var(--text-secondary)',
              transition: 'all 0.15s ease'
            }}
            title="Free Orbit View"
          >
            <Orbit size={13} /> Orbit
          </button>
          
          <button
            onClick={() => handleCameraPreset('chase')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: '5px 10px',
              fontSize: '11px',
              fontWeight: 500,
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              cursor: 'pointer',
              background: cameraMode === 'chase' ? 'var(--accent-primary)' : 'transparent',
              color: cameraMode === 'chase' ? '#FFFFFF' : 'var(--text-secondary)',
              transition: 'all 0.15s ease'
            }}
            title="Lock third-person camera behind fly"
          >
            <Crosshair size={13} /> Chase Cam
          </button>

          <button
            onClick={() => handleCameraPreset('top')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: '5px 10px',
              fontSize: '11px',
              fontWeight: 500,
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              cursor: 'pointer',
              background: cameraMode === 'top' ? 'var(--accent-primary)' : 'transparent',
              color: cameraMode === 'top' ? '#FFFFFF' : 'var(--text-secondary)',
              transition: 'all 0.15s ease'
            }}
            title="Top-down Dorsal view"
          >
            <Compass size={13} /> Top
          </button>

          <button
            onClick={() => handleCameraPreset('front')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: '5px 10px',
              fontSize: '11px',
              fontWeight: 500,
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              cursor: 'pointer',
              background: cameraMode === 'front' ? 'var(--accent-primary)' : 'transparent',
              color: cameraMode === 'front' ? '#FFFFFF' : 'var(--text-secondary)',
              transition: 'all 0.15s ease'
            }}
            title="Frontal Coronal view"
          >
            <Video size={13} /> Front
          </button>

          <div style={{ width: '1px', height: '18px', background: 'var(--border-subtle)', margin: '0 2px' }} />

          <button
            onClick={() => setIsAutoRotate(!isAutoRotate)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '5px 9px',
              fontSize: '11px',
              fontWeight: 500,
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              cursor: 'pointer',
              background: isAutoRotate ? 'rgba(56, 189, 248, 0.18)' : 'transparent',
              color: isAutoRotate ? '#38BDF8' : 'var(--text-tertiary)',
              transition: 'all 0.15s ease'
            }}
            title="Toggle arena auto-spin"
          >
            <Sparkles size={12} /> Auto
          </button>

          <button
            onClick={handleResetCamera}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '28px',
              height: '28px',
              borderRadius: 'var(--radius-sm)',
              border: 'none',
              cursor: 'pointer',
              background: 'transparent',
              color: 'var(--text-secondary)',
              transition: 'all 0.15s ease'
            }}
            title="Reset Camera Orientation"
          >
            <RotateCcw size={13} />
          </button>
        </div>
      )}

      {/* Label Overlay if in Compare Mode */}
      {label && (
        <div style={{
          position: 'absolute',
          top: '12px',
          left: '16px',
          background: 'rgba(27, 31, 42, 0.9)',
          backdropFilter: 'blur(6px)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-sm)',
          padding: '5px 12px',
          fontSize: '11px',
          fontWeight: 600,
          color: 'var(--text-primary)',
          letterSpacing: '0.5px',
          textTransform: 'uppercase',
          boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
        }}>
          {label}
        </div>
      )}

      {/* Legend Overlay (Single View Only) */}
      {!isMini && (
        <div style={{
          position: 'absolute',
          bottom: '16px',
          left: '16px',
          display: 'flex',
          gap: 'var(--space-3)',
          background: 'rgba(18, 22, 34, 0.88)',
          backdropFilter: 'blur(10px)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '7px 16px',
          fontSize: '11px',
          color: 'var(--text-secondary)',
          boxShadow: '0 4px 16px rgba(0,0,0,0.35)'
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#38BDF8' }} /> Sensory (ER/PN)
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981' }} /> Central (CX)
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#FBBF24' }} /> Motor (VNC)
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#EF4444' }} /> Active Pulse
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: '6px', borderLeft: '1px solid var(--border-subtle)', paddingLeft: '10px', color: 'var(--text-primary)' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#DC2626' }} /> Drosophila Fly Agent
          </span>
        </div>
      )}

      {/* Pinned Inspected Neuron HUD Card (Single View) */}
      {!isMini && selectedNeuron && (
        <div style={{
          position: 'absolute',
          bottom: '16px',
          right: '16px',
          width: '280px',
          background: 'rgba(18, 22, 34, 0.94)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(56, 189, 248, 0.4)',
          borderRadius: 'var(--radius-lg)',
          padding: '14px 16px',
          boxShadow: '0 12px 36px rgba(0,0,0,0.6)',
          zIndex: 25,
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          {/* Card Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
              <div style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#F59E0B',
                boxShadow: '0 0 10px #F59E0B'
              }} />
              <span className="font-mono" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                Neuron #{selectedNeuron.id}
              </span>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              {selectedNeuron.is_hub && (
                <span style={{
                  fontSize: '10px',
                  fontWeight: 600,
                  background: 'rgba(245, 158, 11, 0.2)',
                  color: '#F59E0B',
                  border: '1px solid rgba(245, 158, 11, 0.4)',
                  padding: '1px 6px',
                  borderRadius: 'var(--radius-full)'
                }}>
                  ⭐ HUB
                </span>
              )}
              <button
                onClick={() => setSelectedNeuron(null)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-tertiary)',
                  cursor: 'pointer',
                  padding: '2px',
                  display: 'flex',
                  alignItems: 'center'
                }}
                title="Close"
              >
                <X size={15} />
              </button>
            </div>
          </div>

          {/* Details Table */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            background: 'rgba(9, 10, 15, 0.5)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-sm)',
            padding: '8px 10px',
            fontSize: '11px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Cell Type:</span>
              <span className="font-mono" style={{ color: 'var(--accent-primary)', fontWeight: 500 }}>
                {selectedNeuron.type || 'Intrinsic CX'}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Neuropil ROI:</span>
              <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
                {selectedNeuron.roi || 'Central Complex'}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Synaptic Degree:</span>
              <span className="font-mono" style={{ color: 'var(--accent-success)', fontWeight: 500 }}>
                {selectedNeuron.degree || 32} synapses
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Coordinates:</span>
              <span className="font-mono" style={{ color: 'var(--text-tertiary)', fontSize: '10.5px' }}>
                [{selectedNeuron.x.toFixed(1)}, {selectedNeuron.y.toFixed(1)}, {selectedNeuron.z.toFixed(1)}]
              </span>
            </div>
          </div>

          {/* Focus Action */}
          <button
            onClick={() => handleFocusNeuron(selectedNeuron)}
            className="btn btn-primary"
            style={{
              padding: '6px 12px',
              fontSize: '11.5px',
              gap: '6px',
              width: '100%'
            }}
          >
            <Focus size={13} /> Focus Camera in 3D
          </button>
        </div>
      )}

      {/* Hover Tooltip */}
      {hoveredNeuron && !selectedNeuron && (
        <div style={{
          position: 'absolute',
          left: `${tooltipPos.x}px`,
          top: `${tooltipPos.y}px`,
          background: 'rgba(18, 22, 34, 0.94)',
          border: '1px solid var(--accent-primary)',
          borderRadius: 'var(--radius-sm)',
          padding: '8px 12px',
          fontSize: '11px',
          pointerEvents: 'none',
          boxShadow: '0 6px 20px rgba(0,0,0,0.6)',
          zIndex: 20
        }}>
          <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '2px' }}>
            Neuron #{hoveredNeuron.id} {hoveredNeuron.is_hub && '⭐ (Hub)'}
          </div>
          <div style={{ color: 'var(--text-secondary)' }}>Type: <span style={{ color: 'var(--accent-primary)' }}>{hoveredNeuron.type}</span></div>
          <div style={{ color: 'var(--text-secondary)' }}>Neuropil ROI: {hoveredNeuron.roi}</div>
          <div style={{ color: 'var(--text-secondary)' }}>Degree: {hoveredNeuron.degree} connections</div>
          <div style={{ color: 'var(--text-tertiary)', fontSize: '10px', marginTop: '4px', fontStyle: 'italic' }}>
            Click to inspect & pin
          </div>
        </div>
      )}
    </div>
  );
};
