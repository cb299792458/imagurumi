import { useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import { GET_PROJECT } from "../utilities/gql";
import { ProjectRecord, ProjectPatternRecord, Project, PatternRecord, Transform, transforms, TransformKey } from "../utilities/types";
import { Pattern } from "../utilities/Pattern";
import { ThreeCanvas } from "../components/ThreeCanvas";

const recordToProject = (project: ProjectRecord): Project => {
    return project.projectPatterns.map((projectPattern: ProjectPatternRecord) => {
        const { pattern, x, y, z, rotX, rotY, rotZ } = projectPattern;
        const patternInstance = new Pattern(pattern.text);
        const patternPoints = patternInstance.toPatternPoints();

        return {
            patternId: pattern.id,
            patternPoints,
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
    const { loading: projectLoading, error: projectError, data: projectData } = useQuery(GET_PROJECT, { variables: {id: parseInt(id || '')} });
    const [patterns, setPatterns] = useState<PatternRecord[]>([]);
    const [project, setProject] = useState<Project>([]);

    // load project data into newProject
    useEffect(() => {
        if (projectData?.project) {
            const projectPatterns = recordToProject(projectData.project);
            setProject(projectPatterns);
            setPatterns(projectData.project.projectPatterns.map((pp: ProjectPatternRecord) => pp.pattern));
        }
    }, [projectData]);

    // load a new pattern into project
    useEffect(() => {
        setProject((prev) =>
            patterns.map((pattern: PatternRecord, i: number) => {
                const existing = prev[i];
                const patternInstance = new Pattern(pattern.text);
                const patternPoints = patternInstance.toPatternPoints();
                return {
                    patternId: pattern.id,
                    patternPoints,
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
    }, [patterns]);

    return <>
        <NavBar />
        <h1>Project: {projectData?.project?.name}</h1>
        {projectLoading && <p>Loading project...</p>}
        {projectError && <p>Error: {projectError.message}</p>}
        <ThreeCanvas project={project} />
    </>
}

export const PatternTransformer = ({
    index, 
    project, 
    setProject
}: {
    index: number, 
    project: Project, 
    setProject: React.Dispatch<React.SetStateAction<Project>>
}) => {

    return (
        <div style={{ display: 'flex' }}>
        {transforms.map((transform: TransformKey) => (
                <div key={transform}>
                    <label>{transform}</label>
                    <input type="number" 
                        value={project[index]?.transform?.[transform] ?? 0}
                        onChange={(e) => {
                            const newTransform = { ...project[index].transform, [transform]: parseFloat(e.target.value) };
                            setProject((prev: Project) => {
                                const newModels = [...prev];
                                newModels[index] = { ...newModels[index], transform: newTransform as Transform};
                                return newModels;
                            });
                        }} 
                    />
                </div>
            ))
        }
        </div>
    )
}

export default ProjectPage;
