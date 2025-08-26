import { useQuery } from '@apollo/client';
import { GET_PROJECTS } from '../utilities/gql';
import Layout from './Layout';
import styles from './AllProjectsPage.module.css';

const AllProjectsPage = () => {
    const { loading, error, data } = useQuery(GET_PROJECTS);

    return (
        <Layout>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>All Projects</h1>
                    <p className={styles.subtitle}>
                        Browse and manage all your 3D yarn crafting projects
                    </p>
                </div>

                {data?.allProjects && data.allProjects.length === 0 ? (
                    <div className={styles.emptyState}>
                        <div className={styles.emptyStateIcon}>🧶</div>
                        <h2 className={styles.emptyStateTitle}>No Projects Yet</h2>
                        <p className={styles.emptyStateText}>
                            Create your first project to get started with 3D yarn crafting!
                        </p>
                    </div>
                ) : (
                    <table className={styles.projectsTable}>
                        <thead>
                            <tr>
                                <th>Project ID</th>
                                <th>Project Name</th>
                                <th>Description</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading && (
                                <tr>
                                    <td colSpan={4} className={styles.loadingRow}>
                                        Loading projects...
                                    </td>
                                </tr>
                            )}
                            {error && (
                                <tr>
                                    <td colSpan={4} className={styles.errorRow}>
                                        Error: {error.message}
                                    </td>
                                </tr>
                            )}
                            {data?.allProjects.map((project: { id: string; name: string; description: string }) => (
                                <tr key={project.id}>
                                    <td>{project.id}</td>
                                    <td>{project.name}</td>
                                    <td>{project.description}</td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                            <a 
                                                href={`/project/${project.id}`}
                                                className={styles.viewProjectLink}
                                            >
                                                View Project
                                            </a>
                                            <a 
                                                href={`/instructions/project/${project.id}`}
                                                className={styles.instructionsLink}
                                            >
                                                Instructions
                                            </a>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </Layout>
    );
}

export default AllProjectsPage;
