import { useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { PhysicsNode } from '../pages/TestPageStuff/TestClasses';
import { useSpringSimulation } from '../pages/TestPageStuff/useSpringSimulation';
import { ThreeModel } from './ThreeModel';
import { ColoredPoints } from '../utilities/types';
import { nodesToColoredPoints } from '../utilities/converters';
import styles from './ThreeCanvas.module.css';

interface PhysicsPatternViewProps {
    nodes: PhysicsNode[];
}

const DEFAULT_SIZE = 50;
const FOV = 75;

// Component that runs inside Canvas to convert nodes to ColoredPoints on each frame
const PhysicsPatternModel = ({ nodes }: { nodes: PhysicsNode[] }) => {
    const [points, setPoints] = useState<ColoredPoints[]>(() => {
        return nodesToColoredPoints(nodes);
    });

    // Run physics simulation (faster with increased dt)
    useSpringSimulation({ nodes, dt: 0.08 });

    // Update points on each frame
    useFrame(() => {
        setPoints(nodesToColoredPoints(nodes));
    });
    
    return (
        <ThreeModel transformedPattern={{ patternPoints: points }} />
    );
};

export const PhysicsPatternView = ({ nodes }: PhysicsPatternViewProps) => {
    return (
        <div className={styles.canvasContainer}>
            <div className={styles.canvasControls}>
                🖱️ Drag to rotate • Scroll to zoom • Right-click to pan
            </div>
            <Canvas 
                camera={{ position: [DEFAULT_SIZE, DEFAULT_SIZE, DEFAULT_SIZE], fov: FOV }}
                shadows
                gl={{ antialias: true }}
            >
                <ambientLight intensity={0.4} />
                <directionalLight 
                    position={[10, 10, 5]} 
                    intensity={1} 
                    castShadow 
                    shadow-mapSize={[2048, 2048]}
                />
                <pointLight position={[-10, -10, -5]} intensity={0.5} color="#ffffff" />
                
                {/* Ground plane for shadows */}
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -DEFAULT_SIZE, 0]} receiveShadow>
                    <planeGeometry args={[DEFAULT_SIZE * 2, DEFAULT_SIZE * 2]} />
                    <meshStandardMaterial color="#f3f4f6" transparent opacity={0.1} />
                </mesh>
                
                {/* Axes helper */}
                <axesHelper args={[DEFAULT_SIZE]} />
                
                {/* Physics simulation and rendering */}
                <PhysicsPatternModel nodes={nodes} />
                
                {/* Enhanced camera controls */}
                <OrbitControls 
                    enablePan={true}
                    enableZoom={true}
                    enableRotate={true}
                    minDistance={10}
                    maxDistance={200}
                    autoRotate={false}
                    autoRotateSpeed={1}
                />
            </Canvas>
        </div>
    );
};
