import * as THREE from 'three'
import { TransformedPattern } from '../utilities/types';

const SPHERE_RADIUS = 0.65;
const SPHERE_SEGMENTS = 32;
const SHADOW_SCALE = 1.05;

export const ThreeModel = ({transformedPattern}: {transformedPattern: TransformedPattern}) => {
    const { patternPoints, transform } = transformedPattern;
    const { x, y, z, rotX, rotY, rotZ } = transform || { x: 0, y: 0, z: 0, rotX: 0, rotY: 0, rotZ: 0 };

    return (
        <>
            {/* Enhanced lighting */}
            <directionalLight position={[10, 10, 5]} intensity={0.8} castShadow />
            <pointLight position={[-10, -10, -5]} intensity={0.3} color="#ffffff" />
            
            {patternPoints.map(({color, points}, index) => (
                <group 
                    key={index}
                    position={[x, y, z]}
                    rotation={
                        ([rotX, rotY, rotZ].map(r => r * Math.PI / 180) as [number, number, number])
                    }
                >
                    {points.map((point, i) => (
                        <group key={`${index}-${i}`}>
                            {/* Enhanced shadow with better material */}
                            <mesh 
                                scale={SHADOW_SCALE} 
                                position={new THREE.Vector3(...point)}
                                receiveShadow
                            >
                                <sphereGeometry args={[SPHERE_RADIUS, SPHERE_SEGMENTS, SPHERE_SEGMENTS]} />
                                <meshStandardMaterial 
                                    color={color === "black" ? "#2a2a2a" : "#e5e5e5"} 
                                    side={THREE.BackSide}
                                    transparent
                                    opacity={0.3}
                                    roughness={0.8}
                                />
                            </mesh>
                            
                            {/* Main sphere with enhanced material */}
                            <mesh 
                                position={new THREE.Vector3(...point)}
                                castShadow
                                receiveShadow
                            >
                                <sphereGeometry args={[SPHERE_RADIUS, SPHERE_SEGMENTS, SPHERE_SEGMENTS]} />
                                <meshStandardMaterial 
                                    color={color}
                                    roughness={0.85}
                                    metalness={0.0}
                                    envMapIntensity={0.2}
                                />
                            </mesh>
                        </group>
                    ))}
                </group>
            ))}
        </>
    )
}
