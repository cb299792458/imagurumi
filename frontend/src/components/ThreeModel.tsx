import * as THREE from 'three'
import { TransformedPattern } from '../utilities/types';

const SPHERE_RADIUS = 0.75;
const SPHERE_SEGMENTS = 32;

export const ThreeModel = ({transformedPattern}: {transformedPattern: TransformedPattern}) => {
    const { patternPoints, transform } = transformedPattern;
    const { x, y, z, rotX, rotY, rotZ } = transform || { x: 0, y: 0, z: 0, rotX: 0, rotY: 0, rotZ: 0 };

    return (
        <>
            {patternPoints.map(({color, points}, index) => (
                <group 
                    key={index}
                    position={[x, y, z]}
                    rotation={
                        ([rotX, rotY, rotZ].map(r => r * Math.PI / 180) as [number, number, number])
                    }
                >
                    {points.map((point, i) => (
                        <mesh key={i} position={new THREE.Vector3(...point)}>
                            <sphereGeometry args={[SPHERE_RADIUS, SPHERE_SEGMENTS, SPHERE_SEGMENTS]} />
                            <meshStandardMaterial color={color}/>
                        </mesh>
                    ))}
                </group>
            ))}
        </>
    )
}
