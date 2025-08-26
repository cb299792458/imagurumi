import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_PATTERNS } from '../utilities/gql';
import { PatternRecord, PatternPoints } from '../utilities/types';
import Layout from './Layout';
import { CreatePatternForm } from '../components/CreatePatternForm';
import { ThreeCanvas } from '../components/ThreeCanvas';
import styles from './PatternPage.module.css';
import { Pattern } from '../utilities/Pattern';
import { textToPatternInstance } from '../utilities/converters';

const PatternPage: React.FC = () => {
    const [text, setText] = useState<string>('');
    const [patternPoints, setPatternPoints] = useState<PatternPoints>([]);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const { loading, error, data, refetch } = useQuery(GET_PATTERNS);

    const handleText = () => {
        if (!text.trim()) {
            setErrorMessage('Please enter a pattern');
            return;
        }

        try {
            const pattern: Pattern = textToPatternInstance(text);
            setPatternPoints(pattern.toPatternPoints());

            setErrorMessage('');
            setIsModalOpen(true); // Open modal when pattern is visualized
        } catch {
            setErrorMessage('Error processing pattern');
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleModalOverlayClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            closeModal();
        }
    };

    return (
        <Layout>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Pattern Creator</h1>
                </div>

                {errorMessage && (
                    <div className={styles.errorMessage}>
                        {errorMessage}
                    </div>
                )}

                <div className={styles.mainContent}>
                    {/* Left Panel - Create Pattern Form */}
                    <div className={styles.leftPanel}>
                        <CreatePatternForm text={text} refetch={refetch}/>
                    </div>

                    {/* Center Panel - Pattern Text Input */}
                    <div className={styles.centerPanel}>
                        <div className={styles.patternInput}>
                            <label htmlFor="pattern-text" className={styles.inputLabel}>
                                Pattern Text
                            </label>
                            <textarea
                                id="pattern-text"
                                className={styles.textarea}
                                placeholder="Paste your pattern here...&#10;&#10;Example:&#10;@crochet-spiral&#10;6&#10;12&#10;18&#10;# Change to blue yarn&#10;24"
                                rows={8}
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                            />
                            <button onClick={handleText} className={styles.imagineButton}>
                                🎨 Visualize Pattern
                            </button>
                        </div>
                    </div>

                    {/* Right Panel - Saved Patterns Table */}
                    <div className={styles.rightPanel}>
                        <h3 className={styles.inputLabel}>Saved Patterns</h3>
                        <table className={styles.patternsTable}>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Description</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading && (
                                    <tr>
                                        <td colSpan={4} className={styles.loadingRow}>
                                            Loading patterns...
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
                                {data && data.allPatterns.map((pattern: PatternRecord) => (
                                    <tr key={pattern.id}>
                                        <td>{pattern.id}</td>
                                        <td>{pattern.name}</td>
                                        <td>{pattern.description}</td>
                                        <td>
                                            <button 
                                                onClick={() => setText(pattern.text)}
                                                className={styles.loadPatternButton}
                                            >
                                                Load
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* 3D Model Modal */}
                {isModalOpen && (
                    <div className={styles.modalOverlay} onClick={handleModalOverlayClick}>
                        <div className={styles.modalContent}>
                            <div className={styles.modalHeader}>
                                <h2 className={styles.modalTitle}>3D Pattern Visualization</h2>
                                <button 
                                    onClick={closeModal}
                                    className={styles.modalCloseButton}
                                    aria-label="Close modal"
                                >
                                    ×
                                </button>
                            </div>
                            <div className={styles.modalBody}>
                                <div className={styles.threeCanvasContainer}>
                                    {patternPoints.length > 0 ? (
                                        <ThreeCanvas project={[{patternPoints}]} />
                                    ) : (
                                        <div className={styles.canvasPlaceholder}>
                                            Enter a pattern and click "Visualize Pattern" to see the 3D preview
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
};

export default PatternPage;
