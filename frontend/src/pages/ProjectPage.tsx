import { useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { GET_PROJECT } from "../utilities/gql";
import { Project } from "../utilities/types";
import { ThreeCanvas } from "../components/ThreeCanvas";
import Layout from "./Layout";
import { projectRecordToProject } from "../utilities/converters";

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

    return <Layout>
        <h1>Project: {projectData?.project?.name}</h1>
        {projectLoading && <p>Loading project...</p>}
        {projectError && <p>Error: {projectError.message}</p>}
        <ThreeCanvas project={project} />
    </Layout>
}

export default ProjectPage;
