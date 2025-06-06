import { useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NavBar from "../components/NavBar";
import { GET_PROJECT } from "../utilities/gql";
import { ProjectRecord, ProjectPatternRecord, Project } from "../utilities/types";
import { Pattern } from "../utilities/Pattern";
import { ThreeCanvas } from "../components/ThreeCanvas";

const projectRecordToProject = (project: ProjectRecord): Project => {
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
    const [project, setProject] = useState<Project>([]);

    // load project data into newProject
    useEffect(() => {
        if (projectData?.project) {
            setProject(projectRecordToProject(projectData.project));
        }
    }, [projectData]);

    return <>
        <NavBar />
        <h1>Project: {projectData?.project?.name}</h1>
        {projectLoading && <p>Loading project...</p>}
        {projectError && <p>Error: {projectError.message}</p>}
        <ThreeCanvas project={project} />
    </>
}

export default ProjectPage;
