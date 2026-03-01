import { useQuery } from '@apollo/client';
import { GET_NEW_PROJECTS } from '../utilities/gql';
import Layout from './Layout';
import styles from './AllProjectsPage.module.css';

const AllNewProjectsPage = () => {
    const { loading, error, data } = useQuery(GET_NEW_PROJECTS);

    return (
        <Layout>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>All New Projects</h1>
                    <p className={styles.subtitle}>
                        Browse and manage all your new-pattern 3D projects
                    </p>
                </div>

                {data?.allNewProjects && data.allNewProjects.length === 0 ? (
                    <div className={styles.emptyState}>
                        <div className={styles.emptyStateIcon}>🧶</div>
                        <h2 className={styles.emptyStateTitle}>No New Projects Yet</h2>
                        <p className={styles.emptyStateText}>
                            Create your first new-pattern project to get started!
                        </p>
                    </div>
                ) : (
                    <table className={styles.projectsTable}>
                        <thead>
                            <tr>
                                <th>Project ID</th>
                                <th>Project Name</th>
                                <th>Description</th>
                                <th>Project Links</th>
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
                            {data?.allNewProjects.map((project: { id: string; name: string; description: string | null }) => (
                                <tr key={project.id}>
                                    <td>{project.id}</td>
                                    <td>{project.name}</td>
                                    <td>{project.description ?? ''}</td>
                                    <td>
                                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                            <a
                                                href={`/new-project/${project.id}`}
                                                className={styles.viewProjectLink}
                                            >
                                                View Project
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
};

export default AllNewProjectsPage;
