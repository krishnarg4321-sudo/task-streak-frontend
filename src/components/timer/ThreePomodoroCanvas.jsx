import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreePomodoroCanvas({ isRunning = false, progressRatio = 0.5 }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 220;
    const height = container.clientHeight || 220;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.5);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    // Group for Hourglass
    const hourglassGroup = new THREE.Group();
    scene.add(hourglassGroup);

    // Materials
    const goldMaterial = new THREE.MeshStandardMaterial({
      color: 0xF59E0B,
      metalness: 0.85,
      roughness: 0.25,
    });

    const blackStandMaterial = new THREE.MeshStandardMaterial({
      color: 0x18181B,
      roughness: 0.4,
    });

    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xFFFFFF,
      transmission: 0.9,
      opacity: 0.6,
      transparent: true,
      roughness: 0.1,
      ior: 1.5,
      thickness: 0.5,
    });

    const sandMaterial = new THREE.MeshStandardMaterial({
      color: 0xEF4444, // Vibrant coral sand
      roughness: 0.7,
      metalness: 0.1,
    });

    // Top & Bottom Bases (Disks)
    const baseGeo = new THREE.CylinderGeometry(1.6, 1.7, 0.25, 32);
    const topBase = new THREE.Mesh(baseGeo, goldMaterial);
    topBase.position.y = 2.4;
    hourglassGroup.add(topBase);

    const bottomBase = new THREE.Mesh(baseGeo, goldMaterial);
    bottomBase.position.y = -2.4;
    hourglassGroup.add(bottomBase);

    // Support Pillars (3 pillars)
    const pillarGeo = new THREE.CylinderGeometry(0.08, 0.08, 4.6, 16);
    for (let i = 0; i < 3; i++) {
      const angle = (i * Math.PI * 2) / 3;
      const pillar = new THREE.Mesh(pillarGeo, blackStandMaterial);
      pillar.position.x = Math.cos(angle) * 1.35;
      pillar.position.z = Math.sin(angle) * 1.35;
      hourglassGroup.add(pillar);
    }

    // Glass Bulbs (Lathe geometry)
    const points = [];
    for (let i = 0; i <= 20; i++) {
      const y = (i / 20) * 4.4 - 2.2;
      const r = 0.2 + 0.9 * Math.pow(Math.abs(y) / 2.2, 1.4);
      points.push(new THREE.Vector2(r, y));
    }
    const glassGeo = new THREE.LatheGeometry(points, 32);
    const glassMesh = new THREE.Mesh(glassGeo, glassMaterial);
    hourglassGroup.add(glassMesh);

    // Top Sand (Decreases as time passes)
    const topSandGeo = new THREE.ConeGeometry(0.9, 1.4, 32);
    const topSandMesh = new THREE.Mesh(topSandGeo, sandMaterial);
    topSandMesh.rotation.x = Math.PI;
    topSandMesh.position.y = 1.1;
    hourglassGroup.add(topSandMesh);

    // Bottom Sand (Increases)
    const bottomSandGeo = new THREE.ConeGeometry(0.95, 1.4, 32);
    const bottomSandMesh = new THREE.Mesh(bottomSandGeo, sandMaterial);
    bottomSandMesh.position.y = -1.5;
    hourglassGroup.add(bottomSandMesh);

    // Center Falling Sand Stream
    const streamGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.8, 12);
    const streamMesh = new THREE.Mesh(streamGeo, sandMaterial);
    streamMesh.position.y = -0.2;
    hourglassGroup.add(streamMesh);

    // Particle Sand Dust
    const particleCount = 40;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 0.15;
      particlePositions[i * 3 + 1] = Math.random() * 1.6 - 0.8;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 0.15;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({ color: 0xFCA5A5, size: 0.08 });
    const sandParticles = new THREE.Points(particleGeo, particleMat);
    hourglassGroup.add(sandParticles);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 1.2);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xFFFFFF, 1.8);
    dirLight.position.set(5, 8, 5);
    scene.add(dirLight);

    const backLight = new THREE.PointLight(0xA855F7, 2, 10);
    backLight.position.set(-3, -2, -3);
    scene.add(backLight);

    // Animation Loop
    let reqId;
    let clock = new THREE.Clock();

    const animate = () => {
      reqId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      // Idle smooth rotation
      hourglassGroup.rotation.y += isRunning ? 0.02 : 0.006;
      hourglassGroup.rotation.x = Math.sin(clock.getElapsedTime() * 1.5) * 0.05;

      // Animate falling particles if running
      if (isRunning) {
        streamMesh.visible = true;
        const pos = particleGeo.attributes.position.array;
        for (let i = 0; i < particleCount; i++) {
          pos[i * 3 + 1] -= delta * 1.6;
          if (pos[i * 3 + 1] < -1.2) {
            pos[i * 3 + 1] = 0.5;
          }
        }
        particleGeo.attributes.position.needsUpdate = true;
      } else {
        streamMesh.visible = false;
      }

      // Sand scale based on progress
      const remainingRatio = Math.max(0.05, 1 - progressRatio);
      topSandMesh.scale.set(remainingRatio, remainingRatio, remainingRatio);
      const collectedRatio = Math.max(0.05, progressRatio);
      bottomSandMesh.scale.set(collectedRatio, collectedRatio, collectedRatio);

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isRunning, progressRatio]);

  return (
    <div
      ref={mountRef}
      className="w-48 h-48 sm:w-56 sm:h-56 mx-auto cursor-grab active:cursor-grabbing relative flex items-center justify-center"
      title="Interactive 3D Focus Hourglass"
    />
  );
}