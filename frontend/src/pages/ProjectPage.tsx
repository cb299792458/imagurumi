import { useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { GET_PROJECT } from "../utilities/gql";
import { Project } from "../utilities/types";
import { ThreeCanvas } from "../components/ThreeCanvas";
import Layout from "./Layout";
import { projectRecordToProject } from "../utilities/converters";
import styles from './ProjectPage.module.css';

const ProjectPage = () => {
    const { id } = useParams<{ id: string }>();
    const projectId = id ? parseInt(id, 10) : null;
    const { loading: projectLoading, error: projectError, data: projectData } = useQuery(GET_PROJECT, { 
        variables: { id: projectId },
        skip: !projectId || isNaN(projectId)
    });
    const [ project, setProject ] = useState<Project>([]);

    // load project data into newProject
    useEffect(() => {
        if (projectData?.project) {
            setProject(projectRecordToProject(projectData.project));
        }
    }, [projectData]);

    return (
        <Layout>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>
                        Project: {projectData?.project?.name || 'Loading...'}
                    </h1>
                </div>

                <div className={styles.actions}>
                    <a href="/all-projects" className={styles.backLink}>
                        ← Back to Projects
                    </a>
                    <a href={`/instructions/project/${id}`} className={styles.instructionsLink}>
                        📖 View Instructions
                    </a>
                </div>

                {projectData?.project?.description && (
                    <div className={styles.projectInfo}>
                        <h3 className={styles.projectInfoTitle}>Description</h3>
                        <p className={styles.projectInfoText}>
                            {projectData.project.description}
                        </p>
                    </div>
                )}

                {projectLoading && (
                    <p className={styles.loadingText}>Loading project...</p>
                )}
                
                {projectError && (
                    <p className={styles.errorText}>
                        Error: {projectError.message}
                    </p>
                )}

                <div className={styles.threeCanvasContainer}>
                    <ThreeCanvas project={project} />
                </div>
            </div>
        </Layout>
    )
}

export default ProjectPage;
