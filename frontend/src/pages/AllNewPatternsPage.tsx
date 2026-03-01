import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_NEW_PATTERNS } from '../utilities/gql';
import { ThreeCanvas } from '../components/ThreeCanvas';
import { pointsToColoredPoints } from '../utilities/converters';
import Layout from './Layout';
import styles from './AllProjectsPage.module.css';
import modalStyles from './PatternPage.module.css';

interface NewPattern {
    id: number;
    name: string;
    description: string | null;
    text: string;
    userId: number;
    createdAt: string | number;
    points: Array<{
        id: number;
        x: number;
        y: number;
        z: number;
        color: string;
    }>;
}

const AllNewPatternsPage = () => {
    const { loading, error, data } = useQuery(GET_NEW_PATTERNS);
    const [selectedPattern, setSelectedPattern] = useState<NewPattern | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = (pattern: NewPattern) => {
        setSelectedPattern(pattern);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedPattern(null);
    };

    const handleModalOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            closeModal();
        }
    };


    // Format date safely
    const formatDate = (dateValue: string | number | null | undefined): string => {
        if (dateValue === null || dateValue === undefined) return '-';
        try {
            // Handle both string and number timestamps
            const date = typeof dateValue === 'number' 
                ? new Date(dateValue) 
                : new Date(dateValue);
            if (isNaN(date.getTime())) {
                return String(dateValue); // Return original value if invalid
            }
            return date.toLocaleString();
        } catch {
            return String(dateValue); // Return original value on error
        }
    };

    return (
        <Layout>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>All New Patterns</h1>
                    <p className={styles.subtitle}>
                        Browse and manage all your physics-based patterns
                    </p>
                </div>

                {data?.allNewPatterns && data.allNewPatterns.length === 0 ? (
                    <div className={styles.emptyState}>
                        <div className={styles.emptyStateIcon}>🧶</div>
                        <h2 className={styles.emptyStateTitle}>No Patterns Yet</h2>
                        <p className={styles.emptyStateText}>
                            Create your first pattern to get started!
                        </p>
                    </div>
                ) : (
                    <table className={styles.projectsTable}>
                        <thead>
                            <tr>
                                <th>Pattern ID</th>
                                <th>Pattern Name</th>
                                <th>Description</th>
                                <th>Points</th>
                                <th>Created</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading && (
                                <tr>
                                    <td colSpan={6} className={styles.loadingRow}>
                                        Loading patterns...
                                    </td>
                                </tr>
                            )}
                            {error && (
                                <tr>
                                    <td colSpan={6} className={styles.errorRow}>
                                        Error: {error.message}
                                    </td>
                                </tr>
                            )}
                            {data?.allNewPatterns.map((pattern: NewPattern) => (
                                <tr key={pattern.id}>
                                    <td>{pattern.id}</td>
                                    <td>{pattern.name}</td>
                                    <td>{pattern.description || '-'}</td>
                                    <td>{pattern.points.length}</td>
                                    <td>{formatDate(pattern.createdAt)}</td>
                                    <td>
                                        <button 
                                            onClick={() => openModal(pattern)}
                                            className={styles.viewProjectLink}
                                            type="button"
                                        >
                                            View Pattern
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {/* 3D Pattern Modal */}
                {isModalOpen && selectedPattern && (
                    <div className={modalStyles.modalOverlay} onClick={handleModalOverlayClick}>
                        <div className={modalStyles.modalContent}>
                            <div className={modalStyles.modalHeader}>
                                <h2 className={modalStyles.modalTitle}>
                                    {selectedPattern.name} - 3D Visualization
                                </h2>
                                <button 
                                    onClick={closeModal}
                                    className={modalStyles.modalCloseButton}
                                    aria-label="Close modal"
                                >
                                    ×
                                </button>
                            </div>
                            <div className={modalStyles.modalBody}>
                                <div className={modalStyles.threeCanvasContainer}>
                                    {selectedPattern.points.length > 0 ? (
                                        <ThreeCanvas project={[{patternPoints: pointsToColoredPoints(selectedPattern.points)}]} />
                                    ) : (
                                        <div className={modalStyles.canvasPlaceholder}>
                                            No points to display
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}

export default AllNewPatternsPage;
