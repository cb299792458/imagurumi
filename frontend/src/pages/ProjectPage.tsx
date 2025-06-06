import { useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { ThreeModel } from "./PatternPage";
import { useParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import { GET_PROJECT } from "../utilities/gql";
import { ProjectRecord, ProjectPatternRecord, Project, PatternRecord, Transform } from "../utilities/types";
import { Pattern } from "../utilities/Pattern";

const recordToProject = (project: ProjectRecord): Project => {
    return project.projectPatterns.map((projectPattern: ProjectPatternRecord) => {
        const { pattern, x, y, z, rotX, rotY, rotZ } = projectPattern;
        const patternInstance = new Pattern(pattern.text);
        const modelRows = patternInstance.rowsToPoints();
        return {
            patternId: pattern.id,
            modelRows,
            transform: {
                x,
                y,
                z,
                rotX,
                rotY,
                rotZ,
            }
        }
    });
}

const ProjectPage = () => {
    const { id } = useParams<{ id: string }>();
    // const { loading: patternLoading, error: patternError, data: patternData } = useQuery(GET_PATTERNS);
    const { loading: projectLoading, error: projectError, data: projectData } = useQuery(GET_PROJECT, { variables: {id: parseInt(id || '')} });
    const [newProject, setNewProject] = useState<PatternRecord[]>([]);
    const [transformedModels, setTransformedModels] = useState<Project>([]);
    // const [selectedPatternIndex, setSelectedPatternIndex] = useState<number>(-1);

    // load project data into newProject
    useEffect(() => {
        if (projectData?.project) {
            const projectPatterns = recordToProject(projectData.project);
            setTransformedModels(projectPatterns);
            setNewProject(projectData.project.projectPatterns.map((pp: ProjectPatternRecord) => pp.pattern));
        }
    }, [projectData]);

    // load a new pattern into project
    useEffect(() => {
        setTransformedModels((prev) =>
            newProject.map((pattern: PatternRecord, i: number) => {
                const existing = prev[i];
                const patternInstance = new Pattern(pattern.text);
                const modelRows = patternInstance.rowsToPoints();
                return {
                    patternId: pattern.id,
                    modelRows,
                    transform: existing?.transform || {
                        x: 0,
                        y: 0,
                        z: 0,
                        rotX: 0,
                        rotY: 0,
                        rotZ: 0,
                    },
                };
            })
        );
    }, [newProject]);

    return <>
        <NavBar />
        <h1>Project: {projectData?.project?.name}</h1>
        {projectLoading && <p>Loading project...</p>}
        {projectError && <p>Error: {projectError.message}</p>}
        <div style={{ border: "1px solid red", height: "500px" }}>
            <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
                <ambientLight />
                <axesHelper args={[50]} />
                {transformedModels.map((model, index) => (
                    <ThreeModel key={index} transformedPattern={model}/>
                ))}
                <OrbitControls />
            </Canvas>
        </div>
    </>
}

export const PatternTransformer = ({index, transformedModels, setTransformedModels}: {index: number, transformedModels: Project, setTransformedModels: React.Dispatch<React.SetStateAction<Project>>;}) => {
    type TransformKey = 'x' | 'y' | 'z' | 'rotX' | 'rotY' | 'rotZ';
    const transforms: TransformKey[] = ['x', 'y', 'z', 'rotX', 'rotY', 'rotZ'];

    return (
        <div style={{ display: 'flex' }}>
        {transforms.map((transform: TransformKey) => (
                <div key={transform}>
                    <label>{transform}</label>
                    <input type="number" 
                      value={transformedModels[index]?.transform?.[transform] ?? 0}
                    onChange={(e) => {
                        const newTransform = { ...transformedModels[index].transform, [transform]: parseFloat(e.target.value) };
                        setTransformedModels((prev: Project) => {
                            const newModels = [...prev];
                            newModels[index] = { ...newModels[index], transform: newTransform as Transform};
                            return newModels;
                        });
                    }} />
                </div>
            ))
        }
        </div>
    )
}

export default ProjectPage;
