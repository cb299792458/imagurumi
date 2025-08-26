import { OrbitControls } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import { ThreeModel } from "./ThreeModel"
import { Project } from "../utilities/types"
import styles from './ThreeCanvas.module.css';

const DEFAULT_SIZE = 50;
const FOV = 75;

export const ThreeCanvas = ({ project }: { project: Project}) => {

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
                Enhanced lighting setup
                <ambientLight intensity={0.4} />
                <directionalLight 
                    position={[10, 10, 5]} 
                    intensity={1} 
                    castShadow 
                    shadow-mapSize-width={2048}
                    shadow-mapSize-height={2048}
                />
                <pointLight position={[-10, -10, -5]} intensity={0.5} color="#ffffff" />
                
                {/* Ground plane for shadows */}
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -DEFAULT_SIZE, 0]} receiveShadow>
                    <planeGeometry args={[DEFAULT_SIZE * 2, DEFAULT_SIZE * 2]} />
                    <meshStandardMaterial color="#f3f4f6" transparent opacity={0.1} />
                </mesh>
                
                {/* Axes helper */}
                <axesHelper args={[DEFAULT_SIZE]} />
                
                {/* Render project patterns */}
                {project.map((tp, index) => (
                    <ThreeModel key={index} transformedPattern={tp}/>
                ))}
                
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
    )
}
