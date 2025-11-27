import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";

import styles from '../components/ThreeCanvas.module.css';

const k_spring = 1;
const k_coulomb = 10;

// Simple node class
class Node {
  x = (Math.random() - 0.5) * 15;
  y = (Math.random() - 0.5) * 15;
  z = (Math.random() - 0.5) * 15;
  vx = 0;
  vy = 0;
  vz = 0;
  ax = 0;
  ay = 0;
  az = 0;
}

// Create nodes + edges ONCE
function useGridGraph() {
  return useMemo(() => {
    const nodes: Node[] = [];
    const edges: [number, number][] = [];

    const CIRCUMFERENCE = 12
    const HEIGHT = 5
    for (let i = 0; i < CIRCUMFERENCE; i++) {
      for (let j = 0; j < HEIGHT; j++) {
        nodes.push(new Node());
      }
    }

    // connect grid edges
    for (let i = 0; i < CIRCUMFERENCE; i++) {
      for (let j = 0; j < HEIGHT; j++) {
        const idx = i * HEIGHT + j;
        if (i > 0) edges.push([idx, idx - HEIGHT]);
        if (j > 0) edges.push([idx, idx - 1]);
      }
    }

    // roll into cylinder
    for (let i = 0; i < HEIGHT; i++) {
      const idx1 = i;
      const idx2 = (HEIGHT) * (CIRCUMFERENCE-1) + i
      edges.push([idx1, idx2]); // connect first and last in each row
    }

    // hardcode end
    for (let i = 0; i < 6; i++) {
      nodes.push(new Node());
      const idx1 = nodes.length-1;
      const idx2 = 2 * HEIGHT * i
      edges.push([idx1, idx2])
    }

    for (let i = 0; i < 5; i ++) {
      edges.push([nodes.length - 6 + i, nodes.length - 6 + i + 1])
    }

    edges.push([nodes.length - 1, nodes.length - 6])

    return { nodes, edges };
  }, []);
}

function Simulation({ nodes, edges }: { nodes: Node[]; edges: [number, number][] }) {
  // run physics every frame
  useFrame(() => {
    // reset accelerations
    for (const n of nodes) {
      n.ax = n.ay = n.az = 0;
    }

    // springs
    for (const [i, j] of edges) {
      const a = nodes[i];
      const b = nodes[j];
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const dz = b.z - a.z;
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) || 0.001;

      const force = k_spring * (dist - 1);
      const fx = (dx / dist) * force;
      const fy = (dy / dist) * force;
      const fz = (dz / dist) * force;

      a.ax += fx;
      a.ay += fy;
      a.az += fz;
      b.ax -= fx;
      b.ay -= fy;
      b.az -= fz;
    }

const minDist = 0.3; // minimum allowed distance to prevent black holes

// repulsion
for (let i = 0; i < nodes.length; i++) {
  for (let j = i + 1; j < nodes.length; j++) {
    const a = nodes[i];
    const b = nodes[j];
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const dz = b.z - a.z;
    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) || 0.001;

    // clamp distance to avoid extreme forces
    const d = Math.max(dist, minDist);

    const force = k_coulomb / (d * d);
    const fx = -(dx / dist) * force;
    const fy = -(dy / dist) * force;
    const fz = -(dz / dist) * force;

    a.ax += fx;
    a.ay += fy;
    a.az += fz;
    b.ax -= fx;
    b.ay -= fy;
    b.az -= fz;
  }
}


    // integrate
    for (const n of nodes) {
      n.vx += n.ax;
      n.vy += n.ay;
      n.vz += n.az;
      
      const DAMPING = 0.6;
      n.vx *= DAMPING;
      n.vy *= DAMPING;
      n.vz *= DAMPING;
      // // const speedLimit = 0.5;

      // n.vx = Math.max(-speedLimit, Math.min(speedLimit, n.vx));
      // n.vy = Math.max(-speedLimit, Math.min(speedLimit, n.vy));
      // n.vz = Math.max(-speedLimit, Math.min(speedLimit, n.vz));

      const INTEGRATION_TIME = 0.02; // adjust for frame rate
      n.x += n.vx * INTEGRATION_TIME;
      n.y += n.vy * INTEGRATION_TIME;
      n.z += n.vz * INTEGRATION_TIME;
    }
  });

  return null;
}

function NodeSpheres({ nodes }: { nodes: Node[] }) {
  return (
    <>
      {nodes.map((node, i) => (
        <NodeSphere key={i} node={node} />
      ))}
    </>
  );
}

function NodeSphere({ node }: { node: Node }) {
  const ref = useRef<THREE.Mesh>(null!);

  useFrame(() => {
    // Push physics results into mesh transform
    ref.current.position.set(node.x, node.y, node.z);
  });

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.1, 16, 16]} />
      <meshStandardMaterial color="black" />
    </mesh>
  );
}

function EdgeLines({ nodes, edges }: { nodes: Node[]; edges: [number, number][] }) {
  const ref = useRef<THREE.LineSegments>(null!);

  // Float32Array stores all positions: 2 points per edge × 3 coordinates
  const positions = useMemo(() => new Float32Array(edges.length * 2 * 3), [edges.length]);

  useFrame(() => {
    let k = 0;
    for (const [i, j] of edges) {
      const a = nodes[i];
      const b = nodes[j];
      positions[k++] = a.x;
      positions[k++] = a.y;
      positions[k++] = a.z;
      positions[k++] = b.x;
      positions[k++] = b.y;
      positions[k++] = b.z;
    }
    if (ref.current) {
      ref.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <lineSegments ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]} // ✅ This is the correct way in R3F TS
        />
      </bufferGeometry>
      <lineBasicMaterial color="gray" />
    </lineSegments>
  );
}

export default function TestPage() {
  const { nodes, edges } = useGridGraph();

  return (
        <div className={styles.canvasContainer}>
            <div className={styles.canvasControls}>
                🖱️ Drag to rotate • Scroll to zoom • Right-click to pan
            </div>
            <Canvas camera={{ position: [10, 10, 10] }}>
              <ambientLight />
              <OrbitControls />
              <Simulation nodes={nodes} edges={edges} />
              <NodeSpheres nodes={nodes} />
              <EdgeLines nodes={nodes} edges={edges} />/
            </Canvas>
        </div>
  );
}
