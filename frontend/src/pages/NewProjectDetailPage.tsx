import { useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { GET_NEW_PROJECT } from "../utilities/gql";
import { Project } from "../utilities/types";
import { ThreeCanvas } from "../components/ThreeCanvas";
import Layout from "./Layout";
import { newProjectRecordToProject } from "../utilities/converters";
import styles from './ProjectPage.module.css';

const NewProjectDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const projectId = id ? parseInt(id, 10) : null;
    const { loading: projectLoading, error: projectError, data: projectData } = useQuery(GET_NEW_PROJECT, {
        variables: { id: projectId },
        skip: !projectId || isNaN(projectId),
    });
    const [project, setProject] = useState<Project>([]);

    useEffect(() => {
        if (projectData?.newProject) {
            setProject(newProjectRecordToProject(projectData.newProject));
        }
    }, [projectData]);

    return (
        <Layout>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>
                        New Project: {projectData?.newProject?.name || 'Loading...'}
                    </h1>
                </div>

                <div className={styles.actions}>
                    <a href="/all-new-projects" className={styles.backLink}>
                        ← Back to New Projects
                    </a>
                </div>

                {projectData?.newProject?.description && (
                    <div className={styles.projectInfo}>
                        <h3 className={styles.projectInfoTitle}>Description</h3>
                        <p className={styles.projectInfoText}>
                            {projectData.newProject.description}
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
    );
};

export default NewProjectDetailPage;
