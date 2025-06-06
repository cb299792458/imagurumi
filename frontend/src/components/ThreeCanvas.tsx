import { OrbitControls } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import { ThreeModel } from "./ThreeModel"
import { Project } from "../utilities/types"

const DEFAULT_SIZE = 50;
const FOV = 75;

export const ThreeCanvas = ({ project }: { project: Project}) => {

    return <div style={{ border: "1px solid red", height: "800px" }}>
        <Canvas camera={{ position: [DEFAULT_SIZE, DEFAULT_SIZE, DEFAULT_SIZE], fov: FOV }}>
            <ambientLight />
            <axesHelper args={[DEFAULT_SIZE]} />
            {project.map((tp, index) => (
                <ThreeModel key={index} transformedPattern={tp}/>
            ))}
            <OrbitControls />
        </Canvas>
    </div>
}
