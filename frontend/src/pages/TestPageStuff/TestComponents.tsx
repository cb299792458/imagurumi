import { useMemo, useRef } from "react";
import { PhysicsNode } from "./TestClasses";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const SHADOW_SCALE = 1.05;
const SPHERE_SCALE = 0.95;

export function NodeSpheres({
    nodes,
    radius = 2.5,
}: {
    nodes: PhysicsNode[];
    radius?: number;
}) {
    return (
        <>
            {nodes.map((node, i) => (
                <NodeSphere key={i} node={node} radius={radius} />
            ))}
        </>
    );
}

export function NodeSphere({
    node,
    radius,
}: {
    node: PhysicsNode;
    radius: number;
}) {
    const ref = useRef<THREE.Group>(null!);

    useFrame(() => {
        ref.current.position.set(node.x, node.y, node.z);
    });

    return (
        <group ref={ref}>
            {/* Shadow using back half of sphere */}
            <mesh scale={SHADOW_SCALE}>
                <sphereGeometry args={[radius, 16, 16]} />
                <meshStandardMaterial 
                    color="black"
                    side={THREE.BackSide}
                    transparent
                    opacity={0.3}
                    roughness={0.8}
                />
            </mesh>
            
            {/* Main sphere */}
            <mesh scale={SPHERE_SCALE}>
                <sphereGeometry args={[radius, 16, 16]} />
                <meshStandardMaterial 
                    color={node.color ?? "#b3b3b3"}
                    roughness={0.85}
                    metalness={0.0}
                />
            </mesh>
        </group>
    );
}

export function EdgeLines({
    nodes,
    color = "gray",
}: {
    nodes: PhysicsNode[];
    color?: string;
}) {
    const ref = useRef<THREE.LineSegments>(null!);

    const edgeCount = useMemo(() => {
        let count = 0;
        const nodeIndexMap = new Map<PhysicsNode, number>();
        nodes.forEach((node, index) => nodeIndexMap.set(node, index));
        const processed = new Set<string>();
        for (const n1 of nodes) {
            for (const n2 of n1.neighbors) {
                const idx1 = nodeIndexMap.get(n1)!;
                const idx2 = nodeIndexMap.get(n2)!;
                const key1 = `${idx1}-${idx2}`;
                const key2 = `${idx2}-${idx1}`;
                if (!processed.has(key1) && !processed.has(key2)) {
                    processed.add(key1);
                    count++;
                }
            }
        }
        return count;
    }, [nodes]);

    const positions = useMemo(
        () => new Float32Array(edgeCount * 2 * 3),
        [edgeCount]
    );

    useFrame(() => {
        let i = 0;
        const nodeIndexMap = new Map<PhysicsNode, number>();
        nodes.forEach((node, index) => nodeIndexMap.set(node, index));
        const processed = new Set<string>();
        for (const n1 of nodes) {
            for (const n2 of n1.neighbors) {
                const idx1 = nodeIndexMap.get(n1)!;
                const idx2 = nodeIndexMap.get(n2)!;
                const key1 = `${idx1}-${idx2}`;
                const key2 = `${idx2}-${idx1}`;
                if (processed.has(key1) || processed.has(key2)) continue;
                processed.add(key1);

                positions[i++] = n1.x;
                positions[i++] = n1.y;
                positions[i++] = n1.z;
                positions[i++] = n2.x;
                positions[i++] = n2.y;
                positions[i++] = n2.z;
            }
        }

        ref.current.geometry.attributes.position.needsUpdate = true;
    });

    return (
        <lineSegments ref={ref}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" args={[positions, 3]} />
            </bufferGeometry>
            <lineBasicMaterial color={color} />
        </lineSegments>
    );
}
