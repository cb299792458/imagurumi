import { useMemo, useRef } from "react";
import { PhysicsEdge, PhysicsNode } from "./TestClasses";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export function NodeSpheres({
    nodes,
    radius = 0.1,
    color = "black",
}: {
    nodes: PhysicsNode[];
    radius?: number;
    color?: string;
}) {
    return (
        <>
            {nodes.map((node, i) => (
                <NodeSphere key={i} node={node} radius={radius} color={color} />
            ))}
        </>
    );
}

export function NodeSphere({
    node,
    radius,
    color,
}: {
    node: PhysicsNode;
    radius: number;
    color: string;
}) {
    const ref = useRef<THREE.Mesh>(null!);

    useFrame(() => {
        ref.current.position.set(node.x, node.y, node.z);
    });

    return (
        <mesh ref={ref}>
            <sphereGeometry args={[radius, 16, 16]} />
            <meshStandardMaterial color={color} />
        </mesh>
    );
}

export function EdgeLines({
    nodes,
    edges,
    color = "gray",
}: {
    nodes: PhysicsNode[];
    edges: PhysicsEdge[];
    color?: string;
}) {
    const ref = useRef<THREE.LineSegments>(null!);

    const positions = useMemo(
        () => new Float32Array(edges.length * 2 * 3),
        [edges.length]
    );

    useFrame(() => {
        let i = 0;
        for (const e of edges) {
            const a = nodes[e.nodeI];
            const b = nodes[e.nodeJ];

            positions[i++] = a.x;
            positions[i++] = a.y;
            positions[i++] = a.z;
            positions[i++] = b.x;
            positions[i++] = b.y;
            positions[i++] = b.z;
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
