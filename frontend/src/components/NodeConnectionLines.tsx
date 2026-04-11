import { useLayoutEffect, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { PhysicsNode } from '../pages/TestPageStuff/TestClasses';

const EDGE_COLOR = '#64748b';
const EDGE_OPACITY = 0.55;

/**
 * Renders each graph edge once (undirected) using current node positions.
 */
export function NodeConnectionLines({ nodes }: { nodes: PhysicsNode[] }) {
    const geomRef = useRef<THREE.BufferGeometry>(null);

    useLayoutEffect(() => {
        const geom = geomRef.current;
        if (!geom) {
            return;
        }
        geom.setAttribute(
            'position',
            new THREE.Float32BufferAttribute(new Float32Array([0, 0, 0, 0, 0, 0]), 3)
        );
        geom.setDrawRange(0, 0);
    }, []);

    useFrame(() => {
        const geom = geomRef.current;
        if (!geom) {
            return;
        }

        const coords: number[] = [];
        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];
            for (const neighbor of node.neighbors) {
                const j = nodes.indexOf(neighbor);
                if (j === -1 || i >= j) {
                    continue;
                }
                coords.push(node.x, node.y, node.z, neighbor.x, neighbor.y, neighbor.z);
            }
        }

        const count = coords.length / 3;
        if (count === 0) {
            geom.setDrawRange(0, 0);
            return;
        }

        const attr = new THREE.Float32BufferAttribute(new Float32Array(coords), 3);
        geom.setAttribute('position', attr);
        geom.setDrawRange(0, count);
        geom.computeBoundingSphere();
    });

    return (
        <lineSegments frustumCulled={false} renderOrder={-1}>
            <bufferGeometry ref={geomRef} />
            <lineBasicMaterial
                color={EDGE_COLOR}
                transparent
                opacity={EDGE_OPACITY}
                depthTest
                depthWrite={false}
            />
        </lineSegments>
    );
}
