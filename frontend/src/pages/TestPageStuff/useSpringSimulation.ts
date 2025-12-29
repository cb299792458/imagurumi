// physics/useSpringSimulation.ts
import { useFrame } from "@react-three/fiber";
import { PhysicsNode, PhysicsEdge } from "./TestClasses"

interface SimulationParams {
    nodes: PhysicsNode[];
    edges: PhysicsEdge[];
    kSpring?: number;
    kCoulomb?: number;
    damping?: number;
    dt?: number;
    minDist?: number;
}

export function useSpringSimulation({
    nodes,
    edges,
    kSpring = 1,
    kCoulomb = 10,
    damping = 0.6,
    dt = 0.02,
    minDist = 0.3,
}: SimulationParams) {
    useFrame(() => {
        // reset forces
        for (const n of nodes) {
            n.ax = n.ay = n.az = 0;
        }

        // springs
        for (const { nodeI, nodeJ, restLength } of edges) {
            const n1 = nodes[nodeI];
            const n2 = nodes[nodeJ];

            const dx = n2.x - n1.x;
            const dy = n2.y - n1.y;
            const dz = n2.z - n1.z;

            const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) || 0.001;
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
