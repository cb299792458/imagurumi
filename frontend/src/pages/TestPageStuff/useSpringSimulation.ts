// physics/useSpringSimulation.ts
import { useFrame } from "@react-three/fiber";
import { PhysicsNode } from "./TestClasses"

interface SimulationParams {
    nodes: PhysicsNode[];
    kSpring?: number;
    kCoulomb?: number;
    damping?: number;
    dt?: number;
    minDist?: number;
}

export function useSpringSimulation({
    nodes,
    kSpring = 1,
    kCoulomb = 5,
    damping = 0.5,
    dt = 0.02,
    minDist = 0.3,
}: SimulationParams) {
    useFrame(() => {
        // reset forces
        for (const n of nodes) {
            n.ax = n.ay = n.az = 0;
        }

        // springs
        const nodeIndexMap = new Map<PhysicsNode, number>();
        nodes.forEach((node, index) => nodeIndexMap.set(node, index));
        const processed = new Set<string>();
        for (const n1 of nodes) {
            for (const n2 of n1.neighbors) {
                // Avoid processing the same edge twice (A->B and B->A)
                const idx1 = nodeIndexMap.get(n1)!;
                const idx2 = nodeIndexMap.get(n2)!;
                const key1 = `${idx1}-${idx2}`;
                const key2 = `${idx2}-${idx1}`;
                if (processed.has(key1) || processed.has(key2)) continue;
                processed.add(key1);

                const dx = n2.x - n1.x;
                const dy = n2.y - n1.y;
                const dz = n2.z - n1.z;

                const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) || 0.001;
                const restLength = n1.restLength;
                const force = kSpring * (dist - restLength);
                const inv = 1 / dist;

                const fx = dx * inv * force;
                const fy = dy * inv * force;
                const fz = dz * inv * force;

                n1.ax += fx;
                n1.ay += fy;
                n1.az += fz;
                n2.ax -= fx;
                n2.ay -= fy;
                n2.az -= fz;
            }
        }

        // repulsion
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const a = nodes[i];
                const b = nodes[j];

                const dx = b.x - a.x;
                const dy = b.y - a.y;
                const dz = b.z - a.z;

                const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) || 0.001;
                const d = Math.max(dist, minDist);

                const force = kCoulomb / (d * d);
                const inv = 1 / dist;

                const fx = -dx * inv * force;
                const fy = -dy * inv * force;
                const fz = -dz * inv * force;

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
            n.vx = (n.vx + n.ax * dt) * damping;
            n.vy = (n.vy + n.ay * dt) * damping;
            n.vz = (n.vz + n.az * dt) * damping;

            n.x += n.vx;
            n.y += n.vy;
            n.z += n.vz;
        }
    });
}
